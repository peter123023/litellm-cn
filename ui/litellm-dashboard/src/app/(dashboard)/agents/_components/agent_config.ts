import { parseIdentityForForm } from "./agent_identity";
/**
 * Shared configuration for agent form fields
 * Used across create, view, and update operations
 */

import {
  EMPTY_KILL_SWITCH_FORM,
  buildKillSwitchFromForm,
  parseKillSwitchForForm,
  type KillSwitchConfig,
  type KillSwitchFormValue,
} from "./kill_switch_config";

export interface FieldConfig {
  name: string;
  labelKey: string;
  type: "text" | "textarea" | "url" | "switch" | "list" | "select";
  required?: boolean;
  tooltipKey?: string;
  placeholderKey?: string;
  defaultValue?: any;
  rows?: number;
  validation?: any[];
  options?: string[];
  helpTextKey?: string;
}

export interface SectionConfig {
  key: string;
  titleKey: string;
  fields: FieldConfig[];
  defaultExpanded?: boolean;
}

export const AGENT_FORM_CONFIG: {
  basic: SectionConfig;
  skills: SectionConfig;
  capabilities: SectionConfig;
  optional: SectionConfig;
  litellm: SectionConfig;
  cost: SectionConfig;
  tracing: SectionConfig;
} = {
  basic: {
    key: "basic",
    titleKey: "agents.form.sections.basic",
    defaultExpanded: true,
    fields: [
      {
        name: "name",
        labelKey: "agents.form.basic.displayName",
        type: "text",
        required: true,
        placeholderKey: "agents.form.basic.displayNamePlaceholder",
      },
      {
        name: "description",
        labelKey: "common.description",
        type: "textarea",
        required: false,
        placeholderKey: "agents.form.basic.descriptionPlaceholder",
        rows: 3,
      },
      {
        name: "url",
        labelKey: "agents.form.basic.url",
        type: "url",
        required: false,
        placeholderKey: "agents.form.basic.urlPlaceholder",
        tooltipKey: "agents.form.basic.urlTooltip",
      },
      {
        name: "version",
        labelKey: "agents.form.basic.version",
        type: "text",
        placeholderKey: "agents.form.basic.versionPlaceholder",
        defaultValue: "1.0.0",
      },
      {
        name: "protocolVersion",
        labelKey: "agents.form.basic.protocolVersion",
        type: "select",
        options: ["1.0", "0.3"],
        defaultValue: "1.0",
        tooltipKey: "agents.form.basic.protocolVersionTooltip",
        helpTextKey: "agents.form.basic.protocolVersionHelp",
      },
    ],
  },
  skills: {
    key: "skills",
    titleKey: "agents.form.sections.skills",
    fields: [
      {
        name: "skills",
        labelKey: "agents.form.section.skills",
        type: "list",
        defaultValue: [],
      },
    ],
  },
  capabilities: {
    key: "capabilities",
    titleKey: "agents.form.sections.capabilities",
    fields: [
      {
        name: "streaming",
        labelKey: "agents.form.basic.streaming",
        type: "switch",
        defaultValue: false,
      },
      {
        name: "pushNotifications",
        labelKey: "agents.form.basic.pushNotifications",
        type: "switch",
      },
      {
        name: "stateTransitionHistory",
        labelKey: "agents.form.basic.stateTransitionHistory",
        type: "switch",
      },
    ],
  },
  optional: {
    key: "optional",
    titleKey: "agents.form.sections.optional",
    fields: [
      {
        name: "iconUrl",
        labelKey: "agents.form.optional.iconUrl",
        type: "url",
        placeholderKey: "agents.form.optional.iconUrlPlaceholder",
      },
      {
        name: "documentationUrl",
        labelKey: "agents.form.optional.documentationUrl",
        type: "url",
        placeholderKey: "agents.form.optional.documentationUrlPlaceholder",
      },
      {
        name: "supportsAuthenticatedExtendedCard",
        labelKey: "agents.form.optional.supportsAuthenticatedExtendedCard",
        type: "switch",
      },
    ],
  },
  litellm: {
    key: "litellm",
    titleKey: "agents.form.sections.litellm",
    fields: [
      {
        name: "model",
        labelKey: "agents.form.litellm.model",
        type: "text",
      },
      {
        name: "make_public",
        labelKey: "agents.form.litellm.makePublic",
        type: "switch",
      },
    ],
  },
  cost: {
    key: "cost",
    titleKey: "agents.form.sections.cost",
    fields: [
      {
        name: "cost_per_query",
        labelKey: "agents.form.cost.costPerQuery",
        type: "text",
        placeholderKey: "agents.form.cost.costPerQueryPlaceholder",
        tooltipKey: "agents.form.cost.costPerQueryTooltip",
      },
      {
        name: "input_cost_per_token",
        labelKey: "agents.form.cost.inputCostPerToken",
        type: "text",
        placeholderKey: "agents.form.cost.inputCostPerTokenPlaceholder",
        tooltipKey: "agents.form.cost.inputCostPerTokenTooltip",
      },
      {
        name: "output_cost_per_token",
        labelKey: "agents.form.cost.outputCostPerToken",
        type: "text",
        placeholderKey: "agents.form.cost.outputCostPerTokenPlaceholder",
        tooltipKey: "agents.form.cost.outputCostPerTokenTooltip",
      },
    ],
  },
  tracing: {
    key: "tracing",
    titleKey: "agents.form.sections.tracing",
    fields: [
      {
        name: "enable_tracing",
        labelKey: "agents.form.tracing.enable",
        type: "switch",
        defaultValue: false,
        tooltipKey: "agents.form.tracing.enableTooltip",
      },
    ],
  },
};

