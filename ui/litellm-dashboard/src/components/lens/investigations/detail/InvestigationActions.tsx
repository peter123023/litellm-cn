"use client";

import { Pause, Play, Settings2, MoreHorizontal, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "@/i18n";
import { hasActiveJob } from "../../model/status";
import { type Lens } from "../../model/types";

export interface InvestigationIntents {
  readonly onEdit: () => void;
  readonly onDuplicate: () => void;
  readonly onPause: () => void;
  readonly onEnableMonitoring: () => void;
  readonly onCancelRun: () => void;
  readonly onRunNow: () => void;
}

export type InvestigationActionsProps = Omit<InvestigationIntents, "onCancelRun"> & {
  readonly lens: Lens;
  readonly ready: boolean;
  readonly busy: boolean;
};

export function InvestigationActions({
  lens,
  ready,
  busy,
  onEdit,
  onDuplicate,
  onPause,
  onEnableMonitoring,
  onRunNow,
}: InvestigationActionsProps) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-wrap gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="ghost" size="icon" aria-label={t("lens.investigations.actionsLabel")} />}
        >
          <MoreHorizontal className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={onEdit}>
            <Settings2 />
            {t("lens.investigations.editInvestigation")}
          </DropdownMenuItem>
          <DropdownMenuItem disabled={!ready} onClick={onDuplicate}>
            <Copy />
            {t("common.duplicate")}
          </DropdownMenuItem>
          {lens.settings.enabled ? (
            <DropdownMenuItem disabled={busy} onClick={onPause}>
              <Pause />
              {t("lens.investigations.pauseMonitoring")}
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem disabled={!ready || busy} onClick={onEnableMonitoring}>
              <Play />
              {t("lens.investigations.enableMonitoring")}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <Button disabled={busy || hasActiveJob(lens.jobs) || !ready} onClick={onRunNow}>
        <Play className="size-3" />
        {t("lens.investigations.runNow")}
      </Button>
    </div>
  );
}
