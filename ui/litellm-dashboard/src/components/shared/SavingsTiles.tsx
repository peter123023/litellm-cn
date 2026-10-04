"use client";

import React, { useMemo } from "react";

import SummaryCard from "@/components/shared/SummaryCard";
import {
  autorouterOf,
  cachingOf,
  compressionOf,
  gatewayAttributedCachingOf,
  SAVINGS_DRIVERS,
  savedTokensOf,
  sumOverDays,
  usd,
} from "@/app/(dashboard)/cost-optimization/_components/costOptimizationUtils";
import { DailyData } from "@/components/UsagePage/types";
import { useTranslation } from "@/i18n";
import { formatNumberWithCommas } from "@/utils/dataUtils";

// The total sums SAVINGS_DRIVERS, so it is by construction the sum of what the
// charts plot; the donut and timelines derive from the same list in costOptimizationUtils.
const useSavingsTotals = (results: DailyData[]) =>
  useMemo(
    () => ({
      compression: sumOverDays(results, compressionOf),
      caching: sumOverDays(results, cachingOf),
      autorouter: sumOverDays(results, autorouterOf),
      gatewayAttributedCaching: sumOverDays(results, gatewayAttributedCachingOf),
      savedTokens: sumOverDays(results, savedTokensOf),
      total: SAVINGS_DRIVERS.reduce((sum, { of }) => sum + sumOverDays(results, of), 0),
    }),
    [results],
  );

const SavingsTiles = ({ results, isLoading }: { results: DailyData[]; isLoading: boolean }) => {
  const { t } = useTranslation();
  const totals = useSavingsTotals(results);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <SummaryCard
        label={t("savingsTiles.totalRecorded")}
        value={usd(totals.total)}
        hint={isLoading ? t("common.loading") : t("savingsTiles.totalHint")}
        info={t("savingsTiles.totalInfo")}
      />
      <SummaryCard
        label={t("savingsTiles.compression")}
        value={usd(totals.compression)}
        hint={t("savingsTiles.tokensCompressed", { count: formatNumberWithCommas(totals.savedTokens) })}
        info={t("savingsTiles.compressionInfo")}
      />
      <SummaryCard
        label={t("savingsTiles.promptCaching")}
        value={usd(totals.gatewayAttributedCaching)}
        hint={t("savingsTiles.litellmInjected")}
        secondary={{ label: t("common.total"), value: usd(totals.caching) }}
        info={t("savingsTiles.promptCachingInfo")}
      />
      <SummaryCard
        label={t("savingsTiles.autoRouter")}
        value={usd(totals.autorouter)}
        hint={t("savingsTiles.autoRouterHint")}
        info={t("savingsTiles.autoRouterInfo")}
      />
    </div>
  );
};

export default SavingsTiles;
