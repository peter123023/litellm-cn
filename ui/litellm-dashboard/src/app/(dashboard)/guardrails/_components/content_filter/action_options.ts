export const ACTION_ITEMS = [
  { value: "BLOCK", labelKey: "contentFilter.actionBlock" },
  { value: "MASK", labelKey: "contentFilter.actionMask" },
] as const;

export const SEVERITY_ITEMS = [
  { value: "high", labelKey: "contentFilter.severityHigh" },
  { value: "medium", labelKey: "contentFilter.severityMedium" },
  { value: "low", labelKey: "contentFilter.severityLow" },
] as const;
