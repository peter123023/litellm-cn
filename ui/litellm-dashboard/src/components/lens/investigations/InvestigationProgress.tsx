"use client";

import { useNow } from "@/hooks/useNow";

import { Button } from "@/components/ui/button";
import {
  analysisElapsed,
  analysisFraction,
  analysisPace,
  analysisProgress,
  analysisStages,
  remainingLabel,
  stageDurations,
} from "../model/progress";
import { useProgressSamples } from "./useProgressSamples";
import { durationText } from "../model/format";
import { type Job } from "../model/types";
import { cn } from "@/lib/cva.config";
import { useTranslation } from "@/i18n";

const steps = [
  "lens.investigations.stepReviewRuns",
  "lens.investigations.stepFindPatterns",
  "lens.investigations.stepCheckEvidence",
];
const markers = { done: "✓", active: "▸", todo: "·" };
const blocks = 32;

function stageState(index: number, current: number): keyof typeof markers {
  if (index < current) return "done";
  return index === current ? "active" : "todo";
}

export function InvestigationProgress({ job, onCancel }: { job: Job; onCancel?: () => void }) {
  const { t } = useTranslation();
  const now = useNow(1000);
  const progress = analysisProgress(job, t);
  const fraction = analysisFraction(progress);
  const samples = useProgressSamples(progress);
  const pace = analysisPace(samples, now);
  const percent = Math.round(fraction * 100);
  const queued = progress.step < 0;
  const counts = analysisStages(job);
  const durations = stageDurations(samples, job.created_at, now);
  const filled = Math.round(fraction * blocks);
  const stats = [
    ["lens.investigations.statEta", remainingLabel(pace.secondsLeft, t)],
    [
      "lens.investigations.statRate",
      pace.perMinute === null ? "–" : t("lens.investigations.perMinute", { count: Math.round(pace.perMinute) }),
    ],
    ["lens.investigations.statElapsed", analysisElapsed(job.created_at, now, t)],
  ];

  return (
    <section
      aria-label={t("lens.investigations.progressRegion")}
      className="space-y-3 rounded-md border bg-muted/40 px-4 py-3 text-sm"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="truncate" role="status">
          <span className="font-medium">{progress.title}</span>
          {!queued && <span className="text-muted-foreground"> · {progress.detail}</span>}
        </span>
        {onCancel && (
          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={onCancel}>
            {t("common.cancel")}
          </Button>
        )}
      </div>
      <div className="max-w-2xl space-y-1.5 pl-3">
        <div className="flex items-center gap-2">
          <span aria-hidden="true" className="text-muted-foreground">
            [
          </span>
          <div
            role="progressbar"
            aria-label={t("lens.investigations.progressBar")}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
            aria-valuetext={queued ? progress.title : `${progress.title}: ${progress.detail}`}
            className="flex h-3.5 min-w-0 flex-1 gap-px"
          >
            {Array.from({ length: blocks }, (_, index) => (
              <span
                key={index}
                data-state={index < filled ? "active" : "inactive"}
                className={cn(
                  "flex-1",
                  index < filled ? "bg-foreground" : "bg-foreground/10",
                  queued && index < blocks / 3 && "motion-safe:animate-pulse bg-foreground/30",
                )}
              />
            ))}
          </div>
          <span aria-hidden="true" className="text-muted-foreground">
            ]
          </span>
          <span className="w-10 text-right tabular-nums">{percent}%</span>
        </div>
        <ol aria-label={t("lens.investigations.stagesRegion")} className="space-y-0.5">
          {steps.map((labelKey, index) => {
            const state = stageState(index, progress.step);
            const { done, total } = counts[index];
            const seconds = durations[index];
            return (
              <li
                key={labelKey}
                data-state={state}
                aria-current={state === "active" ? "step" : undefined}
                className="grid grid-cols-[1rem_minmax(0,9rem)_6rem_auto] items-baseline gap-2 tabular-nums data-[state=done]:text-foreground data-[state=active]:font-medium data-[state=active]:text-foreground data-[state=todo]:text-muted-foreground"
              >
                <span aria-hidden="true">{markers[state]}</span>
                <span className="truncate">{t(labelKey)}</span>
                <span className="text-right text-muted-foreground">
                  {state === "todo" || !total ? "–" : `${Math.min(done, total)}/${total}`}
                </span>
                <span className="text-muted-foreground">{seconds === null ? "" : durationText(seconds, t)}</span>
              </li>
            );
          })}
        </ol>
        <div className="flex flex-wrap gap-x-5 gap-y-1 pt-1 tabular-nums">
          {queued ? (
            <span className="text-muted-foreground">{progress.detail}</span>
          ) : (
            stats.map(([labelKey, value]) => (
              <span key={labelKey}>
                <span className="text-muted-foreground">{t(labelKey)}</span> {value}
              </span>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
