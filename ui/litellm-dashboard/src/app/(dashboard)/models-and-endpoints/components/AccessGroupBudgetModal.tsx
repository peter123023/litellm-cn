"use client";

import { CircleHelp } from "lucide-react";
import React from "react";
import { z } from "zod";
import BudgetDurationDropdown from "@/components/common_components/budget_duration_dropdown";
import { FieldGroup } from "@/components/ui/field";
import { FormField } from "@/components/shared/form/FormField";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import NumericalInput from "@/components/shared/numerical_input";
import { Button } from "@/components/ui/button";
import { useZodForm } from "@/lib/forms/useZodForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ModelAccessGroup } from "@/app/(dashboard)/hooks/modelAccessGroups/useModelAccessGroups";
import { SetModelAccessGroupBudgetParams } from "@/app/(dashboard)/hooks/modelAccessGroups/useSetModelAccessGroupBudget";
import { accessGroupBudgetFormValues, buildAccessGroupBudgetBody, hasAnyBudgetValue } from "./accessGroupBudgetPayload";
import { useTranslation, type Translate } from "@/i18n";

const labelWithHint = (label: React.ReactNode, hint: string): React.ReactNode => (
  <>
    {label}
    <Tooltip>
      <TooltipTrigger render={<CircleHelp className="size-3.5 shrink-0 cursor-help text-muted-foreground" />} />
      <TooltipContent>{hint}</TooltipContent>
    </Tooltip>
  </>
);

const createBudgetSchema = (t: Translate) =>
  z
    .object({
      max_budget: z.string().optional(),
      soft_budget: z.string().optional(),
      budget_duration: z.string().optional(),
    })
    .refine(hasAnyBudgetValue, {
      message: t("accessGroupBudget.schemaAtLeastOne"),
      path: ["max_budget"],
    });

interface AccessGroupBudgetModalProps {
  accessGroup: ModelAccessGroup | null;
  isSaving: boolean;
  onCancel: () => void;
  onSubmit: (params: SetModelAccessGroupBudgetParams) => void;
}

const AccessGroupBudgetModal: React.FC<AccessGroupBudgetModalProps> = ({
  accessGroup,
  isSaving,
  onCancel,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const budget = accessGroup?.budget ?? null;
  const form = useZodForm(createBudgetSchema(t), { values: accessGroupBudgetFormValues(budget) });

  return (
    <Dialog open={accessGroup !== null} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>
            {budget
              ? t("accessGroupBudget.modal.titleEdit", { group: accessGroup?.access_group ?? "" })
              : t("accessGroupBudget.modal.titleSet", { group: accessGroup?.access_group ?? "" })}
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          {t("accessGroupBudget.modal.descPrefix")}
          <code>all-proxy-models</code>
          {t("accessGroupBudget.modal.descSuffix")}
        </p>
        <form onSubmit={form.handleSubmit((values) => onSubmit(buildAccessGroupBudgetBody(values)))} noValidate>
          <TooltipProvider>
            <FieldGroup className="mt-4">
              <FormField
                control={form.control}
                name="max_budget"
                label={labelWithHint(
                  t("accessGroupBudget.maxBudgetLabel"),
                  t("accessGroupBudget.maxBudgetHint"),
                )}
              >
                {({ ref, value, ...field }) => <NumericalInput {...field} value={value ?? ""} step={0.01} />}
              </FormField>

              <FormField
                control={form.control}
                name="soft_budget"
                label={labelWithHint(
                  t("accessGroupBudget.softBudgetLabel"),
                  t("accessGroupBudget.softBudgetHint"),
                )}
              >
                {({ ref, value, ...field }) => <NumericalInput {...field} value={value ?? ""} step={0.01} />}
              </FormField>

              <FormField
                control={form.control}
                name="budget_duration"
                label={labelWithHint(
                  t("accessGroupBudget.resetBudgetLabel"),
                  t("accessGroupBudget.resetBudgetHint"),
                )}
              >
                {({ id, value, onChange }) => (
                  <BudgetDurationDropdown
                    id={id}
                    value={value || null}
                    onChange={(next) => onChange(next ?? undefined)}
                  />
                )}
              </FormField>
            </FieldGroup>

            <p className="mt-3 text-xs text-muted-foreground">{t("accessGroupBudget.blankHint")}</p>

            <div className="mt-6 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                {t("accessGroupBudget.cancel")}
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? t("accessGroupBudget.saving") : t("accessGroupBudget.saveBudget")}
              </Button>
            </div>
          </TooltipProvider>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AccessGroupBudgetModal;
