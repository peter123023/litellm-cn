import React from "react";
import { Bot } from "lucide-react";
import { useTranslation } from "@/i18n";

interface EmptyStateProps {
  hasVariables: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({ hasVariables }) => {
  const { t } = useTranslation();

  return (
    <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
      <Bot className="mb-4 size-12" aria-hidden="true" />
      <span className="text-base">{hasVariables ? t("prompts.chat.emptyWithVariables") : t("prompts.chat.empty")}</span>
    </div>
  );
};

export default EmptyState;
