import { formatActivityTimestamp } from "@/utils/activityTimestamp";
import { DEFAULT_LANGUAGE, translate, type Translate } from "@/i18n";
import type { Lens, LensList } from "./types";

const englishT: Translate = (key, params) => translate(DEFAULT_LANGUAGE, key, params);

export function workerConnected(worker: LensList["workers"][number], now = Date.now()): boolean {
  return !worker.revoked && !!worker.analysis_key_id && now - Date.parse(worker.last_seen) < 120000;
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

export function readiness(
  activity: { traces: boolean; requests: boolean } | undefined,
  activityError: unknown,
  connected: boolean,
  listError: unknown,
) {
  const tracesReady = activity?.traces === true && !activityError;
  const requestsReady = activity?.requests === true && !activityError;
  const activityReady = tracesReady || requestsReady;
  const ready = activityReady && connected && !listError;
  return { tracesReady, requestsReady, activityReady, ready };
}

export type InvestigationActivity = "running" | "queued" | "idle";

export function investigationActivity(lenses: readonly Lens[]): InvestigationActivity {
  const statuses = new Set(lenses.flatMap((lens) => lens.jobs.map((job) => job.status)));
  if (statuses.has("running")) return "running";
  if (statuses.has("queued")) return "queued";
  return "idle";
}
