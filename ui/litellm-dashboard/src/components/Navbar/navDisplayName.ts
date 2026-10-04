import type { Translate } from "@/i18n";

const ACCOUNT_LABEL_EN = "Account";

/**
 * Primary label for the navbar account control — avoids raw placeholder JWT/user IDs in the UI.
 * `t` is injected rather than read from a hook so this stays a plain function; the default keeps
 * the English label for non-React callers.
 */
export function navAccountDisplayName(
  userEmail: string | null,
  userId: string | null,
  t: Translate = () => ACCOUNT_LABEL_EN,
): string {
  const email = userEmail?.trim();
  if (email) {
    return email;
  }
  const id = userId?.trim();
  if (!id) {
    return t("nav.account.fallback");
  }
  if (/^default[_\s-]?user[_\s-]?id$/i.test(id)) {
    return t("nav.account.fallback");
  }
  return id;
}
