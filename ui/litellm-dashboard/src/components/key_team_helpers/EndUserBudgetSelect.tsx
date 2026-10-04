"use client";

import React from "react";

import { useBudgetOptions } from "@/app/(dashboard)/hooks/budgets/useBudgetOptions";
import type { budgetItem } from "@/app/(dashboard)/hooks/budgets/useBudgets";
import { SearchSelect, type SearchSelectOption } from "@/components/shared/SearchSelect";
import { useTranslation, type Translate } from "@/i18n";

export const getEndUserBudgetHint = (t: Translate): string => t("keyCreate.endUserBudgetHint");

interface EndUserBudgetSelectProps {
  readonly id?: string;
  readonly accessToken: string | null;
  readonly value: string | null;
  readonly onChange: (next: string | null) => void;
  readonly canEdit: boolean;
}

const budgetSublabel = (budget: budgetItem, t: Translate): string | undefined => {
  const parts = [
    budget.max_budget != null ? `$${budget.max_budget}` : null,
    budget.budget_duration ? t("keyTeam.resetsIn", { duration: budget.budget_duration }) : null,
  ].filter((part): part is string => part !== null);
  return parts.length > 0 ? parts.join(", ") : undefined;
};

export const EndUserBudgetSelect: React.FC<EndUserBudgetSelectProps> = ({
  id,
  accessToken,
  value,
  onChange,
  canEdit,
}) => {
  const { t } = useTranslation();
  const { data: budgets } = useBudgetOptions(accessToken, canEdit);
  const options: SearchSelectOption[] = (budgets ?? []).map((budget) => ({
    label: budget.budget_id,
    value: budget.budget_id,
    sublabel: budgetSublabel(budget, t),
  }));

  return (
    <SearchSelect
      inputId={id}
      aria-label={t("keyTeam.defaultCustomerBudget")}
      placeholder={t("keyTeam.noDefaultBudget")}
      emptyText={t("keyTeam.noBudgetsFound")}
      options={options}
      value={value}
      onValueChange={onChange}
      disabled={!canEdit}
    />
  );
};
