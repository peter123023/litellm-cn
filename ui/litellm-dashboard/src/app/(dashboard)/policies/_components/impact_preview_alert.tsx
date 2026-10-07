import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/shared/Alert";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Info } from "lucide-react";
import { useTranslation } from "@/i18n";

interface ImpactResult {
  affected_keys_count: number;
  affected_teams_count: number;
  sample_keys: string[];
  sample_teams: string[];
}

interface ImpactPreviewAlertProps {
  impactResult: ImpactResult;
  isDefault?: boolean;
}

interface SampleListProps {
  label: string;
  samples: string[];
  totalCount: number;
  moreLabel: string;
}

const SampleList: React.FC<SampleListProps> = ({ label, samples, totalCount, moreLabel }) => (
  <div className="mt-1 flex flex-wrap items-center gap-1">
    <span className="text-xs text-muted-foreground">{label}: </span>
    {samples.slice(0, 5).map((sample) => (
      <Badge key={sample} variant="outline">
        {sample}
      </Badge>
    ))}
    {totalCount > 5 && <span className="text-xs text-muted-foreground">{moreLabel}</span>}
  </div>
);

const ImpactPreviewAlert: React.FC<ImpactPreviewAlertProps> = ({ impactResult, isDefault = false }) => {
  const { t } = useTranslation();
  const isGlobal = impactResult.affected_keys_count === -1;
  const qualifier = isDefault ? t("policies.impact.qualifierUpTo") : "";
  const keyCount =
    impactResult.affected_keys_count === 1
      ? t("policies.impact.keyOne", { count: impactResult.affected_keys_count })
      : t("policies.impact.keyOther", { count: impactResult.affected_keys_count });
  const teamCount =
    impactResult.affected_teams_count === 1
      ? t("policies.impact.teamOne", { count: impactResult.affected_teams_count })
      : t("policies.impact.teamOther", { count: impactResult.affected_teams_count });

  return (
    <Alert className="mb-4">
      {isGlobal ? <AlertTriangle /> : <Info />}
      <AlertTitle>{t("policies.impact.title")}</AlertTitle>
      <AlertDescription>
        {isGlobal ? (
          <span>
            {t("policies.impact.globalBefore")}
            <strong>{t("policies.impact.globalStrong")}</strong>
            {t("policies.impact.globalAfter")}
          </span>
        ) : (
          <div>
            <span>
              {t("policies.impact.affectBefore")}
              {qualifier}
              <strong>{keyCount}</strong>
              {t("policies.impact.and")}
              <strong>{teamCount}</strong>
              {t("policies.impact.affectAfter")}
            </span>
            {isDefault && <div className="text-xs text-muted-foreground">{t("policies.impact.defaultNote")}</div>}
            {impactResult.sample_keys.length > 0 && (
              <SampleList
                label={t("policies.impact.keysLabel")}
                samples={impactResult.sample_keys}
                totalCount={impactResult.affected_keys_count}
                moreLabel={t("policies.impact.more", { count: impactResult.affected_keys_count - 5 })}
              />
            )}
            {impactResult.sample_teams.length > 0 && (
              <SampleList
                label={t("policies.impact.teamsLabel")}
                samples={impactResult.sample_teams}
                totalCount={impactResult.affected_teams_count}
                moreLabel={t("policies.impact.more", { count: impactResult.affected_teams_count - 5 })}
              />
            )}
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default ImpactPreviewAlert;
