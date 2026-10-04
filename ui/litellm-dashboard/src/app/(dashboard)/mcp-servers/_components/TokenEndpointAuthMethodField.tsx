import { Info } from "lucide-react";
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SimpleTooltip } from "@/components/ui/tooltip";

import { MountedFormField } from "@/components/common_components/MountedFormField";
import { useTranslation } from "@/i18n";
import { selectControl, selectTriggerControl } from "./mcpFieldRules";

interface TokenEndpointAuthMethodFieldProps {
  isEditing?: boolean;
}

const TokenEndpointAuthMethodField: React.FC<TokenEndpointAuthMethodFieldProps> = ({ isEditing = false }) => {
  const { t } = useTranslation();

  return (
    <MountedFormField
      label={
        <span className="text-sm font-medium text-foreground flex items-center">
          {t("mcp.form.tokenEndpointAuthMethod")}
          <SimpleTooltip content={t("mcp.form.tokenEndpointAuthMethodTooltip")}>
            <Info className="ml-2 size-4 text-info hover:text-info/80 cursor-help" />
          </SimpleTooltip>
        </span>
      }
      name={["credentials", "token_endpoint_auth_method"]}
    >
      {(control) => {
        const placeholder = isEditing
          ? t("mcp.form.tokenEndpointAuthMethodKeepExisting")
          : t("mcp.form.tokenEndpointAuthMethodDefault");
        const options = [
          {
            value: "client_secret_basic",
            label: t("mcp.form.tokenEndpointAuthMethod.clientSecretBasic"),
          },
          { value: "client_secret_post", label: t("mcp.form.tokenEndpointAuthMethod.clientSecretPost") },
        ];
        return (
          <Select {...selectControl<string>(control)} items={options}>
            <SelectTrigger {...selectTriggerControl(control)} className="w-full rounded-lg">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={null}>{placeholder}</SelectItem>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }}
    </MountedFormField>
  );
};

export default TokenEndpointAuthMethodField;
