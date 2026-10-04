"use client";

import React from "react";
import { useTranslation } from "@/i18n";
import { UiLoadingSpinner } from "../ui/ui-loading-spinner";

interface ChartLoaderProps {
  isDateChanging?: boolean;
}

export const ChartLoader: React.FC<ChartLoaderProps> = ({ isDateChanging = false }) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-center h-40">
      <div className="flex items-center justify-center gap-3">
        <UiLoadingSpinner className="size-5" />
        <div className="flex flex-col">
          <span className="text-muted-foreground text-sm font-medium">
            {isDateChanging ? t("chartLoader.processingDate") : t("chartLoader.loadingChart")}
          </span>
          <span className="text-muted-foreground text-xs mt-1">
            {isDateChanging ? t("chartLoader.justAMoment") : t("chartLoader.fetchingData")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChartLoader;