export const SKILL_FIELD_CONFIG = {
  id: {
    name: "id",
    labelKey: "agents.form.skill.id",
    required: true,
    placeholderKey: "agents.form.skill.idPlaceholder",
  },
  name: {
    name: "name",
    labelKey: "agents.form.skill.name",
    required: true,
    placeholderKey: "agents.form.skill.namePlaceholder",
  },
  description: {
    name: "description",
    labelKey: "common.description",
    required: true,
    placeholderKey: "agents.form.skill.descriptionPlaceholder",
    rows: 2,
  },
  tags: {
    name: "tags",
    labelKey: "agents.form.skill.tags",
    required: true,
    placeholderKey: "agents.form.skill.tagsPlaceholder",
  },
  examples: {
    name: "examples",
    labelKey: "agents.form.skill.examples",
    placeholderKey: "agents.form.skill.examplesPlaceholder",
  },
};

/**
 * Get default form values from configuration
 */
export const getDefaultFormValues = () => {
  const defaults: any = {
    defaultInputModes: ["text"],
    defaultOutputModes: ["text"],
    kill_switch: { ...EMPTY_KILL_SWITCH_FORM },
  };

  Object.values(AGENT_FORM_CONFIG).forEach((section) => {
    section.fields.forEach((field) => {
      if (field.defaultValue !== undefined) {
        defaults[field.name] = field.defaultValue;
      }
    });
  });

  return defaults;
};

/**
 * Build agent data from form values according to AgentConfig spec
 */
export const buildAgentDataFromForm = (values: any, existingAgent?: any) => {
  const agentData: any = {
    agent_name: values.agent_name,
    agent_card_params: {
      protocolVersion: values.protocolVersion || "1.0",
      name: values.name || values.agent_name,
      description: values.description || "",
      url: values.url || "",
      version: values.version || "1.0.0",
      defaultInputModes: existingAgent?.agent_card_params?.defaultInputModes || ["text"],
      defaultOutputModes: existingAgent?.agent_card_params?.defaultOutputModes || ["text"],
      capabilities: {
        streaming: values.streaming === true,
        ...(values.pushNotifications !== undefined && { pushNotifications: values.pushNotifications }),
        ...(values.stateTransitionHistory !== undefined && { stateTransitionHistory: values.stateTransitionHistory }),
      },
      skills: values.skills || [],
      ...(values.iconUrl && { iconUrl: values.iconUrl }),
      ...(values.documentationUrl && { documentationUrl: values.documentationUrl }),
      ...(values.supportsAuthenticatedExtendedCard !== undefined && {
        supportsAuthenticatedExtendedCard: values.supportsAuthenticatedExtendedCard,
      }),
    },
  };

  const params: Record<string, any> = {};

  if (values.model) params.model = values.model;
  if (values.make_public !== undefined) params.make_public = values.make_public;
  if (values.cost_per_query) params.cost_per_query = parseFloat(values.cost_per_query);
  if (values.input_cost_per_token) params.input_cost_per_token = parseFloat(values.input_cost_per_token);
  if (values.output_cost_per_token) params.output_cost_per_token = parseFloat(values.output_cost_per_token);

  if (Object.keys(params).length > 0) {
    agentData.litellm_params = params;
  }

  if (values.tpm_limit != null) agentData.tpm_limit = values.tpm_limit;
  if (values.rpm_limit != null) agentData.rpm_limit = values.rpm_limit;
  if (values.session_tpm_limit != null) agentData.session_tpm_limit = values.session_tpm_limit;
  if (values.session_rpm_limit != null) agentData.session_rpm_limit = values.session_rpm_limit;
  // static_headers: convert [{header, value}, ...] → {header: value, ...}
  if (Array.isArray(values.static_headers) && values.static_headers.length > 0) {
    const staticHeaders: Record<string, string> = {};
    values.static_headers.forEach((entry: { header?: string; value?: string }) => {
      const key = entry?.header?.trim();
      if (key) staticHeaders[key] = entry?.value ?? "";
    });
    if (Object.keys(staticHeaders).length > 0) {
      agentData.static_headers = staticHeaders;
    }
  }

  // extra_headers: already an array of strings from Select tags
  if (Array.isArray(values.extra_headers) && values.extra_headers.length > 0) {
    agentData.extra_headers = values.extra_headers;
  }

  applyKillSwitchToPayload(agentData, values.kill_switch, existingAgent);

  return agentData;
};

