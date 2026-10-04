import type { RunWindow } from "./types";

export const RUN_PRESETS = [
  { labelKey: "lens.investigations.presetSinceLastRun", hours: null },
  { labelKey: "lens.investigations.presetLastHour", hours: 1 },
  { labelKey: "lens.investigations.presetLast24h", hours: 24 },
  { labelKey: "lens.investigations.presetLast7d", hours: 168 },
  { labelKey: "lens.investigations.presetCustom", hours: -1 },
] as const;

export type RunPreset = (typeof RUN_PRESETS)[number]["hours"];

export interface RunChoice {
  preset: RunPreset;
  agent: string;
  saved: string;
  start: string;
  end: string;
}

export function runRequest({ preset, agent, saved, start, end }: RunChoice): RunWindow | string {
  const agentPart = agent.trim() && agent.trim() !== saved ? { agent_name: agent.trim() } : {};
  if (preset === null) return agentPart;
  if (preset > 0) return { ...agentPart, lookback_hours: preset };
  const startMs = Date.parse(start);
  const endMs = Date.parse(end);
  if (Number.isNaN(startMs) || Number.isNaN(endMs)) return "lens.investigations.runNowErrorMissingRange";
  if (startMs >= endMs) return "lens.investigations.runNowErrorRangeOrder";
  return { ...agentPart, start: new Date(startMs).toISOString(), end: new Date(endMs).toISOString() };
}
