import { ChevronRight } from "lucide-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useUpdateBudget } from "@/app/(dashboard)/hooks/budgets/useBudgets";
import { budgetItem } from "@/app/(dashboard)/hooks/budgets/useBudgets";
import { applyBudgetPrecision } from "./budgetPrecision";
import { toast } from "@/lib/toast";
import { FieldGroup } from "@/components/ui/field";
import { FormField } from "@/components/shared/form/FormField";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslation, type Translate } from "@/i18n";

type EditBudgetFormValues = Pick<
  budgetItem,
  "budget_id" | "tpm_limit" | "rpm_limit" | "tpd_limit" | "max_budget" | "budget_duration"
>;

const toFormValues = (budget: budgetItem): EditBudgetFormValues => ({
  budget_id: budget.budget_id,
  tpm_limit: budget.tpm_limit,
  rpm_limit: budget.rpm_limit,
  tpd_limit: budget.tpd_limit,
  max_budget: budget.max_budget,
  budget_duration: budget.budget_duration,
});

const durationOptions = (t: Translate) => [
  { value: "24h", label: t("budgets.duration.daily") },
  { value: "7d", label: t("budgets.duration.weekly") },
  { value: "30d", label: t("budgets.duration.monthly") },
];

interface EditBudgetModalProps {
  isModalVisible: boolean;
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  existingBudget: budgetItem;
}
const EditBudgetModal: React.FC<EditBudgetModalProps> = ({ isModalVisible, setIsModalVisible, existingBudget }) => {
  const { t } = useTranslation();
  const [optionalSettingsOpen, setOptionalSettingsOpen] = React.useState(false);
  const form = useForm<EditBudgetFormValues>({ defaultValues: toFormValues(existingBudget) });
  const updateBudget = useUpdateBudget();
  const durationItems = React.useMemo(() => durationOptions(t), [t]);

  useEffect(() => {
    form.reset(toFormValues(existingBudget));
  }, [existingBudget, form]);

  const handleCancel = () => {
    setIsModalVisible(false);
    form.reset();
  };

  const handleUpdate = async (formValues: EditBudgetFormValues) => {
    try {
      toast.info(t("budgets.toast.makingApiCall"));
      await updateBudget.mutateAsync(
        applyBudgetPrecision(
          optionalSettingsOpen ? formValues : { ...formValues, max_budget: undefined, budget_duration: undefined },
        ),
      );
      toast.success(t("budgets.toast.updated"));
      form.reset();
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error updating the budget:", error);
      toast.fromError(t("budgets.toast.updateFailed", { error: String(error) }));
    }
  };

  return (
    <Dialog open={isModalVisible} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{t("budgets.editBudget")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleUpdate)} noValidate>
          <FieldGroup>
            <FormField
              control={form.control}
              name="budget_id"
              label={t("budgets.col.budgetId")}
              description={t("budgets.field.budgetIdImmutable")}
            >
              {({ ref, ...field }) => <Input {...field} ref={ref} value={field.value ?? ""} disabled />}
            </FormField>
            <FormField
              control={form.control}
              name="tpm_limit"
              label={t("budgets.field.tpmLabel")}
              description={t("budgets.field.rateLimitHint")}
            >
              {({ ref, value, onChange, ...field }) => (
                <Input
                  {...field}
                  ref={ref}
                  type="number"
                  step={1}
                  value={value ?? ""}
                  onChange={(event) => onChange(event.target.value === "" ? null : event.target.valueAsNumber)}
                />
              )}
            </FormField>
            <FormField
              control={form.control}
              name="rpm_limit"
              label={t("budgets.field.rpmLabel")}
              description={t("budgets.field.rateLimitHint")}
            >
              {({ ref, value, onChange, ...field }) => (
                <Input
                  {...field}
                  ref={ref}
                  type="number"
                  step={1}
                  value={value ?? ""}
                  onChange={(event) => onChange(event.target.value === "" ? null : event.target.valueAsNumber)}
                />
              )}
            </FormField>
            <FormField
              control={form.control}
              name="tpd_limit"
              label={t("budgets.field.tpdLabel")}
              description={t("budgets.field.tpdHint")}
            >
              {({ ref, value, onChange, ...field }) => (
                <Input
                  {...field}
                  ref={ref}
                  type="number"
                  step={1}
                  value={value ?? ""}
                  onChange={(event) => onChange(event.target.value === "" ? null : event.target.valueAsNumber)}
                />
              )}
            </FormField>

            <Collapsible open={optionalSettingsOpen} onOpenChange={setOptionalSettingsOpen} className="mt-20 mb-8">
              <CollapsibleTrigger className="group flex w-full items-center justify-between py-2 text-left">
                <b>{t("budgets.field.optionalSettings")}</b>
                <ChevronRight className="size-4 text-muted-foreground transition-transform group-data-panel-open:rotate-90" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <FormField control={form.control} name="max_budget" label={t("budgets.field.maxBudgetUsd")}>
                  {({ ref, value, onChange, ...field }) => (
                    <Input
                      {...field}
                      ref={ref}
                      type="number"
                      step={0.01}
                      value={value ?? ""}
                      onChange={(event) => onChange(event.target.value === "" ? null : event.target.valueAsNumber)}
                    />
                  )}
                </FormField>
                <FormField
                  className="mt-8"
                  control={form.control}
                  name="budget_duration"
                  label={t("budgets.field.resetBudget")}
                >
                  {({ id, value, onChange, "aria-invalid": ariaInvalid, "aria-describedby": ariaDescribedBy }) => (
                    <Select items={durationItems} value={value ?? null} onValueChange={onChange}>
                      <SelectTrigger id={id} aria-invalid={ariaInvalid} aria-describedby={ariaDescribedBy}>
                        <SelectValue placeholder="n/a" />
                      </SelectTrigger>
                      <SelectContent>
                        {durationItems.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </FormField>
              </CollapsibleContent>
            </Collapsible>
          </FieldGroup>

          <div style={{ textAlign: "right", marginTop: "10px" }}>
            <Button type="submit">{t("common.save")}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditBudgetModal;