export const applyKillSwitchToPayload = (
  agentData: { kill_switch?: KillSwitchConfig | null },
  form: KillSwitchFormValue | undefined,
  existingAgent?: { kill_switch?: KillSwitchConfig | null },
) => {
  const killSwitch = buildKillSwitchFromForm(form);
  if (killSwitch !== undefined && (killSwitch !== null || existingAgent?.kill_switch)) {
    agentData.kill_switch = killSwitch;
  }
};

export const parseAccessGroupIdsForForm = (agent: { access_group_ids?: string[] | null }) => ({
  access_group_ids: agent.access_group_ids ?? [],
});

export const parseMcpPermissionsForForm = (agent: any) => ({
  ...parseIdentityForForm(agent),
  allowed_mcp_servers_and_groups: {
    servers: agent.object_permission?.mcp_servers ?? [],
    accessGroups: agent.object_permission?.mcp_access_groups ?? [],
    toolsets: agent.object_permission?.mcp_toolsets ?? [],
  },
  mcp_tool_permissions: agent.object_permission?.mcp_tool_permissions ?? {},
});

/**
 * Always includes every MCP key (empty when cleared) so removals persist;
 * the proxy merges object_permission per key, leaving non-MCP grants untouched.
 */
export const buildMcpObjectPermission = (values: any) => ({
  mcp_servers: values.allowed_mcp_servers_and_groups?.servers ?? [],
  mcp_access_groups: values.allowed_mcp_servers_and_groups?.accessGroups ?? [],
  mcp_toolsets: values.allowed_mcp_servers_and_groups?.toolsets ?? [],
  mcp_tool_permissions: values.mcp_tool_permissions ?? {},
});

/**
 * Parse agent data for form fields
 */
export const parseAgentForForm = (agent: any) => {
  const card = agent.agent_card_params ?? {};
  const skills =
    card.skills?.map((skill: any) => ({
      ...skill,
      tags: skill.tags,
      examples: skill.examples || [],
    })) || [];

  return {
    agent_name: agent.agent_name,
    name: card.name || agent.agent_name,
    description: card.description,
    url: card.url,
    version: card.version,
    protocolVersion: card.protocolVersion,
    streaming: card.capabilities?.streaming,
    pushNotifications: card.capabilities?.pushNotifications,
    stateTransitionHistory: card.capabilities?.stateTransitionHistory,
    skills: skills,
    iconUrl: card.iconUrl,
    documentationUrl: card.documentationUrl,
    supportsAuthenticatedExtendedCard: card.supportsAuthenticatedExtendedCard,
    model: agent.litellm_params?.model,
    make_public: agent.litellm_params?.make_public,
    cost_per_query: agent.litellm_params?.cost_per_query,
    input_cost_per_token: agent.litellm_params?.input_cost_per_token,
    output_cost_per_token: agent.litellm_params?.output_cost_per_token,
    tpm_limit: agent.tpm_limit,
    rpm_limit: agent.rpm_limit,
    session_tpm_limit: agent.session_tpm_limit,
    session_rpm_limit: agent.session_rpm_limit,
    // static_headers: {key: value} → [{header, value}, ...]
    static_headers: agent.static_headers
      ? Object.entries(agent.static_headers as Record<string, string>).map(([header, value]) => ({
          header,
          value,
        }))
      : [],
    // extra_headers: already an array of strings
    extra_headers: agent.extra_headers ?? [],
    kill_switch: parseKillSwitchForForm(agent.kill_switch),
    ...parseMcpPermissionsForForm(agent),
    ...parseAccessGroupIdsForForm(agent),
  };
};
