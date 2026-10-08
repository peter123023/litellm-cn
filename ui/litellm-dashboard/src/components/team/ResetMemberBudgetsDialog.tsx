import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatNumberWithCommas } from "@/utils/dataUtils";
import { useTranslation } from "@/i18n";
import type { MemberBudgetResetState } from "./useMemberBudgetReset";

interface ResetMemberBudgetsDialogProps {
  state: MemberBudgetResetState;
  onReset: () => void;
  onRetry: () => void;
  onKeep: () => void;
  onDismiss: () => void;
}

export default function ResetMemberBudgetsDialog({
  state,
  onReset,
  onRetry,
  onKeep,
  onDismiss,
}: ResetMemberBudgetsDialogProps) {
  const { t } = useTranslation();
  const open = state.phase !== "idle";
  const busy = state.phase === "resetting";
  const failed = state.phase === "resetFailed";
  const memberCount = state.phase === "idle" ? 0 : state.pending.userIds.length;
  const newBudget = state.phase === "idle" ? 0 : state.pending.newBudget;
  const formattedBudget = `$${formatNumberWithCommas(newBudget, 2)}`;
  const body =
    memberCount === 1
      ? t("teamSettings.memberBudgetReset.bodyOne", { count: memberCount, budget: formattedBudget })
      : t("teamSettings.memberBudgetReset.bodyOther", { count: memberCount, budget: formattedBudget });
  const keepLabel =
    memberCount === 1
      ? t("teamSettings.memberBudgetReset.keepOne")
      : t("teamSettings.memberBudgetReset.keepOther");
  const resetLabel =
    memberCount === 1
      ? t("teamSettings.memberBudgetReset.resetActionOne", { budget: formattedBudget })
      : t("teamSettings.memberBudgetReset.resetActionOther", { budget: formattedBudget });

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && !busy) onDismiss();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("teamSettings.memberBudgetReset.title")}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">{body}</p>
        <DialogFooter>
          {failed ? (
            <>
              <Button variant="outline" onClick={onDismiss}>
                {t("common.cancel")}
              </Button>
              <Button onClick={onRetry}>{t("teamSettings.memberBudgetReset.retry")}</Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={onDismiss} disabled={busy}>
                {t("common.cancel")}
              </Button>
              <Button variant="outline" onClick={onKeep} disabled={busy}>
                {keepLabel}
              </Button>
              <Button onClick={onReset} disabled={busy}>
                {resetLabel}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
