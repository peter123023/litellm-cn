import type { Translate } from "@/i18n";

export const SENSITIVE_FIELDS = new Set(["cyberark_api_key", "client_key"]);

const FIELD_LABEL_KEYS: Record<string, string> = {
  cyberark_api_base: "adminSettings.cyberArk.fieldLabels.conjurServerUrl",
  cyberark_account: "adminSettings.cyberArk.fieldLabels.account",
  cyberark_username: "adminSettings.cyberArk.fieldLabels.username",
  cyberark_api_key: "adminSettings.cyberArk.fieldLabels.apiKey",
  client_cert: "adminSettings.cyberArk.fieldLabels.clientCertificate",
  client_key: "adminSettings.cyberArk.fieldLabels.clientKey",
  ssl_verify: "adminSettings.cyberArk.fieldLabels.sslVerification",
  refresh_interval: "adminSettings.cyberArk.fieldLabels.tokenRefreshInterval",
};

export function getFieldLabels(t: Translate): Record<string, string> {
  return Object.fromEntries(Object.entries(FIELD_LABEL_KEYS).map(([field, key]) => [field, t(key)]));
}
