import googleLogo from "../../../../../public/assets/logos/google.svg";
import microsoftAzureLogo from "../../../../../public/assets/logos/microsoft_azure.svg";

import type { Translate } from "@/i18n";

// SSO Provider logos
export const ssoProviderLogoMap: Record<string, string> = {
  google: googleLogo.src,
  microsoft: microsoftAzureLogo.src,
  okta: "https://www.okta.com/sites/default/files/Okta_Logo_BrightBlue_Medium.png",
  generic: "",
  saml: "",
};

// SSO Provider display names (consistent between select dropdown and table)
const SSO_PROVIDER_DISPLAY_NAME_KEYS: Record<string, string> = {
  google: "adminSettings.sso.providers.google",
  microsoft: "adminSettings.sso.providers.microsoft",
  okta: "adminSettings.sso.providers.okta",
  generic: "adminSettings.sso.providers.generic",
  saml: "adminSettings.sso.providers.saml",
};

export function getSsoProviderDisplayNames(t: Translate): Record<string, string> {
  return Object.fromEntries(Object.entries(SSO_PROVIDER_DISPLAY_NAME_KEYS).map(([id, key]) => [id, t(key)]));
}

const DEFAULT_ROLE_DISPLAY_NAME_KEYS: Record<string, string> = {
  internal_user_viewer: "adminSettings.sso.roles.internalUserViewer",
  internal_user: "adminSettings.sso.roles.internalUser",
  proxy_admin_viewer: "adminSettings.sso.roles.proxyAdminViewer",
  proxy_admin: "adminSettings.sso.roles.proxyAdmin",
};

export function getDefaultRoleDisplayNames(t: Translate): Record<string, string> {
  return Object.fromEntries(Object.entries(DEFAULT_ROLE_DISPLAY_NAME_KEYS).map(([role, key]) => [role, t(key)]));
}
