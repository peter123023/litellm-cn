"use client";

import { Languages } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { LANGUAGE_LABELS, useTranslation } from "@/i18n";

/**
 * One-click toggle between English and Chinese. Switching only flips i18n context state,
 * so every translated component re-renders in place (no reload), and the choice is
 * persisted to localStorage for future visits.
 */
const LanguageToggle: React.FC = () => {
  const { language, toggleLanguage, t } = useTranslation();
  const target = language === "en" ? "中文" : "English";
  const label = t("language.switchTo", { language: target });
  const currentLabel = t("language.current", { language: LANGUAGE_LABELS[language] });

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label={label}
      title={currentLabel}
      className="text-muted-foreground"
      onClick={toggleLanguage}
    >
      <Languages />
    </Button>
  );
};

export default LanguageToggle;
