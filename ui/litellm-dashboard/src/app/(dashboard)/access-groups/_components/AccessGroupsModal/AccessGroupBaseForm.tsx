"use client";

import { BotIcon, InfoIcon, LayersIcon, ServerIcon } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { useAgents } from "@/app/(dashboard)/hooks/agents/useAgents";
import { useMCPServers } from "@/app/(dashboard)/hooks/mcpServers/useMCPServers";
import { ModelSelect } from "@/components/ModelSelect/ModelSelect";
import { FieldGroup } from "@/components/ui/field";
import { FormField } from "@/components/shared/form/FormField";
import { MultiSelect } from "@/components/shared/MultiSelect";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/i18n";

export const accessGroupFormSchema = z.object({
  name: z.string().min(1, "Please enter the access group name"),
  description: z.string(),
  modelIds: z.array(z.string()),
  mcpServerIds: z.array(z.string()),
  agentIds: z.array(z.string()),
});

export type AccessGroupFormValues = z.output<typeof accessGroupFormSchema>;

export const GENERAL_TAB = "general";
export const MODELS_TAB = "models";
export const MCP_SERVERS_TAB = "mcp-servers";
export const AGENTS_TAB = "agents";

interface AccessGroupBaseFormProps {
  form: UseFormReturn<AccessGroupFormValues>;
  isNameDisabled?: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function AccessGroupBaseForm({
  form,
  isNameDisabled = false,
  activeTab,
  onTabChange,
}: AccessGroupBaseFormProps) {
  const { data: agentsData } = useAgents();
  const { data: mcpServersData } = useMCPServers();
  const { t } = useTranslation();

  const mcpServerOptions = (mcpServersData ?? []).map((server) => ({
    value: server.server_id,
    label: server.server_name ?? server.server_id,
  }));
  const agentOptions = (agentsData?.agents ?? []).map((agent) => ({
    value: agent.agent_id,
    label: agent.agent_name,
  }));

  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList className="w-full">
        <TabsTrigger value={GENERAL_TAB}>
          <InfoIcon size={16} />
          {t("accessGroups.generalInfo")}
        </TabsTrigger>
        <TabsTrigger value={MODELS_TAB}>
          <LayersIcon size={16} />
          {t("accessGroups.models")}
        </TabsTrigger>
        <TabsTrigger value={MCP_SERVERS_TAB}>
          <ServerIcon size={16} />
          {t("accessGroups.mcpServers")}
        </TabsTrigger>
        <TabsTrigger value={AGENTS_TAB}>
          <BotIcon size={16} />
          {t("accessGroups.agents")}
        </TabsTrigger>
      </TabsList>

      <TabsContent value={GENERAL_TAB} className="pt-4">
        <FieldGroup>
          <FormField control={form.control} name="name" label={t("accessGroups.groupName")}>
            {({ ref, ...field }) => (
              <Input
                {...field}
                ref={ref}
                placeholder={t("accessGroups.groupNamePlaceholder")}
                disabled={isNameDisabled}
              />
            )}
          </FormField>
          <FormField control={form.control} name="description" label={t("common.description")}>
            {({ ref, ...field }) => (
              <Textarea {...field} ref={ref} rows={4} placeholder={t("accessGroups.descriptionPlaceholder")} />
            )}
          </FormField>
        </FieldGroup>
      </TabsContent>

      <TabsContent value={MODELS_TAB} className="pt-4">
        <FormField control={form.control} name="modelIds" label={t("accessGroups.allowedModels")}>
          {(field) => <ModelSelect context="global" value={field.value} onChange={field.onChange} />}
        </FormField>
      </TabsContent>

      <TabsContent value={MCP_SERVERS_TAB} className="pt-4">
        <FormField control={form.control} name="mcpServerIds" label={t("accessGroups.allowedMcpServers")}>
          {({ id, value, onChange }) => (
            <MultiSelect
              id={id}
              value={value}
              onValueChange={onChange}
              options={mcpServerOptions}
              placeholder={t("accessGroups.selectMcpServers")}
            />
          )}
        </FormField>
      </TabsContent>

      <TabsContent value={AGENTS_TAB} className="pt-4">
        <FormField control={form.control} name="agentIds" label={t("accessGroups.allowedAgents")}>
          {({ id, value, onChange }) => (
            <MultiSelect
              id={id}
              value={value}
              onValueChange={onChange}
              options={agentOptions}
              placeholder={t("accessGroups.selectAgents")}
            />
          )}
        </FormField>
      </TabsContent>
    </Tabs>
  );
}
