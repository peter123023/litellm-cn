"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

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

import { lensQueries } from "../../data/queries";
import { useLensApi } from "../../data/LensServices";
import type { Lens, RunWindow } from "../../model/types";
import { RUN_PRESETS, runRequest, type RunChoice, type RunPreset } from "../../model/runRequest";
import { useTranslation } from "@/i18n";

const localInput = (date: Date) =>
  new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);

export function RunNowDialog({
  lens,
  busy,
  onClose,
  onRun,
}: {
  lens: Lens;
  busy: boolean;
  onClose: () => void;
  onRun: (request: RunWindow) => Promise<void>;
}) {
  const api = useLensApi();
  const { t } = useTranslation();
  const agentsQuery = useQuery(lensQueries.agents(api, "traces"));
  const agents = Array.isArray(agentsQuery.data) ? agentsQuery.data : [];
  const now = new Date();
  const [preset, setPreset] = useState<RunPreset>(null);
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
              {RUN_PRESETS.map((p) => (
                <button
                  key={p.labelKey}
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
