"use client";

import React, { useState } from "react";
import { ArrowUpCircle, X } from "lucide-react";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/shared/Alert";
import { Button } from "@/components/ui/button";
import { useHealthReadinessDetails } from "@/app/(dashboard)/hooks/healthReadiness/useHealthReadinessDetails";
import {
  type LatestReleaseInfo,
  useLatestReleaseInfo,
} from "@/app/(dashboard)/hooks/latestRelease/useLatestReleaseInfo";
import { getLocalStorageItem, setLocalStorageItem } from "@/utils/localStorageUtils";
import { isNewerVersion } from "@/utils/versionUtils";
import { translate, useTranslation, type Language } from "@/i18n";

const DISMISS_KEY_PREFIX = "litellm:upgradeBannerDismissed:";

interface UpgradeBannerProps {
  accessToken: string | null;
}

interface UpgradeBannerViewProps {
  currentVersion: string | null | undefined;
  latestRelease: LatestReleaseInfo | null | undefined;
}

const countLabel = (count: number, singularKey: string, pluralKey: string, language: Language): string =>
  translate(language, count === 1 ? singularKey : pluralKey, { count });

export const describeRelease = (
  { new_features, bug_fixes, other_updates }: LatestReleaseInfo,
  language: Language = "en",
): string =>
  [
    countLabel(new_features, "upgradeBanner.newFeature", "upgradeBanner.newFeatures", language),
    countLabel(bug_fixes, "upgradeBanner.fix", "upgradeBanner.fixes", language),
    translate(language, "upgradeBanner.and", {
      rest: countLabel(other_updates, "upgradeBanner.otherUpdate", "upgradeBanner.otherUpdates", language),
    }),
  ].join(translate(language, "upgradeBanner.listSeparator"));

export const UpgradeBannerView: React.FC<UpgradeBannerViewProps> = ({ currentVersion, latestRelease }) => {
  const { t, language } = useTranslation();
  const [dismissedVersion, setDismissedVersion] = useState<string | null>(null);

  if (!currentVersion || !latestRelease || !isNewerVersion(currentVersion, latestRelease.version)) {
    return null;
  }

  const dismissKey = `${DISMISS_KEY_PREFIX}${latestRelease.version}`;
  if (dismissedVersion === latestRelease.version || getLocalStorageItem(dismissKey) === "true") {
    return null;
  }

  const handleClose = () => {
    setLocalStorageItem(dismissKey, "true");
    setDismissedVersion(latestRelease.version);
  };

  return (
    <Alert role="status" variant="info" className="rounded-none border-x-0 border-t-0">
      <ArrowUpCircle className="size-4" aria-hidden />
      <AlertTitle>
        {t("upgradeBanner.latestPrefix")}
        <a href={latestRelease.release_url} target="_blank" rel="noopener noreferrer" className="underline">
          v{latestRelease.version}
        </a>
        {t("upgradeBanner.latestSuffix", { stats: describeRelease(latestRelease, language) })}
      </AlertTitle>
      <AlertDescription>{t("upgradeBanner.currentVersion", { version: currentVersion })}</AlertDescription>
      <AlertAction>
        <Button variant="ghost" size="icon-sm" aria-label={t("common.close")} onClick={handleClose}>
          <X className="size-4" />
        </Button>
      </AlertAction>
    </Alert>
  );
};

export const UpgradeBanner: React.FC<UpgradeBannerProps> = ({ accessToken }) => {
  const { data: healthData } = useHealthReadinessDetails(accessToken);
  const { data: latestRelease } = useLatestReleaseInfo(accessToken);
  return <UpgradeBannerView currentVersion={healthData?.litellm_version} latestRelease={latestRelease} />;
};
