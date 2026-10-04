import type { ComponentProps } from "react";
import { runTime } from "../../model/format";
import { type Job } from "../../model/types";
import { cn } from "@/lib/cva.config";
import { useTranslation } from "@/i18n";

export type InvestigationFailureProps = ComponentProps<"div"> & {
  job: Job;
  connected: boolean;
};

export function InvestigationFailure({ job, connected, className, ...props }: InvestigationFailureProps) {
  const { t } = useTranslation();
  return (
    <div
      {...props}
      data-slot="investigation-failure"
      role="alert"
      className={cn("space-y-2 rounded-md border border-destructive/20 p-3 text-sm", className)}
    >
      <p className="font-medium text-destructive">{t("lens.investigations.didNotFinish")}</p>
      <pre
        className="whitespace-pre-wrap break-words font-mono text-xs"
        aria-label={t("lens.investigations.investigationError")}
      >
        {job.error}
      </pre>
      <details open>
        <summary className="cursor-pointer text-xs text-muted-foreground">
          {t("lens.investigations.runDetails")}
        </summary>
        <dl className="mt-2 space-y-1 text-xs text-muted-foreground">
          <div>
            <dt className="inline">{t("lens.investigations.detailRun")}</dt>
            <dd className="inline">{job.id}</dd>
          </div>
          <div>
            <dt className="inline">{t("lens.investigations.detailModel")}</dt>
            <dd className="inline">{job.settings.model}</dd>
          </div>
          <div>
            <dt className="inline">{t("lens.investigations.detailWorker")}</dt>
            <dd className="inline">
              {t(connected ? "lens.investigations.connectedNow" : "lens.investigations.notConnected")}
            </dd>
          </div>
          <div>
            <dt className="inline">{t("lens.investigations.detailStarted")}</dt>
            <dd className="inline">{runTime(job.created_at)}</dd>
          </div>
        </dl>
      </details>
    </div>
  );
}
