"use client";

import { Button } from "@/components/ui/button";

import { TabsContent } from "@/components/ui/tabs";
import { useTranslation } from "@/i18n";
import { type Settings } from "../../model/types";
import { watches } from "../../model/watches";

export interface CriteriaTabProps {
  readonly settings: Settings | undefined;
  readonly readOnly: boolean;
  readonly onEditCriteria: () => void;
}

export function CriteriaTab({ settings, readOnly, onEditCriteria }: CriteriaTabProps) {
  const { t } = useTranslation();
  return (
    <TabsContent value="checks" className="pt-4 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{t("lens.investigations.usedForThisRun")}</p>
        {!readOnly && (
          <Button variant="outline" size="sm" onClick={onEditCriteria}>
            {t("lens.investigations.editCriteria")}
          </Button>
        )}
      </div>
      {settings?.context && (
        <div className="space-y-2 border-b pb-5">
          <h3 className="text-base font-semibold">{t("lens.investigations.criteriaPurposeTitle")}</h3>
          <p className="text-xs text-muted-foreground">{t("lens.investigations.criteriaPurposeHint")}</p>
          <p className="mt-2 whitespace-pre-wrap text-sm">{settings.context}</p>
        </div>
      )}
      <div className="pt-2">
        <h3 className="text-base font-semibold">{t("lens.investigations.watchFor")}</h3>
        <p className="mt-1 text-xs text-muted-foreground">{t("lens.investigations.watchForBody")}</p>
      </div>
      {settings?.checks.map((c, index) => (
        <div key={c.id} className="flex items-start gap-3 border-b py-4">
          <span className="mt-0.5 text-xs tabular-nums text-muted-foreground">{index + 1}.</span>
          <CheckSummary check={c} />
          {!c.enabled && <span className="text-xs text-muted-foreground">{t("common.disabled")}</span>}
        </div>
      ))}
      <p className="text-xs text-muted-foreground">{t("lens.investigations.changesApplyToFutureScans")}</p>
    </TabsContent>
  );
}
function CheckSummary({ check }: { check: Settings["checks"][number] }) {
  const { t } = useTranslation();
  const watch = watches.find((item) => item.id === check.id);
  if (!watch) return <p className="flex-1 text-sm leading-6">{check.instruction}</p>;
  return (
    <p className="grid flex-1 gap-0.5">
      <span className="text-sm font-medium">{watch.name}</span>
      <span className="text-xs text-muted-foreground">{watch.summary}</span>
    </p>
  );
}
