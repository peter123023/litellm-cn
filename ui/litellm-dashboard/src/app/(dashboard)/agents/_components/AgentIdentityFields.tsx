import React, { useEffect, useState } from "react";
import { useWatch } from "react-hook-form";
import { apiClient } from "@/components/networking";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "@/i18n";
import { AgentFormField, type AgentFormValues } from "./AgentFormKit";
import { entraTenantFromIssuer, IDENTITY_UUID_PATTERN } from "./agent_identity";

const PROVIDER_VALUES = ["none", "microsoft_entra"] as const;
const EXECUTION_MODE_VALUES = ["autonomous", "delegated", "both"] as const;
const EXECUTION_VALUES = ["enabled", "disabled"] as const;

export const AgentIdentityFields = ({ accessToken }: { accessToken: string | null }) => {
  const { t } = useTranslation();
  const provider = useWatch<AgentFormValues>({ name: "identity_provider" });
  const mode = useWatch<AgentFormValues>({ name: "execution_mode" });
  const showScopes = mode !== "autonomous" && mode !== undefined;
  const [tenants, setTenants] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const providerOptions = PROVIDER_VALUES.map((value) => ({
    value,
    label: value === "none" ? t("agents.identity.providerNone") : t("agents.identity.providerEntra"),
  }));
  const executionModeOptions = EXECUTION_MODE_VALUES.map((value) => ({
    value,
    label: t(`agents.identity.executionMode.${value}`),
  }));
  const executionOptions = EXECUTION_VALUES.map((value) => ({
    value,
    label: value === "enabled" ? t("common.enabled") : t("common.disabled"),
  }));

  useEffect(() => {
    if (!accessToken || provider !== "microsoft_entra") return;
    let active = true;
    apiClient
      .get<string[]>("/v1/agents/identity/providers", { accessToken })
      .then((issuers) => {
        if (active) {
          setError(null);
          setTenants(
            issuers.flatMap((issuer) => {
              const tenant = entraTenantFromIssuer(issuer);
              return tenant ? [tenant] : [];
            }),
          );
        }
      })
      .catch(() => {
        if (active) setError(t("agents.identity.providersLoadFailed"));
      });
    return () => {
      active = false;
    };
  }, [accessToken, provider, t]);

  return (
    <>
      <section
        aria-label={t("agents.identity.sectionLabel")}
        className="my-6 space-y-4 rounded-lg border border-border p-4"
      >
        <div>
          <h3 className="font-medium">{t("agents.identity.formTitle")}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{t("agents.identity.formDescription")}</p>
        </div>
        <AgentFormField name="identity_provider" label={t("agents.identity.providerLabel")} defaultValue="none">
          {({ value, onChange, id }) => (
            <Select items={providerOptions} value={typeof value === "string" ? value : "none"} onValueChange={onChange}>
              <SelectTrigger id={id}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {providerOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </AgentFormField>
        {provider === "microsoft_entra" && (
          <>
            <AgentFormField
              name="identity_tenant_id"
              label={t("agents.identity.tenantLabel")}
              rules={{ required: t("agents.identity.tenantRequired") }}
            >
              {({ value, onChange, id }) => (
                <Select value={typeof value === "string" ? value : ""} onValueChange={onChange}>
                  <SelectTrigger id={id}>
                    <SelectValue placeholder={t("agents.identity.tenantPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {tenants.map((tenant) => (
                      <SelectItem key={tenant} value={tenant}>
                        {tenant}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </AgentFormField>
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
            {!error && tenants.length === 0 && (
              <p className="text-sm text-muted-foreground">{t("agents.identity.noTrustedTenant")}</p>
            )}
            <AgentFormField
              name="identity_client_id"
              label={t("agents.identity.clientIdLabel")}
              rules={{
                required: t("agents.identity.clientIdRequired"),
                pattern: { value: IDENTITY_UUID_PATTERN, message: t("agents.identity.clientIdInvalid") },
              }}
              description={
                <>
                  {t("agents.identity.clientIdHintBefore")}{" "}
                  <a className="underline" href="https://entra.microsoft.com/" target="_blank" rel="noreferrer">
                    {t("agents.identity.entraAppRegistrations")}
                  </a>
                  {t("agents.identity.clientIdHintAfter")}
                </>
              }
            >
              {({ value, onChange, ref, ...control }) => (
                <Input
                  {...control}
                  ref={ref}
                  value={typeof value === "string" ? value : ""}
                  onChange={onChange}
                  placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                />
              )}
            </AgentFormField>
            <AgentFormField
              name="execution_mode"
              label={t("agents.identity.executionModeLabel")}
              defaultValue="autonomous"
            >
              {({ value, onChange, id }) => (
                <Select
                  items={executionModeOptions}
                  value={typeof value === "string" ? value : "autonomous"}
                  onValueChange={onChange}
                >
                  <SelectTrigger id={id}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {executionModeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </AgentFormField>
            <AgentFormField
              name="identity_service_principal_id"
              label={t("agents.identity.enterpriseAppObjectIdLabel")}
              rules={{
                required: mode !== "delegated" ? t("agents.identity.servicePrincipalRequired") : false,
                pattern: { value: IDENTITY_UUID_PATTERN, message: t("agents.identity.servicePrincipalInvalid") },
              }}
              description={
                <>
                  {t("agents.identity.servicePrincipalHintBefore")}{" "}
                  <a
                    className="underline"
                    href="https://entra.microsoft.com/#view/Microsoft_AAD_IAM/StartboardApplicationsMenuBlade/~/AppAppsPreview"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t("agents.identity.entraEnterpriseApps")}
                  </a>
                  {t("agents.identity.servicePrincipalHintAfter")}
                </>
              }
            >
              {({ value, onChange, ref, ...control }) => (
                <Input {...control} ref={ref} value={typeof value === "string" ? value : ""} onChange={onChange} />
              )}
            </AgentFormField>

            <AgentFormField
              name="identity_required_roles"
              label={t("agents.identity.requiredRolesLabel")}
              description={t("agents.identity.requiredRolesDescription")}
            >
              {({ value, onChange, ref, ...control }) => (
                <Input
                  {...control}
                  ref={ref}
                  value={typeof value === "string" ? value : ""}
                  onChange={onChange}
                  placeholder="Agent.Invoke"
                />
              )}
            </AgentFormField>

            {showScopes && (
              <>
                <AgentFormField
                  name="identity_required_scopes"
                  label={t("agents.identity.requiredScopesLabel")}
                  defaultValue="user_impersonation"
                  rules={{ required: t("agents.identity.requiredScopesRequired") }}
                >
                  {({ value, onChange, ref, ...control }) => (
                    <Input
                      {...control}
                      ref={ref}
                      value={typeof value === "string" ? value : "user_impersonation"}
                      onChange={onChange}
                    />
                  )}
                </AgentFormField>
                <p className="text-sm text-muted-foreground">{t("agents.identity.delegatedScopesHint")}</p>
              </>
            )}
            <AgentFormField name="enabled" label={t("agents.identity.executionLabel")} defaultValue={true}>
              {({ value, onChange, id }) => (
                <Select
                  items={executionOptions}
                  value={value === false ? "disabled" : "enabled"}
                  onValueChange={(next) => onChange(next === "enabled")}
                >
                  <SelectTrigger id={id}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {executionOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </AgentFormField>
            <p className="text-sm text-muted-foreground">{t("agents.identity.verificationHint")}</p>
          </>
        )}
      </section>
    </>
  );
};
