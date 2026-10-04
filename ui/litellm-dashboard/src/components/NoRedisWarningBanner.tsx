"use client";

import React from "react";
import { TriangleAlert } from "lucide-react";
import { useHealthReadinessDetails } from "@/app/(dashboard)/hooks/healthReadiness/useHealthReadinessDetails";
import { useTranslation } from "@/i18n";

const REDIS_DOCS_URL = "https://docs.litellm.ai/docs/proxy/redis_requirements";

interface NoRedisWarningBannerProps {
  accessToken: string | null;
}

export const NoRedisWarningBanner: React.FC<NoRedisWarningBannerProps> = ({ accessToken }) => {
  const { t } = useTranslation();
  const { data: healthData } = useHealthReadinessDetails(accessToken);

  if (!healthData?.show_no_redis_warning) {
    return null;
  }

  return (
    <div
      role="alert"
      className="flex items-start gap-3 border-b border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
    >
      <TriangleAlert className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
      <div>
        <p className="font-semibold">{t("noRedis.title")}</p>
        <p>
          {t("noRedis.bodyPrefix")}
          <a className="underline" href={REDIS_DOCS_URL} target="_blank" rel="noreferrer">
            {t("noRedis.linkText")}
          </a>
          {t("noRedis.bodyMiddle")}
          <code className="font-mono">LITELLM_DISABLE_NO_REDIS_WARNING=true</code>
          {t("noRedis.bodySuffix")}
        </p>
      </div>
    </div>
  );
};
