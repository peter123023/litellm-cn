export const SUPPORTED_LANGUAGES = ["en", "zh"] as const;

export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: Language = "en";

export const LANGUAGE_STORAGE_KEY = "litellm_ui_language";

/** Name shown in the language switcher, always written in that language itself. */
export const LANGUAGE_LABELS: Record<Language, string> = {
  en: "English",
  zh: "中文",
};

/** Value for <html lang>; Chinese needs the region so the right font stack applies. */
export const HTML_LANG: Record<Language, string> = {
  en: "en",
  zh: "zh-CN",
};

export function normalizeLanguage(value: string | null | undefined): Language | null {
  if (!value) return null;
  const lower = value.toLowerCase();
  if (lower.startsWith("zh")) return "zh";
  if (lower.startsWith("en")) return "en";
  return null;
}
