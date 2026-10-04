"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { useTranslation } from "@/i18n";
import type { Lens } from "../../model/types";

export interface RunWindow {
  agent_name?: string;
  start?: string;
  end?: string;
  lookback_hours?: number;
}

const PRESETS = [
  { labelKey: "lens.investigations.presetSinceLastRun", hours: null },
  { labelKey: "lens.investigations.presetLastHour", hours: 1 },
  { labelKey: "lens.investigations.presetLast24h", hours: 24 },
  { labelKey: "lens.investigations.presetLast7d", hours: 168 },
  { labelKey: "lens.investigations.presetCustom", hours: -1 },
] as const;

const localInput = (date: Date) =>
  new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);

export interface RunChoice {
  preset: (typeof PRESETS)[number]["hours"];
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

export function RunNowDialog({
  lens,
  agents,
  busy,
  onClose,
  onRun,
}: {
  lens: Lens;
  agents: readonly string[];
  busy: boolean;
  onClose: () => void;
  onRun: (request: RunWindow) => Promise<void>;
}) {
  const now = new Date();
  const { t } = useTranslation();
  const [preset, setPreset] = useState<(typeof PRESETS)[number]["hours"]>(null);
  const [agent, setAgent] = useState(lens.settings.agent_name ?? "");
  const [start, setStart] = useState(localInput(new Date(now.getTime() - 3_600_000)));
  const [end, setEnd] = useState(localInput(now));
  const [error, setError] = useState("");
  const submit = async () => {
    const choice: RunChoice = { preset, agent, saved: lens.settings.agent_name ?? "", start, end };
    const request = runRequest(choice);
    if (typeof request === "string") {
      setError(t(request));
      return;
    }
    setError("");
    await onRun(request);
  };
  return (
    <Dialog open onOpenChange={(open) => !open && !busy && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("lens.investigations.runNow")}</DialogTitle>
          <DialogDescription>{t("lens.investigations.runNowBody")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <label className="grid gap-1.5 text-sm font-medium">
            {t("lens.investigations.agent")}
            <Input
              list="run-now-agents"
              value={agent}
              placeholder={t("lens.investigations.allAgents")}
              onChange={(e) => setAgent(e.target.value)}
              aria-label={t("lens.investigations.agent")}
            />
            <datalist id="run-now-agents">
              {agents.map((name) => (
                <option key={name} value={name} />
              ))}
            </datalist>
          </label>
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">{t("lens.investigations.tracesToReview")}</legend>
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map((p) => (
                <button
                  key={p.hours}
                  type="button"
                  aria-pressed={preset === p.hours}
                  onClick={() => setPreset(p.hours)}
                  className="rounded-md bg-muted/60 px-2.5 py-1 text-xs text-muted-foreground hover:bg-muted aria-pressed:bg-background aria-pressed:text-foreground aria-pressed:ring-[1.5px] aria-pressed:ring-foreground aria-pressed:ring-inset"
                >
                  {t(p.labelKey)}
                </button>
              ))}
            </div>
            {preset === -1 && (
              <div className="grid grid-cols-2 gap-2">
                <label className="grid gap-1 text-xs text-muted-foreground">
                  {t("lens.investigations.from")}
                  <Input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} />
                </label>
                <label className="grid gap-1 text-xs text-muted-foreground">
                  {t("lens.investigations.to")}
                  <Input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} />
                </label>
              </div>
            )}
          </fieldset>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" disabled={busy} onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button disabled={busy} onClick={() => void submit()}>
            {t("lens.investigations.runNow")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
