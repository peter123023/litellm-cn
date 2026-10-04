import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import VariableTextArea from "../variable_textarea";
import { useTranslation } from "@/i18n";

interface DeveloperMessageCardProps {
  value: string;
  onChange: (value: string) => void;
}

const DeveloperMessageCard: React.FC<DeveloperMessageCardProps> = ({ value, onChange }) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardContent className="p-3">
        <p className="mb-2 text-sm font-medium text-foreground">{t("prompts.editor.developerMessage")}</p>
        <p className="mb-2 text-xs text-muted-foreground">{t("prompts.editor.developerMessageHint")}</p>
        <VariableTextArea
          value={value}
          onChange={onChange}
          rows={3}
          placeholder={t("prompts.editor.developerMessagePlaceholder")}
        />
      </CardContent>
    </Card>
  );
};

export default DeveloperMessageCard;
