import type { Language } from "@/i18n";

export type LicenseExpiryTier = "none" | "warning" | "critical" | "expired";

export const LICENSE_EXPIRY_WARNING_DAYS = 30;
export const LICENSE_EXPIRY_CRITICAL_DAYS = 7;

export const getDaysUntilExpiration = (expirationDate: string | null, now: Date = new Date()): number | null => {
  if (!expirationDate) {
    return null;
  }

  const expiration = new Date(`${expirationDate}T00:00:00Z`);
  if (Number.isNaN(expiration.getTime())) {
    return null;
  }

  const nowUtcMidnight = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const diffMs = expiration.getTime() - nowUtcMidnight;
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
};

export const getLicenseExpiryTier = (expirationDate: string | null, now: Date = new Date()): LicenseExpiryTier => {
  const days = getDaysUntilExpiration(expirationDate, now);
  if (days === null) {
    return "none";
  }
  if (days < 0) {
    return "expired";
  }
  if (days <= LICENSE_EXPIRY_CRITICAL_DAYS) {
    return "critical";
  }
  if (days <= LICENSE_EXPIRY_WARNING_DAYS) {
    return "warning";
  }
  return "none";
};

const EXPIRY_DATE_FORMAT: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
};

const EXPIRY_DATE_LOCALES: Record<Language, string> = { en: "en-US", zh: "zh-CN" };

export const formatExpiryDate = (expirationDate: string, language: Language = "en"): string => {
  const date = new Date(`${expirationDate}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) {
    return expirationDate;
  }
  return date.toLocaleDateString(EXPIRY_DATE_LOCALES[language] ?? "en-US", EXPIRY_DATE_FORMAT);
};

const EXPIRATION_STATUS: Record<Language, { none: string; expired: string; valid: string }> = {
  en: { none: "No expiration", expired: "Expired {date}", valid: "Expires {date}" },
  zh: { none: "永久有效", expired: "已于 {date} 过期", valid: "将于 {date} 到期" },
};

export const formatExpirationStatus = (
  expirationDate: string | null,
  now: Date = new Date(),
  language: Language = "en",
): string => {
  const days = getDaysUntilExpiration(expirationDate, now);
  const status = EXPIRATION_STATUS[language] ?? EXPIRATION_STATUS.en;
  if (expirationDate === null || days === null) {
    return status.none;
  }
  const template = days < 0 ? status.expired : status.valid;
  return template.replace("{date}", formatExpiryDate(expirationDate, language));
};
