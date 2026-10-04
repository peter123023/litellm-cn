"use client";
import { ListRow } from "@/components/shared/ListRow";

import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import { TabsContent } from "@/components/ui/tabs";
import { ScanDuration } from "../InvestigationProgress";
import type { Lens, Job } from "../../model/types";

import { money, when } from "../../model/format";
import { useTranslation } from "@/i18n";

export function HistoryTab({
  history,
  historyError,
  refetchHistory,
  lens,
  openBatch,
  historyOffset,
  setHistoryOffset,
}: {
  history: Job[] | undefined;
  historyError: Error | null | undefined;
  refetchHistory: () => void;
  lens: Lens;
  openBatch: (id: string) => void;
  historyOffset: number;
  setHistoryOffset: (offset: number) => void;
}) {
  const { t } = useTranslation();
  return (
    <TabsContent value="activity" className="pt-4 space-y-4">
      {historyError && (
        <p role="alert" className="text-sm text-destructive">
          {t("lens.investigations.historyLoadFailed")}{" "}
          <Button variant="link" size="sm" onClick={() => void refetchHistory()}>
            {t("common.retry")}
          </Button>
        </p>
      )}
      <div className="divide-y border-y">
        {(history ?? lens.jobs)?.map((j) => (
          <ListRow
            key={j.id}
            onClick={() => openBatch(j.id)}
            className="flex w-full items-center gap-4 py-4 text-left hover:bg-muted/30 focus-visible:outline-2 focus-visible:outline-ring"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{when(j.created_at, t)}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {t("lens.investigations.runsReviewed", { count: j.coverage?.screened ?? 0 })}
                {j.findings != null && <> · {t("lens.investigations.findingsCount", { count: j.findings.length })}</>}
                <ScanDuration job={j} />
              </p>
              {j.error && <p className="mt-2 line-clamp-2 text-xs text-destructive">{j.error}</p>}
            </div>
            <div className="text-right text-xs text-muted-foreground">
              <p
                data-state={j.status === "failed" ? "failed" : "other"}
                className="capitalize data-[state=failed]:text-destructive"
              >
                {j.status}
              </p>
              <p className="mt-1">{money(j.cost ?? 0)}</p>
            </div>
            <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
          </ListRow>
        ))}
      </div>
      {(historyOffset > 0 || (history?.length ?? 0) >= 50) && (
        <div className="flex justify-between">
          <Button
            variant="ghost"
            size="sm"
            disabled={!historyOffset}
            onClick={() => setHistoryOffset(Math.max(0, historyOffset - 50))}
          >
            {t("lens.investigations.newerRuns")}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={(history?.length ?? 0) < 50}
            onClick={() => setHistoryOffset(historyOffset + 50)}
          >
            {t("lens.investigations.olderRuns")}
          </Button>
        </div>
      )}
    </TabsContent>
  );
}
