/**
 * Endpoint configuration for CompareUI.
 * Add new endpoints here to extend the comparison functionality.
 */

import { Agent } from "../../llm_calls/fetch_agents";

// Endpoint identifiers
export const EndpointId = {
  CHAT_COMPLETIONS: "/v1/chat/completions",
  A2A_AGENTS: "/a2a",
  // Future endpoints:
  // RESPONSES: "/v1/responses",
  // ANTHROPIC: "/v1/messages",
} as const;

export type EndpointIdType = (typeof EndpointId)[keyof typeof EndpointId];

// Selector type determines what the user picks (model, agent, etc.)
export type SelectorType = "model" | "agent";

export interface EndpointConfig {
  id: EndpointIdType;
  label: string;
  selectorType: SelectorType;
  selectorLabel: string;
  selectorPlaceholder: string;
  inputPlaceholder: string;
  loadingMessage: string;
  validationMessage: string;
}

export type Translate = (key: string, params?: Record<string, string | number>) => string;

// Endpoint configurations
export const ENDPOINT_CONFIGS: Record<EndpointIdType, EndpointConfig> = {
  [EndpointId.CHAT_COMPLETIONS]: {
    id: EndpointId.CHAT_COMPLETIONS,
    label: "/v1/chat/completions",
    selectorType: "model",
    selectorLabel: "Model",
    selectorPlaceholder: "Select a model",
    inputPlaceholder: "Send a prompt to compare models",
    loadingMessage: "Gathering responses from all models...",
    validationMessage: "Select a model before sending a message.",
  },
  [EndpointId.A2A_AGENTS]: {
    id: EndpointId.A2A_AGENTS,
    label: "/a2a (Agents)",
    selectorType: "agent",
    selectorLabel: "Agent",
    selectorPlaceholder: "Select an agent",
    inputPlaceholder: "Send a message to compare agents",
    loadingMessage: "Gathering responses from all agents...",
    validationMessage: "Select an agent before sending a message.",
  },
};

// Get list of available endpoints for the dropdown
export const getAvailableEndpoints = () =>
  Object.values(ENDPOINT_CONFIGS).map((config) => ({
    value: config.id,
    label: config.label,
  }));

interface EndpointI18nKeys {
  readonly selectorLabel: string;
  readonly selectorPlaceholder: string;
  readonly inputPlaceholder: string;
  readonly loadingMessage: string;
  readonly validationMessage: string;
  readonly loading: string;
  readonly empty: string;
}

const ENDPOINT_I18N_KEYS = {
  [EndpointId.CHAT_COMPLETIONS]: {
    selectorLabel: "playground.endpoint.chat.selectorLabel",
    selectorPlaceholder: "playground.endpoint.chat.selectorPlaceholder",
    inputPlaceholder: "playground.endpoint.chat.inputPlaceholder",
    loadingMessage: "playground.endpoint.chat.loadingMessage",
    validationMessage: "playground.endpoint.chat.validationMessage",
    loading: "playground.endpoint.chat.loading",
    empty: "playground.endpoint.chat.empty",
  },
  [EndpointId.A2A_AGENTS]: {
    selectorLabel: "playground.endpoint.a2a.selectorLabel",
    selectorPlaceholder: "playground.endpoint.a2a.selectorPlaceholder",
    inputPlaceholder: "playground.endpoint.a2a.inputPlaceholder",
    loadingMessage: "playground.endpoint.a2a.loadingMessage",
    validationMessage: "playground.endpoint.a2a.validationMessage",
    loading: "playground.endpoint.a2a.loading",
    empty: "playground.endpoint.a2a.empty",
  },
} as const satisfies Record<EndpointIdType, EndpointI18nKeys>;

const A2A_LABEL_I18N_KEY = "playground.endpoint.a2aLabel";

export const endpointI18nKeys = (endpointId: EndpointIdType): EndpointI18nKeys => ENDPOINT_I18N_KEYS[endpointId];

