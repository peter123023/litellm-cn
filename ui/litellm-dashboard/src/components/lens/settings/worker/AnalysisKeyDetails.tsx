"use client";

import { analysisKeyInfoQuery } from "../../api/queries";

import { useQuery } from "@tanstack/react-query";
import { useTranslation, type Translate } from "@/i18n";
import { useLensApi } from "../../services";
import { Button } from "@/components/ui/button";
import { runTime } from "../../model/format";

const periodKeys: Record<string, string> = {
  "1mo": "lens.worker.period.month",
  "30d": "lens.worker.period.month",
  "1d": "lens.worker.period.day",
  "24h": "lens.worker.period.day",
  "7d": "lens.worker.period.week",
  "1h": "lens.worker.period.hour",
};

function budgetLabel(amount: number | null, duration: string | null | undefined, t: Translate): string {
  if (amount === null) return t("lens.worker.noKeyBudget");
  const dollars = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);
  if (!duration) return t("lens.worker.budgetTotal", { amount: dollars });
  const periodKey = periodKeys[duration];
  return t("lens.worker.budgetPerPeriod", { amount: dollars, period: periodKey ? t(periodKey) : duration });
}

export function useAnalysisKeyInfo(accessToken: string, keyId?: string) {
  const api = useLensApi(accessToken);
  return useQuery(analysisKeyInfoQuery(api, keyId));
}

export function AnalysisKeyDetails({
  accessToken,
  keyId,
  showName = false,
}: {
  accessToken: string;
  keyId: string;
  showName?: boolean;
}) {
  const { t } = useTranslation();
  const key = useAnalysisKeyInfo(accessToken, keyId);
  if (key.isLoading) return <p className="text-xs text-muted-foreground">{t("lens.worker.loadingKeyPermissions")}</p>;
  if (key.error || !key.data)
    return (
      <div role="alert" className="flex items-center gap-2 text-sm text-destructive">
        {t("lens.worker.keyPermissionsFailed")}
        <Button variant="ghost" size="sm" onClick={() => void key.refetch()}>
          {t("common.retry")}
        </Button>
      </div>
    );
  const info = key.data;
  return (
    <div className="space-y-2 text-sm">
      <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-5 gap-y-2">
        {showName && (
          <>
            <dt className="text-muted-foreground">{t("lens.worker.billingKey")}</dt>
            <dd className="break-words">{info.key_alias || t("lens.worker.assignedVirtualKey")}</dd>
          </>
        )}
        <dt className="text-muted-foreground">{t("lens.worker.models")}</dt>
        <dd className="break-words">{info.models.length ? info.models.join(", ") : t("lens.worker.allModels")}</dd>
        <dt className="text-muted-foreground">{t("lens.worker.keyLimit")}</dt>
        <dd>{budgetLabel(info.max_budget, info.budget_duration, t)}</dd>
      </dl>
      {info.status && info.status !== "active" && (
        <p role="alert" className="text-destructive">
          {t("lens.worker.keyInactive", { status: info.status })}
        </p>
      )}
      <details className="text-xs text-muted-foreground">
        <summary className="cursor-pointer">{t("lens.worker.otherLimits")}</summary>
        <div className="mt-2 space-y-1 leading-5">
          <p>{t("lens.worker.requestsPerMinute", { value: info.rpm_limit ?? t("lens.worker.noKeyLimit") })}</p>
          <p>{t("lens.worker.tokensPerMinute", { value: info.tpm_limit ?? t("lens.worker.noKeyLimit") })}</p>
          <p>{t("lens.worker.expires", { value: info.expires ? runTime(info.expires) : t("lens.worker.noExpiry") })}</p>
          <p>{t("lens.worker.teamLimitsNote")}</p>
        </div>
      </details>
    </div>
  );
}
