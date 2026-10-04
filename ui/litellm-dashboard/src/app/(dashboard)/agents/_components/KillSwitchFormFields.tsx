import React from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldTitle } from "@/components/ui/field";
import { PasswordInput } from "@/components/shared/PasswordInput";
import { useTranslation } from "@/i18n";
import { AgentFormField, AgentFormValues, labelWithHint } from "./AgentFormKit";
import { KILL_SWITCH_AUTH_TYPES, KILL_SWITCH_METHODS, validateKillSwitchBody } from "./kill_switch_config";

const KeyValueFieldArray = ({
  name,
  addLabel,
  removeLabel,
  keyPlaceholder,
  valuePlaceholder,
}: {
  name: "kill_switch.headers" | "kill_switch.query_params";
  addLabel: string;
  removeLabel: string;
  keyPlaceholder: string;
  valuePlaceholder: string;
}) => {
  const { t } = useTranslation();
  const { control } = useFormContext<AgentFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name });

  return (
    <div className="flex flex-col gap-2">
      {fields.map((item, index) => (
        <div key={item.id} className="flex items-start gap-2">
          <AgentFormField name={`${name}.${index}.key`} rules={{ required: t("agents.killSwitch.nameRequired") }}>
            {({ value, onChange, ref, ...control }) => (
              <Input
                {...control}
                ref={ref}
                className="w-55"
                placeholder={keyPlaceholder}
                value={typeof value === "string" ? value : ""}
                onChange={onChange}
              />
            )}
          </AgentFormField>
          <AgentFormField name={`${name}.${index}.value`}>
            {({ value, onChange, ref, ...control }) => (
              <Input
                {...control}
                ref={ref}
                className="w-65"
                placeholder={valuePlaceholder}
                value={typeof value === "string" ? value : ""}
                onChange={onChange}
              />
            )}
          </AgentFormField>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={removeLabel}
            className="text-destructive hover:text-destructive/80"
            onClick={() => remove(index)}
          >
            <Trash2 />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" className="w-full border-dashed" onClick={() => append({})}>
        <Plus />
        {addLabel}
      </Button>
    </div>
  );
};

const TextField = ({
  name,
  label,
  placeholder,
  required,
  secret,
}: {
  name: `kill_switch.${string}`;
  label: React.ReactNode;
  placeholder?: string;
  required?: string;
  secret?: boolean;
}) => (
  <AgentFormField name={name} label={label} rules={required ? { required } : undefined}>
    {({ value, onChange, ref, ...control }) =>
      secret ? (
        <PasswordInput
          {...control}
          ref={ref}
          placeholder={placeholder}
          value={typeof value === "string" ? value : ""}
          onChange={onChange}
        />
      ) : (
        <Input
          {...control}
          ref={ref}
          placeholder={placeholder}
          value={typeof value === "string" ? value : ""}
          onChange={onChange}
        />
      )
    }
  </AgentFormField>
);

const KillSwitchAuthFields = () => {
  const { t } = useTranslation();
  const { control } = useFormContext<AgentFormValues>();
  const authType = useWatch({ control, name: "kill_switch.auth_type" });

  switch (authType) {
    case "bearer":
      return (
        <TextField
          name="kill_switch.auth_token"
          label={t("agents.killSwitch.bearerToken")}
          required={t("agents.killSwitch.tokenRequired")}
          secret
        />
      );
    case "api_key":
      return (
        <>
          <TextField
            name="kill_switch.auth_header_name"
            label={t("agents.killSwitch.headerName")}
            placeholder="X-API-Key"
          />
          <TextField
            name="kill_switch.auth_api_key"
            label={t("agents.killSwitch.apiKey")}
            required={t("agents.killSwitch.apiKeyRequired")}
            secret
          />
        </>
      );
    case "basic":
      return (
        <>
          <TextField
            name="kill_switch.auth_username"
            label={t("agents.killSwitch.username")}
            required={t("agents.killSwitch.usernameRequired")}
          />
          <TextField
            name="kill_switch.auth_password"
            label={t("agents.killSwitch.password")}
            required={t("agents.killSwitch.passwordRequired")}
            secret
          />
        </>
      );
    default:
      return null;
  }
};

const KillSwitchFormFields = () => {
  const { t } = useTranslation();
  const authTypeItems = KILL_SWITCH_AUTH_TYPES.map((option) => ({ value: option.value, label: t(option.labelKey) }));
  const methodItems = KILL_SWITCH_METHODS.map((method) => ({ value: method, label: method }));

  return (
    <>
      <TextField
        name="kill_switch.url"
        label={labelWithHint(t("agents.killSwitch.webhookUrl"), t("agents.killSwitch.webhookUrlHint"))}
        placeholder="https://example.com/hooks/kill-agent"
      />

      <AgentFormField name="kill_switch.method" label={t("agents.killSwitch.method")}>
        {({ value, onChange, ref: _ref, ...control }) => (
          <Select items={methodItems} value={typeof value === "string" ? value : "POST"} onValueChange={onChange}>
            <SelectTrigger {...control} className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {methodItems.map((method) => (
                <SelectItem key={method.value} value={method.value}>
                  {method.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </AgentFormField>

      <Field>
        <FieldTitle>{t("agents.killSwitch.headers")}</FieldTitle>
        <KeyValueFieldArray
          name="kill_switch.headers"
          addLabel={t("agents.killSwitch.addHeader")}
          removeLabel={t("agents.killSwitch.removeHeaderAria")}
          keyPlaceholder={t("agents.killSwitch.headerNamePlaceholder")}
          valuePlaceholder={t("agents.killSwitch.headerValuePlaceholder")}
        />
      </Field>

      <Field>
        <FieldTitle>{t("agents.killSwitch.queryParams")}</FieldTitle>
        <KeyValueFieldArray
          name="kill_switch.query_params"
          addLabel={t("agents.killSwitch.addQueryParam")}
          removeLabel={t("agents.killSwitch.removeQueryParamAria")}
          keyPlaceholder={t("agents.killSwitch.paramNamePlaceholder")}
          valuePlaceholder={t("agents.killSwitch.paramValuePlaceholder")}
        />
      </Field>

      <AgentFormField
        name="kill_switch.body"
        label={labelWithHint(t("agents.killSwitch.jsonBody"), t("agents.killSwitch.jsonBodyHint"))}
        rules={{ validate: (value) => validateKillSwitchBody(typeof value === "string" ? value : "", t) }}
      >
        {({ value, onChange, ref, ...control }) => (
          <Textarea
            {...control}
            ref={ref}
            rows={4}
            placeholder='{"reason": "manual kill switch"}'
            value={typeof value === "string" ? value : ""}
            onChange={onChange}
          />
        )}
      </AgentFormField>

      <AgentFormField name="kill_switch.auth_type" label={t("agents.killSwitch.authentication")}>
        {({ value, onChange, ref: _ref, ...control }) => (
          <Select items={authTypeItems} value={typeof value === "string" ? value : "none"} onValueChange={onChange}>
            <SelectTrigger {...control} className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {authTypeItems.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </AgentFormField>

      <KillSwitchAuthFields />
    </>
  );
};

export default KillSwitchFormFields;
