"use client";

import { InheritedBudgetHint, type InheritedBudgetGate } from "@/components/shared/InheritedBudgetHint";
import { Meter, MeterIndicator, MeterTrack } from "@/components/shared/Meter";
import { useTranslation } from "@/i18n";
import { formatNumberWithCommas, getSpendString } from "@/utils/dataUtils";

interface SpendBudgetCellProps {
  spend: number | null | undefined;
  maxBudget: number | null | undefined;
  inheritedGates?: readonly InheritedBudgetGate[];
  spendDecimals?: number;
  budgetDecimals?: number;
}

const meterTone = (pct: number): "default" | "warning" | "over" => {
  if (pct > 100) return "over";
  if (pct >= 80) return "warning";
  return "default";
};

export function SpendBudgetCell({
  spend,
  maxBudget,
  inheritedGates = [],
  spendDecimals = 4,
  budgetDecimals = 0,
}: SpendBudgetCellProps) {
  const { t } = useTranslation();
  const spendValue = typeof spend === "number" && !Number.isNaN(spend) ? spend : 0;
  const budget = maxBudget ?? null;
  const hasBudget = typeof budget === "number" && budget > 0;
  const pct = hasBudget ? (spendValue / budget) * 100 : 0;

  const budgetText = budget === null ? null : `$${formatNumberWithCommas(budget, budgetDecimals)}`;
  const spendText = spendValue > 0 ? getSpendString(spendValue, spendDecimals) : "$0.00";
  const budgetLabel =
    budgetText === null ? `· ${t("common.unlimited")}` : t("tableCells.spendOfBudget", { amount: budgetText });

  return (
    <div className="flex min-w-[130px] flex-col gap-1">
      <div className="whitespace-nowrap text-xs">
        <span className="font-medium tabular-nums text-foreground">{spendText}</span>{" "}
        <span className="text-muted-foreground">{budgetLabel}</span>
        {budget === null && <InheritedBudgetHint gates={inheritedGates} />}
      </div>
      {hasBudget && budgetText !== null && (
        <Meter
          value={spendValue}
          max={budget}
          aria-valuetext={`${spendText} ${t("tableCells.spendOfBudget", { amount: budgetText })}`}
        >
          <MeterTrack>
            <MeterIndicator tone={meterTone(pct)} />
          </MeterTrack>
        </Meter>
      )}
    </div>
  );
}
