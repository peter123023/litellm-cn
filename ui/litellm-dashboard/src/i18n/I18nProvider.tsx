"use client";

import * as React from "react";
import { DEFAULT_LANGUAGE, HTML_LANG, LANGUAGE_STORAGE_KEY, normalizeLanguage, type Language } from "./config";
import { en } from "./locales/en";
import { zh } from "./locales/zh";

export type TranslateParams = Record<string, string | number>;
export type Translate = (key: string, params?: TranslateParams) => string;

const dictionaries: Record<Language, Record<string, string>> = { en, zh };

/**
 * Resolves a flat "namespace.key" against the active dictionary. Missing keys fall back to
 * English and then to the key itself, so a partially translated page degrades instead of
 * rendering blanks.
 */
export function translate(language: Language, key: string, params?: TranslateParams): string {
  const active = dictionaries[language] ?? dictionaries[DEFAULT_LANGUAGE];
  const template = active[key] ?? dictionaries[DEFAULT_LANGUAGE][key];
  if (template === undefined) return key;
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) => {
    const value = params[name];
    return value === undefined ? match : String(value);
  });
}

// Language is global UI state, so it lives in a module-level external store shared through
// useSyncExternalStore instead of a context tree: switching notifies every translated
// component, which re-renders in place (no reload, no cascading setState in effects).
let currentLanguage: Language = DEFAULT_LANGUAGE;
const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const getSnapshot = (): Language => currentLanguage;

// Server render and the first hydration pass always agree on the default; the stored or
// browser-detected language is adopted immediately after hydration.
const getServerSnapshot = (): Language => DEFAULT_LANGUAGE;

const readStoredLanguage = (): Language | null => {
  try {
    return normalizeLanguage(window.localStorage.getItem(LANGUAGE_STORAGE_KEY));
  } catch {
    return null;
  }
};

const persistLanguage = (language: Language) => {
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    // Persisting the preference is best-effort (private mode can throw).
  }
};

export function setLanguage(next: Language): void {
  if (next === currentLanguage) return;
  currentLanguage = next;
  persistLanguage(next);
  document.documentElement.lang = HTML_LANG[next];
  listeners.forEach((listener) => listener());
}

export function toggleLanguage(): void {
  setLanguage(currentLanguage === "en" ? "zh" : "en");
}

export interface UseTranslationResult {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: Translate;
}

export function useTranslation(): UseTranslationResult {
  const language = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const t = React.useCallback<Translate>((key, params) => translate(language, key, params), [language]);
  return { language, setLanguage, toggleLanguage, t };
}

/**
 * Adopts the persisted (or browser-detected) language once on the client and keeps
 * <html lang> in sync so the correct font stack applies.
 */
export function I18nProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    const initial = readStoredLanguage() ?? normalizeLanguage(window.navigator.language) ?? DEFAULT_LANGUAGE;
    if (initial !== currentLanguage) {
      currentLanguage = initial;
      persistLanguage(initial);
    }
    document.documentElement.lang = HTML_LANG[currentLanguage];
  }, []);

  return <>{children}</>;
}
