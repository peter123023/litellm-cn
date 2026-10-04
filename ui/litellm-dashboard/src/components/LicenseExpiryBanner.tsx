"use client";

import React, { useState } from "react";
import { CircleAlert, TriangleAlert, X } from "lucide-react";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/shared/Alert";
import { Button } from "@/components/ui/button";
import { LicenseInfo } from "@/components/networking";
import { useTranslation, type Translate } from "@/i18n";
import { useLicenseInfo } from "@/app/(dashboard)/hooks/license/useLicenseInfo";
import { formatExpiryDate, getDaysUntilExpiration, getLicenseExpiryTier } from "@/utils/licenseUtils";

const DISMISS_KEY_PREFIX = "litellm:licenseExpiryBannerDismissed:";
const SALES_EMAIL = "sales@berri.ai";

const salesLink = <a href={`mailto:${SALES_EMAIL}`}>{SALES_EMAIL}</a>;

interface LicenseExpiryBannerProps {
  accessToken: string | null;
}

interface LicenseExpiryBannerViewProps {
  licenseInfo: LicenseInfo | null;
}

const describeCountdown = (days: number, t: Translate): string => {
  if (days <= 0) {
    return t("licenseExpiry.expiresToday");
  }
  if (days === 1) {
    return t("licenseExpiry.expiresInOneDay");
  }
  return t("licenseExpiry.expiresInDays", { days });
};

const expiryDescription = (tier: "warning" | "critical" | "expired", t: Translate): React.ReactNode => {
  if (tier === "expired") {
    return (
      <>
        {t("licenseExpiry.expiredPrefix")}
        {salesLink}
        {t("licenseExpiry.expiredSuffix")}
      </>
    );
  }
  if (tier === "critical") {
    return (
      <>
        {t("licenseExpiry.criticalPrefix")}
        {salesLink}
        {t("licenseExpiry.criticalSuffix")}
      </>
    );
  }
  return (
    <>
      {t("licenseExpiry.warningPrefix")}
      {salesLink}
      {t("licenseExpiry.warningSuffix")}
    </>
  );
};

export const LicenseExpiryBannerView: React.FC<LicenseExpiryBannerViewProps> = ({ licenseInfo }) => {
  const { t } = useTranslation();
  const [locallyDismissed, setLocallyDismissed] = useState(false);

  const expirationDate = licenseInfo?.expiration_date ?? null;
  const tier = getLicenseExpiryTier(expirationDate);
  const days = getDaysUntilExpiration(expirationDate);

  if (expirationDate === null || tier === "none" || days === null) {
    return null;
  }

  const isDismissible = tier === "warning";
  const dismissKey = `${DISMISS_KEY_PREFIX}${expirationDate}`;
  const previouslyDismissed =
    isDismissible && typeof window !== "undefined" ? sessionStorage.getItem(dismissKey) === "true" : false;

  if (isDismissible && (locallyDismissed || previouslyDismissed)) {
    return null;
  }

  const formattedDate = formatExpiryDate(expirationDate, "en");

  const message =
    tier === "expired"
      ? t("licenseExpiry.expiredTitle", { date: formattedDate })
      : t("licenseExpiry.countdownTitle", { countdown: describeCountdown(days, t), date: formattedDate });

  const description = expiryDescription(tier, t);

  const handleClose = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(dismissKey, "true");
    }
    setLocallyDismissed(true);
  };

  return (
    <Alert variant={tier === "warning" ? "warning" : "error"} className="rounded-none border-x-0 border-t-0">
      {tier === "warning" ? (
        <TriangleAlert className="size-4" aria-hidden />
      ) : (
        <CircleAlert className="size-4" aria-hidden />
      )}
      <AlertTitle>{message}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
      {isDismissible && (
        <AlertAction>
          <Button variant="ghost" size="icon-sm" aria-label={t("common.close")} onClick={handleClose}>
            <X className="size-4" />
          </Button>
        </AlertAction>
      )}
    </Alert>
  );
};

export const LicenseExpiryBanner: React.FC<LicenseExpiryBannerProps> = ({ accessToken }) => {
  const { data } = useLicenseInfo(accessToken);
  return <LicenseExpiryBannerView licenseInfo={data ?? null} />;
};
