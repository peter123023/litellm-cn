import type { Translate } from "@/i18n";

export const ERROR_CODE_LABEL_KEYS: Record<string, string> = {
  "400": "logs.errorCode.400",
  "401": "logs.errorCode.401",
  "403": "logs.errorCode.403",
  "404": "logs.errorCode.404",
  "408": "logs.errorCode.408",
  "422": "logs.errorCode.422",
  "429": "logs.errorCode.429",
  "500": "logs.errorCode.500",
  "502": "logs.errorCode.502",
  "503": "logs.errorCode.503",
  "529": "logs.errorCode.529",
};

/** Call types that represent MCP tool invocations (shared across columns, index, drawer). */
export const MCP_CALL_TYPES = ["call_mcp_tool", "list_mcp_tools"];

/** Call types that represent agent/A2A requests (e.g. asend_message). */
export const AGENT_CALL_TYPES = ["asend_message"];

/** Call types that represent Batch API operations (creation and retrieval, sync and async). */
export const BATCH_CALL_TYPES = ["acreate_batch", "create_batch", "aretrieve_batch", "retrieve_batch"];

export const SPAN_TYPE_LABEL_KEYS: Record<string, string> = {
  llm: "logs.spanType.llm",
  agent: "logs.spanType.agent",
  mcp: "logs.spanType.mcp",
  batch: "logs.spanType.batch",
};

export const CREDENTIAL_LABEL_KEYS: Record<string, string> = {
  true: "logs.credential.oauth",
  false: "logs.credential.configuredKey",
};

/** Falls back to the raw value so unknown span types / credentials still render. */
export const labelFromKeys = (t: Translate, keys: Record<string, string>, value: string): string =>
  keys[value] ? t(keys[value]) : value;

export const QUICK_SELECT_OPTIONS: { labelKey: string; value: number; unit: string }[] = [
  { labelKey: "logs.quickSelect.lastMinute", value: 1, unit: "minutes" },
  { labelKey: "logs.quickSelect.last15Minutes", value: 15, unit: "minutes" },
  { labelKey: "logs.quickSelect.lastHour", value: 1, unit: "hours" },
  { labelKey: "logs.quickSelect.last4Hours", value: 4, unit: "hours" },
  { labelKey: "logs.quickSelect.last24Hours", value: 24, unit: "hours" },
  { labelKey: "logs.quickSelect.last7Days", value: 7, unit: "days" },
];