// Helper to get config for an endpoint
export const getEndpointConfig = (endpointId: EndpointIdType): EndpointConfig => ENDPOINT_CONFIGS[endpointId];

export const getLocalizedEndpointConfig = (endpointId: EndpointIdType, t: Translate): EndpointConfig => {
  const config = ENDPOINT_CONFIGS[endpointId];
  const keys = ENDPOINT_I18N_KEYS[endpointId];
  return {
    ...config,
    label: endpointId === EndpointId.A2A_AGENTS ? t(A2A_LABEL_I18N_KEY) : config.label,
    selectorLabel: t(keys.selectorLabel),
    selectorPlaceholder: t(keys.selectorPlaceholder),
    inputPlaceholder: t(keys.inputPlaceholder),
    loadingMessage: t(keys.loadingMessage),
    validationMessage: t(keys.validationMessage),
  };
};

export const getLocalizedAvailableEndpoints = (t: Translate) =>
  Object.values(ENDPOINT_CONFIGS).map((config) => ({
    value: config.id,
    label: getLocalizedEndpointConfig(config.id, t).label,
  }));

// Helper to check if endpoint uses agents
export const isAgentEndpoint = (endpointId: EndpointIdType): boolean =>
  ENDPOINT_CONFIGS[endpointId].selectorType === "agent";

// Helper to check if endpoint uses models
export const isModelEndpoint = (endpointId: EndpointIdType): boolean =>
  ENDPOINT_CONFIGS[endpointId].selectorType === "model";

// Selector options type - unified interface for both models and agents
export interface SelectorOption {
  value: string;
  label: string;
}

// Convert model options to unified format
export const modelOptionsToSelectorOptions = (models: string[]): SelectorOption[] =>
  models.map((model) => ({ value: model, label: model }));

// Convert agent options to unified format
export const agentOptionsToSelectorOptions = (agents: Agent[]): SelectorOption[] =>
  agents.map((agent) => ({
    value: agent.agent_name,
    label: agent.agent_name || agent.agent_id,
  }));

// Get the selected value field name based on endpoint
export const getSelectionFieldName = (endpointId: EndpointIdType): "model" | "agent" =>
  isAgentEndpoint(endpointId) ? "agent" : "model";

// Get the current selection from a comparison based on endpoint
export const getComparisonSelection = (
  comparison: { model: string; agent: string },
  endpointId: EndpointIdType,
): string => (isAgentEndpoint(endpointId) ? comparison.agent : comparison.model);

// Check if comparison has a valid selection for the endpoint
export const hasValidSelection = (
  comparison: { model: string; agent: string },
  endpointId: EndpointIdType,
): boolean => {
  const selection = getComparisonSelection(comparison, endpointId);
  return Boolean(selection && selection.trim());
};

/**
 * To add a new endpoint:
 *
 * 1. Add the endpoint ID to EndpointId const
 * 2. Add configuration to ENDPOINT_CONFIGS
 * 3. Add the endpoint's translation keys to ENDPOINT_I18N_KEYS
 * 4. If the endpoint uses a new selector type (not model or agent):
 *    - Add the type to SelectorType
 *    - Add fetch logic in CompareUI.tsx
 *    - Add conversion function (e.g., xxxOptionsToSelectorOptions)
 * 5. Add request handling in CompareUI.tsx handleSendMessage
 *
 * Example for adding /v1/responses endpoint:
 *
 * EndpointId.RESPONSES = "/v1/responses"
 *
 * ENDPOINT_CONFIGS[EndpointId.RESPONSES] = {
 *   id: EndpointId.RESPONSES,
 *   label: "/v1/responses",
 *   selectorType: "model",
 *   selectorLabel: "Model",
 *   selectorPlaceholder: "Select a model",
 *   inputPlaceholder: "Send a prompt to compare responses",
 *   loadingMessage: "Gathering responses...",
 *   validationMessage: "Select a model before sending.",
 * }
 */
