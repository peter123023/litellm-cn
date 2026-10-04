"use client";

import { useNow } from "@/hooks/useNow";
import { analysisElapsed } from "../../model/progress";
import { nextCheckStatus } from "../../model/status";
import type { Job, Lens } from "../../model/types";
import { useTranslation } from "@/i18n";

export function NextCheck({ lens }: { lens: Lens }) {
  const { t } = useTranslation();
  const now = useNow(15000);
  const label = nextCheckStatus(lens, now, t);
  if (!label) return null;
  return <p className="mt-1 text-xs text-muted-foreground">{label}</p>;
}

export function ScanDuration({ job }: { job: Job }) {
  const { t } = useTranslation();
  if (!job.finished_at) return null;
  return (
    <span title={t("lens.investigations.tookTitle")}>
      {t("lens.investigations.tookPrefix")} {analysisElapsed(job.created_at, Date.parse(job.finished_at), t)}
    </span>
  );
}
