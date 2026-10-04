import { ListRow } from "@/components/shared/ListRow";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { runTime } from "../../model/format";
import { type Job } from "../../model/types";
import { useTranslation, type Translate } from "@/i18n";

function assessmentLabel(assessment: Job["assessments"][number] | undefined, t: Translate): string {
  if (!assessment) return t("lens.investigations.notReviewed");
  if (assessment.cannot_assess) return t("lens.investigations.insufficientEvidence");
  return assessment.issue_checks?.length
    ? t("lens.investigations.issueObserved")
    : t("lens.investigations.noIssueObserved");
}

export function RunsTab({ job, onOpen }: { job?: Job; onOpen: (id: string) => void }) {
  const { t } = useTranslation();
  const [runOffset, setRunOffset] = useState(0);
  const [runFilter, setRunFilter] = useState("all");
  const assessments = new Map(job?.assessments?.map((a) => [a.execution_id, a]));
  const runs = job?.sample?.executions ?? [];
  const visibleRuns = runs.filter((run) => {
    const assessment = assessments.get(run.id);
    if (runFilter === "all") return true;
    if (runFilter === "unknown") return !assessment || assessment.cannot_assess;
    if (runFilter === "clear") return assessment && !assessment.cannot_assess && !assessment.issue_checks?.length;
    return assessment?.issue_checks?.includes(runFilter);
  });
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {t("lens.investigations.selectedFromMatching", {
            selected: runs.length,
            eligible: job?.sample?.eligible ?? 0,
          })}
        </p>
        <select
          aria-label={t("lens.investigations.filterReviewedRuns")}
          className="h-8 max-w-full rounded-md border bg-background px-2 text-xs sm:max-w-64"
          value={runFilter}
          onChange={(e) => {
            setRunFilter(e.target.value);
            setRunOffset(0);
          }}
        >
          <option value="all">{t("lens.investigations.allOutcomes")}</option>
          <option value="clear">{t("lens.investigations.noIssueObserved")}</option>
          <option value="unknown">{t("lens.investigations.insufficientOrNotReviewed")}</option>
          {job?.settings?.context && (
            <option value="expected_behavior">{t("lens.investigations.expectedBehaviorDeviation")}</option>
          )}
          {job?.settings?.checks.map((check) => (
            <option key={check.id} value={check.id}>
              {check.instruction}
            </option>
          ))}
        </select>
      </div>
      <div className="divide-y border-y">
        {visibleRuns.slice(runOffset, runOffset + 50).map((run) => (
          <ListRow
            key={run.id}
            title={run.trace_id}
            onClick={() => onOpen(run.id)}
            className="group grid w-full grid-cols-[minmax(0,1fr)_16px] items-center gap-x-4 gap-y-1 py-4 text-left hover:bg-muted/40 focus-visible:outline-2 focus-visible:outline-ring sm:grid-cols-[minmax(0,1fr)_180px_130px_16px]"
          >
            <span className="col-start-1 row-start-1 min-w-0 truncate text-sm font-medium">{run.name}</span>
            <span className="col-start-1 row-start-2 text-xs text-muted-foreground sm:col-start-2 sm:row-start-1">
              {runTime(run.start_time)}
            </span>
            <span className="col-start-1 row-start-3 text-xs text-muted-foreground sm:col-start-3 sm:row-start-1">
              {assessmentLabel(assessments.get(run.id), t)}
            </span>
            <ChevronRight
              aria-hidden="true"
              className="col-start-2 row-start-1 size-4 text-muted-foreground group-hover:text-foreground sm:col-start-4"
            />
          </ListRow>
        ))}
        {!visibleRuns.length && (
          <p className="py-10 text-center text-sm text-muted-foreground">
            {t(runs.length ? "lens.investigations.noRunsMatchOutcome" : "lens.investigations.selectedActivityAppears")}
          </p>
        )}
      </div>
      {(runOffset > 0 || visibleRuns.length > 50) && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <Button
            size="sm"
            variant="ghost"
            disabled={!runOffset}
            onClick={() => setRunOffset(Math.max(0, runOffset - 50))}
          >
            {t("lens.investigations.previousRuns")}
          </Button>
          <span>
            {t("lens.investigations.pagination", {
              from: runOffset + 1,
              to: Math.min(runOffset + 50, visibleRuns.length),
              total: visibleRuns.length,
            })}
          </span>
          <Button
            size="sm"
            variant="ghost"
            disabled={runOffset + 50 >= visibleRuns.length}
            onClick={() => setRunOffset(runOffset + 50)}
          >
            {t("lens.investigations.nextRuns")}
          </Button>
        </div>
      )}
    </div>
  );
}
