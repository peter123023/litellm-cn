import { formatActivityTimestamp as runTime } from "@/utils/activityTimestamp";
import { DEFAULT_LANGUAGE, translate, type Translate } from "@/i18n";
import type { Settings } from "./types";

export { runTime };

const englishT: Translate = (key, params) => translate(DEFAULT_LANGUAGE, key, params);

export function scopeLabel(
  settings: Partial<Pick<Settings, "service" | "agent_name" | "filters">>,
  t: Translate = englishT,
): string {
  return (
    [settings.agent_name, settings.service, ...(settings.filters ?? []).map((f) => `${f.key}: ${f.value}`)]
      .filter(Boolean)
      .join(" · ") || t("lens.common.scopeAllActivity")
  );
}

export function durationText(seconds: number, t: Translate = englishT): string {
  if (!Number.isFinite(seconds)) return t("lens.common.durationZero");
  if (seconds < 60) return t("lens.common.durationSeconds", { seconds });
  if (seconds < 3600) {
    return t("lens.common.durationMinutesSeconds", { minutes: Math.floor(seconds / 60), seconds: seconds % 60 });
  }
  return t("lens.common.durationHoursMinutes", {
    hours: Math.floor(seconds / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
  });
}

export function durationLabel(value: number, base: "minutes" | "hours" = "minutes", t: Translate = englishT): string {
  const minutes = base === "hours" ? value * 60 : value;
  if (minutes >= 1440) {
    const days = Number((minutes / 1440).toFixed(2));
    return t(days === 1 ? "lens.common.durationDay" : "lens.common.durationDays", { days });
  }
  if (minutes % 60 === 0) {
    return t(minutes === 60 ? "lens.common.durationHour" : "lens.common.durationHours", { hours: minutes / 60 });
  }
  return t(minutes === 1 ? "lens.common.durationMinute" : "lens.common.durationMinutes", { minutes });
}

export function agoLabel(thenMs: number, nowMs: number): string {
  const seconds = Math.max(0, Math.floor((nowMs - thenMs) / 1000));
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export const money = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 3 }).format(n);
export const when = (value?: string | null, t: Translate = englishT) =>
  value ? runTime(value) : t("lens.common.notYet");

export const sourceLabelKeys = {
  both: "lens.common.sourceBoth",
  requests: "lens.common.sourceRequests",
  traces: "lens.common.sourceTraces",
} as const;
