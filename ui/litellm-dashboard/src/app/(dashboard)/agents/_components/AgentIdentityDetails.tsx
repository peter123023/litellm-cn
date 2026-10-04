import React from "react";
import type { components } from "@/lib/http/schema";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/components/networking";
import { Button } from "@/components/ui/button";
import { useTranslation, type Translate } from "@/i18n";
import { readAgentIdentity } from "./agent_identity";

const authenticationMessage = (t: Translate, error: boolean, lastAuthenticated?: string | null): string => {
  if (error) return t("agents.identity.evidenceLoadFailed");
  if (lastAuthenticated)
    return t("agents.identity.lastAuthenticatedMatch", { date: new Date(lastAuthenticated).toLocaleString() });
  return t("agents.identity.awaitingRequest");
};

export const AgentIdentityDetails = ({
  agentId,
  identity: value,
  accessToken,
  isAdmin,
}: {
  agentId: string;
  identity: unknown;
  accessToken: string | null;
  isAdmin: boolean;
}) => {
  const { t } = useTranslation();
  const identity = readAgentIdentity(value);
  const { data, isError, isFetching, refetch } = useQuery({
    queryKey: ["agent-identity", agentId, identity],
    queryFn: () =>
      apiClient.get<components["schemas"]["ManagedAgentIdentityStatus"]>(
        `/v1/agents/${encodeURIComponent(agentId)}/identity`,
        {
          accessToken: accessToken ?? "",
        },
      ),
    enabled: Boolean(isAdmin && accessToken && identity),
  });

  if (!identity || !isAdmin) return null;
  const executionLabel = data?.enabled ? t("common.enabled") : t("common.disabled");
  return (
    <section
      aria-label={t("agents.identity.sectionLabel")}
      className="mb-6 space-y-2 rounded-lg border border-border p-4"
    >
      <h3 className="font-medium">{t("agents.identity.title")}</h3>
      <p className="text-sm">
        {t("agents.identity.tenant")} <span className="font-mono">{identity.tenant_id}</span>
      </p>
      <>
        <p className="text-sm">
          {t("agents.identity.clientId")} <span className="font-mono">{identity.client_id}</span>
        </p>
        <p className="text-sm">
          {t("agents.identity.enterpriseAppObjectId")}{" "}
          {identity.service_principal_id || t("agents.identity.notConfigured")}
        </p>
      </>
      <p className="text-sm">
        {t("agents.identity.execution")} {data ? executionLabel : t("agents.identity.loading")} ·{" "}
        {t("agents.identity.mode")} {data?.execution_mode ?? t("agents.identity.loading")}
      </p>
      <p className="text-sm">
        {data?.identity?.active === false
          ? t("agents.identity.unbound")
          : authenticationMessage(t, isError, data?.last_authenticated_at)}
      </p>
      <p className="text-xs text-muted-foreground">{t("agents.identity.evidenceHint")}</p>
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          disabled={isFetching}
          onClick={() => {
            void refetch();
          }}
        >
          {t("agents.identity.refreshEvidence")}
        </Button>
        <a className="text-sm underline" href="/ui/logs/">
          {t("agents.identity.viewLogs")}
        </a>
      </div>
    </section>
  );
};
