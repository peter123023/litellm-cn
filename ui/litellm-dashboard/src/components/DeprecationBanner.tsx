"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Info, X } from "lucide-react";
import { useTranslation } from "@/i18n";

const DEPRECATION_DISCUSSION_URL = "https://github.com/BerriAI/litellm/discussions/32090";
const DEPRECATION_TARGET_DATE = "September 1, 2026";

interface DeprecationBannerProps {
  featureName: string;
}

export const DeprecationBanner: React.FC<DeprecationBannerProps> = ({ featureName }) => {
  const { t } = useTranslation();
  const [isClosed, setIsClosed] = useState(false);

  if (isClosed) {
    return null;
  }

  return (
    <div
      role="alert"
      className="mb-4 flex items-start gap-3 rounded-lg border border-border bg-muted/50 px-4 py-3 text-sm"
    >
      <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <p className="font-medium">{t("deprecation.title", { feature: featureName })}</p>
        <p className="mt-1 break-words text-muted-foreground">
          {t("deprecation.body", { feature: featureName, date: DEPRECATION_TARGET_DATE })}
          <Link
            href={DEPRECATION_DISCUSSION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4"
          >
            {t("deprecation.discussionLink")}
          </Link>
          {t("deprecation.bodySuffix")}
        </p>
      </div>
      <button
        type="button"
        aria-label={t("common.close")}
        onClick={() => setIsClosed(true)}
        className="shrink-0 rounded-md p-0.5 text-muted-foreground transition-colors hover:text-foreground"
      >
        <X className="size-4" />
      </button>
    </div>
  );
};
