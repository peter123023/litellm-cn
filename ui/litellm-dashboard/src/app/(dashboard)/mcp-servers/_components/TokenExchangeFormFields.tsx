import { Info } from "lucide-react";
import React from "react";
import { MultiSelect } from "@/components/shared/MultiSelect";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SimpleTooltip } from "@/components/ui/tooltip";
import { useWatch } from "react-hook-form";

import { MountedFormField } from "@/components/common_components/MountedFormField";
import UpstreamTokenHeaderField from "./UpstreamTokenHeaderField";
import { requiredRule } from "@/components/common_components/formRules";
import { PasswordInput } from "@/components/shared/PasswordInput";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/i18n";
import { selectControl, selectTriggerControl, tagsControl, textControl } from "./mcpFieldRules";

interface TokenExchangeFormFieldsProps {
  isEditing?: boolean;
}

const fieldClassName = "rounded-lg border-border focus:border-info focus:ring-ring";

const FieldLabel: React.FC<{ label: string; tooltip: string }> = ({ label, tooltip }) => (
  <span className="text-sm font-medium text-foreground flex items-center">
    {label}
    <SimpleTooltip content={tooltip}>
      <Info className="ml-2 size-4 text-info hover:text-info/80 cursor-help" />
    </SimpleTooltip>
  </span>
);

const TokenExchangeFormFields: React.FC<TokenExchangeFormFieldsProps> = ({ isEditing = false }) => {
  const { t } = useTranslation();
  const placeholderSuffix = isEditing ? t("mcp.form.leaveBlankToKeepExisting") : "";
  const isEntraObo = useWatch({ name: "token_exchange_profile" }) === "entra_obo";
  const requiredWhenCreating = (message: string) =>
    isEditing ? undefined : { validate: { required: requiredRule(message) } };
  const profileItems = [
    { value: "rfc8693", label: t("mcp.form.tokenExchangeProfile.rfc8693") },
    { value: "entra_obo", label: t("mcp.form.tokenExchangeProfile.entraObo") },
  ];

  return (
    <>
      <MountedFormField
        label={<FieldLabel label={t("mcp.form.profile")} tooltip={t("mcp.form.profileTooltip")} />}
        name="token_exchange_profile"
        {...(isEditing ? {} : { defaultValue: "rfc8693" })}
      >
        {(control) => (
          <Select {...selectControl<string>(control)} items={profileItems}>
            <SelectTrigger {...selectTriggerControl(control)} className="w-full rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {profileItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  <span className="font-medium">{item.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </MountedFormField>
      <MountedFormField
        label={
          <FieldLabel
            label={t("mcp.form.tokenExchangeEndpoint")}
            tooltip={t("mcp.form.tokenExchangeEndpointTooltip")}
          />
        }
        name="token_exchange_endpoint"
      >
        {(control) => (
          <Input
            {...textControl(control)}
            placeholder="https://idp.example.com/oauth2/token"
            className={fieldClassName}
          />
        )}
      </MountedFormField>
      <MountedFormField
        label={
          <FieldLabel label={t("mcp.form.oauth.clientId")} tooltip={t("mcp.form.tokenExchange.clientIdTooltip")} />
        }
        name={["credentials", "client_id"]}
        required={!isEditing}
        rules={requiredWhenCreating(t("mcp.form.tokenExchange.clientIdRequired"))}
      >
        {(control) => (
          <PasswordInput
            {...textControl(control)}
            placeholder={`${t("mcp.form.oauth.clientIdPlaceholder")}${placeholderSuffix}`}
            groupClassName={fieldClassName}
          />
        )}
      </MountedFormField>
      <MountedFormField
        label={
          <FieldLabel
            label={t("mcp.form.oauth.clientSecret")}
            tooltip={t("mcp.form.tokenExchange.clientSecretTooltip")}
          />
        }
        name={["credentials", "client_secret"]}
        required={!isEditing}
        rules={requiredWhenCreating(t("mcp.form.tokenExchange.clientSecretRequired"))}
      >
        {(control) => (
          <PasswordInput
            {...textControl(control)}
            placeholder={`${t("mcp.form.oauth.clientSecretPlaceholder")}${placeholderSuffix}`}
            groupClassName={fieldClassName}
          />
        )}
      </MountedFormField>
      {!isEntraObo && (
        <>
          <MountedFormField
            label={
              <FieldLabel
                label={t("mcp.form.tokenExchange.audience")}
                tooltip={t("mcp.form.tokenExchange.audienceTooltip")}
              />
            }
            name="audience"
          >
            {(control) => (
              <Input {...textControl(control)} placeholder="https://upstream.example.com" className={fieldClassName} />
            )}
          </MountedFormField>
          <MountedFormField
            label={
              <FieldLabel
                label={t("mcp.form.tokenExchange.subjectTokenType")}
                tooltip={t("mcp.form.tokenExchange.subjectTokenTypeTooltip")}
              />
            }
            name="subject_token_type"
          >
            {(control) => (
              <Input
                {...textControl(control)}
                placeholder="urn:ietf:params:oauth:token-type:access_token"
                className={fieldClassName}
              />
            )}
          </MountedFormField>
        </>
      )}
      <MountedFormField
        label={
          <FieldLabel
            label={isEntraObo ? t("mcp.form.scopes") : t("mcp.form.scopesOptional")}
            tooltip={
              isEntraObo ? t("mcp.form.tokenExchange.entraScopesTooltip") : t("mcp.form.tokenExchange.scopesTooltip")
            }
          />
        }
        name={["credentials", "scopes"]}
        required={isEntraObo}
        rules={
          isEntraObo
            ? {
                validate: {
                  required: requiredRule(t("mcp.form.tokenExchange.entraScopesRequired")),
                },
              }
            : undefined
        }
      >
        {(control) => (
          <MultiSelect
            {...tagsControl(control)}
            placeholder={isEntraObo ? "api://<app-id>/.default" : t("mcp.form.addScopes")}
            className="rounded-lg"
          />
        )}
      </MountedFormField>
      <UpstreamTokenHeaderField />
    </>
  );
};

export default TokenExchangeFormFields;
