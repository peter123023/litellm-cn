"use client";

import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";

import { Popover, PopoverContent, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";
import { ScanDuration } from "./JobMeta";
import { useRunHistory } from "./useRunHistory";
import type { Lens, Job } from "../../model/types";
import { useRunRoute } from "../../route";
import { useTranslation } from "@/i18n";

import { money, when } from "../../model/format";

export interface RunPickerProps {
  readonly lens: Lens;
  readonly job: Job | undefined;
}

export function RunPicker({ lens, job }: RunPickerProps) {
  const { batchId, selectRun } = useRunRoute();
  const { t } = useTranslation();
  const history = useRunHistory(lens, 0);
  const options = history.data ?? lens.jobs;
  const aggregate = batchId === "latest" || batchId === "all";
  const outsideHistory = !aggregate && !options.some((j) => j.id === batchId);
  return (
    <div className="flex min-w-0 items-center gap-1 pb-1">
      <select
        aria-label={t("lens.investigations.investigationRun")}
        className="h-8 w-44 max-w-full truncate rounded-md border-0 bg-transparent px-2 text-xs text-muted-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
        value={batchId}
        onChange={(e) => selectRun(e.target.value)}
      >
        <option value="latest">{t("lens.investigations.latestRunOption")}</option>
        {job && outsideHistory && (
          <option value={batchId}>
            {when(job.created_at, t)} · {job.status}
          </option>
        )}
        {options.map((j) => (
          <option key={j.id} value={j.id}>
            {when(j.created_at, t)} · {j.status}
          </option>
        ))}
        <option value="all">{t("lens.investigations.allAccumulatedFindings")}</option>
      </select>
      {job && batchId !== "all" && (
        <Popover key={job.id}>
          <PopoverTrigger
            aria-label={t("lens.investigations.runDetails")}
            render={<Button variant="ghost" size="icon" className="size-7 text-muted-foreground" />}
          >
            <Info className="size-3.5" />
          </PopoverTrigger>
          <PopoverContent align="end" className="gap-3">
            <PopoverTitle>{t("lens.investigations.runDetails")}</PopoverTitle>
            <p className="text-xs text-muted-foreground">
              {t("lens.investigations.selectedRunsReviewed", {
                screened: job.coverage?.screened ?? 0,
                selected: job.coverage?.selected ?? 0,
              })}
              <ScanDuration job={job} />
            </p>
            <p className="text-xs text-muted-foreground">
              {t("lens.investigations.coverageSummary", {
                partial: job.coverage?.partial ?? 0,
                unassessable: job.coverage?.unassessable ?? 0,
                inconclusive: job.coverage?.inconclusive ?? 0,
              })}
            </p>
            <dl className="space-y-2 text-xs">
              <div>
                <dt className="text-muted-foreground">{t("lens.investigations.activityWindow")}</dt>
                <dd className="mt-1">
                  {when(job.start, t)} {t("lens.investigations.to")} {when(job.end, t)}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">{t("lens.investigations.analysisCost")}</dt>
                <dd>{money(job.cost ?? 0)}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">{t("common.status")}</dt>
                <dd className="capitalize">{job.status}</dd>
              </div>
            </dl>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
