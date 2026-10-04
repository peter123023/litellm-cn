import React from "react";
import { PromptType } from "./types";
import { convertToDotPrompt } from "./utils";
import { useTranslation } from "@/i18n";

interface DotpromptViewTabProps {
  prompt: PromptType;
}

const DotpromptViewTab: React.FC<DotpromptViewTabProps> = ({ prompt }) => {
  const dotpromptContent = convertToDotPrompt(prompt);
  const { t } = useTranslation();

  return (
    <div className="p-6">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-foreground mb-2">{t("prompts.editor.generatedFile")}</h3>
        <p className="text-xs text-muted-foreground">{t("prompts.editor.generatedFileHint")}</p>
      </div>
      <div className="bg-muted border border-border rounded-lg p-4 overflow-auto">
        <pre className="text-sm text-foreground font-mono whitespace-pre-wrap">{dotpromptContent}</pre>
      </div>
    </div>
  );
};

export default DotpromptViewTab;
