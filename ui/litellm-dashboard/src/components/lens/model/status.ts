import { formatActivityTimestamp } from "@/utils/activityTimestamp";
import { DEFAULT_LANGUAGE, translate, type Translate } from "@/i18n";
import type { Job, Lens, LensList } from "./types";

const englishT: Translate = (key, params) => translate(DEFAULT_LANGUAGE, key, params);

export function workerConnected(worker: LensList["workers"][number], now = Date.now()): boolean {
  return !worker.revoked && !!worker.analysis_key_id && now - Date.parse(worker.last_seen) < 120000;
}

export function activeJob(jobs: readonly Job[]): Job | undefined {
  return jobs.find((job) => job.status === "queued" || job.status === "running");
}

export function hasActiveJob(jobs: readonly Job[]): boolean {
  return activeJob(jobs) !== undefined;
}

/** One observer polls `/lens`: fast while work is in flight or a worker is being connected, slow otherwise. */
export function listPollInterval(list: LensList | undefined, settingsOpen: boolean, now: number): number {
  const running = list?.lenses.some((lens) => hasActiveJob(lens.jobs)) ?? false;
  const connected = list?.workers.some((worker) => workerConnected(worker, now)) ?? false;
  return running || (settingsOpen && !connected) ? 2000 : 10000;
}

export function lensStatus(lens: Lens, connected: boolean, t: Translate = englishT): string {
  const active = lens.jobs?.find((job) => ["queued", "running"].includes(job.status ?? ""));
  if (active) return connected ? active.stage ?? t("lens.common.statusQueued") : t("lens.common.waitingForAnalyzer");
  const spent = lens.budget_month === new Date().toISOString().slice(0, 7) ? lens.spent ?? 0 : 0;
  if (spent >= (lens.settings.monthly_budget ?? 100)) return t("lens.common.budgetReached");
  const latest = lens.jobs?.[0];
  if (latest?.status === "failed") return t("lens.common.statusFailed");
  if (latest?.status === "cancelled") return t("lens.common.statusCancelled");
  if (latest?.status === "completed") return t("lens.common.statusCompleted");
  return t("lens.common.statusReady");
}

export function nextCheckStatus(lens: Lens, now: number, t: Translate = englishT): string | null {
  if (!lens.settings.enabled) return null;
  const active = lens.jobs.find((job) => job.status === "queued" || job.status === "running");
  if (active?.status === "running") return t("lens.common.nextCheckAfterScan");
  if (active?.status === "queued") return t("lens.common.waitingForAnalyzer");
  const next = new Date(lens.next_run_at);
  const remaining = next.getTime() - now;
  if (remaining <= 0) return t("lens.common.dueNowWaiting");
  const minutes = Math.ceil(remaining / 60000);
  const relative = minutes === 1 ? t("lens.common.inLessThanAMinute") : t("lens.common.inMinutes", { minutes });
  const time = formatActivityTimestamp(lens.next_run_at);
  return t("lens.common.nextCheckAt", { time, relative });
}

export type InvestigationActivity = "running" | "queued" | "idle";

export function investigationActivity(lenses: readonly Lens[]): InvestigationActivity {
  const statuses = new Set(lenses.flatMap((lens) => lens.jobs.map((job) => job.status)));
  if (statuses.has("running")) return "running";
  if (statuses.has("queued")) return "queued";
  return "idle";
}
