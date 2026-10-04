import { Info } from "lucide-react";
import React from "react";
import { SimpleTooltip } from "@/components/ui/tooltip";

import { MountedFormField } from "@/components/common_components/MountedFormField";
import UpstreamTokenHeaderField from "./UpstreamTokenHeaderField";
import { requiredRule } from "@/components/common_components/formRules";
import { MultiSelect } from "@/components/shared/MultiSelect";
import { PasswordInput } from "@/components/shared/PasswordInput";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/i18n";
import { requiredUnlessSiblingSet, tagsControl, textControl } from "./mcpFieldRules";

interface IdJagFormFieldsProps {
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

const PRIVATE_KEY_PATH = ["credentials", "client_private_key"] as const;

const IdJagFormFields: React.FC<IdJagFormFieldsProps> = ({ isEditing = false }) => {
  const { t } = useTranslation();
  const placeholderSuffix = isEditing ? t("mcp.form.leaveBlankToKeepExisting") : "";
  const requiredWhenCreating = (message: string) =>
    isEditing ? undefined : { validate: { required: requiredRule(message) } };

  return (
    <>
      <MountedFormField
        label={
          <FieldLabel
            label={t("mcp.form.idJag.orgTokenEndpoint")}
            tooltip={t("mcp.form.idJag.orgTokenEndpointTooltip")}
          />
        }
        name="token_exchange_endpoint"
        required={!isEditing}
        rules={requiredWhenCreating(t("mcp.form.idJag.orgTokenEndpointRequired"))}
      >
        {(control) => (
          <Input
            {...textControl(control)}
            placeholder="https://your-org.okta.com/oauth2/v1/token"
            className={fieldClassName}
          />
        )}
      </MountedFormField>
      <MountedFormField
        label={
          <FieldLabel
            label={t("mcp.form.idJag.resourceTokenEndpoint")}
            tooltip={t("mcp.form.idJag.resourceTokenEndpointTooltip")}
          />
        }
        name={["credentials", "id_jag_resource_token_endpoint"]}
        required={!isEditing}
        rules={requiredWhenCreating(t("mcp.form.idJag.resourceTokenEndpointRequired"))}
      >
        {(control) => (
          <Input
            {...textControl(control)}
            placeholder="https://upstream.example.com/oauth2/token"
            className={fieldClassName}
          />
        )}
      </MountedFormField>
      <MountedFormField
        label={<FieldLabel label={t("mcp.form.oauth.clientId")} tooltip={t("mcp.form.idJag.clientIdTooltip")} />}
        name={["credentials", "client_id"]}
        required={!isEditing}
        rules={requiredWhenCreating(t("mcp.form.idJag.clientIdRequired"))}
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
          <FieldLabel label={t("mcp.form.oauth.clientSecret")} tooltip={t("mcp.form.idJag.clientSecretTooltip")} />
        }
        name={["credentials", "client_secret"]}
        rules={
          isEditing
            ? undefined
            : {
                deps: ["credentials.client_private_key"],
                validate: {
                  secretOrPrivateKey: requiredUnlessSiblingSet(
                    PRIVATE_KEY_PATH,
                    t("mcp.form.idJag.secretOrPrivateKeyRequired"),
                  ),
                },
              }
        }
      >
        {(control) => (
          <PasswordInput
            {...textControl(control)}
            placeholder={`${t("mcp.form.oauth.clientSecretPlaceholder")}${placeholderSuffix}`}
            groupClassName={fieldClassName}
          />
        )}
      </MountedFormField>
      <MountedFormField
        label={<FieldLabel label={t("mcp.form.idJag.privateKey")} tooltip={t("mcp.form.idJag.privateKeyTooltip")} />}
        name={PRIVATE_KEY_PATH}
      >
        {(control) => (
          <Textarea
            {...textControl(control)}
            rows={3}
            placeholder={`-----BEGIN PRIVATE KEY-----${placeholderSuffix}`}
            className={fieldClassName}
          />
        )}
      </MountedFormField>
      <MountedFormField
        label={
          <FieldLabel label={t("mcp.form.idJag.privateKeyId")} tooltip={t("mcp.form.idJag.privateKeyIdTooltip")} />
        }
        name={["credentials", "client_private_key_id"]}
      >
        {(control) => <Input {...textControl(control)} placeholder="my-signing-key-1" className={fieldClassName} />}
      </MountedFormField>
      <MountedFormField
        label={
          <FieldLabel
            label={t("mcp.form.idJag.assertionSigningAlg")}
            tooltip={t("mcp.form.idJag.assertionSigningAlgTooltip")}
          />
        }
        name={["credentials", "client_assertion_signing_alg"]}
      >
        {(control) => <Input {...textControl(control)} placeholder="RS256" className={fieldClassName} />}
      </MountedFormField>
      <MountedFormField
        label={<FieldLabel label={t("mcp.form.idJag.audience")} tooltip={t("mcp.form.idJag.audienceTooltip")} />}
        name="audience"
      >
        {(control) => (
          <Input {...textControl(control)} placeholder="https://upstream.example.com" className={fieldClassName} />
        )}
      </MountedFormField>
      <MountedFormField
        label={
          <FieldLabel
            label={t("mcp.form.idJag.resourceIndicator")}
            tooltip={t("mcp.form.idJag.resourceIndicatorTooltip")}
          />
        }
        name={["credentials", "id_jag_resource"]}
      >
        {(control) => (
          <Input {...textControl(control)} placeholder="https://upstream.example.com/mcp" className={fieldClassName} />
        )}
      </MountedFormField>
      <MountedFormField
        label={
          <FieldLabel
            label={t("mcp.form.idJag.subjectTokenType")}
            tooltip={t("mcp.form.idJag.subjectTokenTypeTooltip")}
          />
        }
        name="subject_token_type"
      >
        {(control) => (
          <Input
            {...textControl(control)}
            placeholder="urn:ietf:params:oauth:token-type:id_token"
            className={fieldClassName}
          />
        )}
      </MountedFormField>
      <MountedFormField
        label={<FieldLabel label={t("mcp.form.idJag.scopes")} tooltip={t("mcp.form.idJag.scopesTooltip")} />}
        name={["credentials", "scopes"]}
      >
        {(control) => (
          <MultiSelect {...tagsControl(control)} placeholder={t("mcp.form.addScopes")} className="rounded-lg" />
        )}
      </MountedFormField>
      <UpstreamTokenHeaderField />
    </>
  );
};

export default IdJagFormFields;
