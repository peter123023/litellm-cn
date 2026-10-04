"use client";

import React from "react";
import { TriangleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/shared/Alert";
import { useHealthReadinessDetails } from "@/app/(dashboard)/hooks/healthReadiness/useHealthReadinessDetails";
import { useTranslation } from "@/i18n";

interface DebugWarningBannerProps {
  accessToken: string | null;
}

export const DebugWarningBanner: React.FC<DebugWarningBannerProps> = ({ accessToken }) => {
  const { t } = useTranslation();
  const { data: healthData } = useHealthReadinessDetails(accessToken);

  // Only show banner if detailed debug mode is explicitly enabled
  if (!healthData?.is_detailed_debug) {
    return null;
  }

  return (
    <Alert variant="warning" className="rounded-none border-x-0 border-t-0">
      <TriangleAlert className="size-4" aria-hidden />
      <AlertTitle>{t("debugWarning.title")}</AlertTitle>
      <AlertDescription>
        {t("debugWarning.descPrefix")}
        <code>LITELLM_LOG=DEBUG</code>
        {t("debugWarning.descSuffix")}
      </AlertDescription>
    </Alert>
  );
};
