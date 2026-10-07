// i18n keys owned by the "tool-policies" domain translation batch (parallel i18n effort).
// Only that batch's agent edits this file. Spread into dictionaries via locales/en.ts and zh.ts.
// (toolPolicies.title / toolPolicies.adminOnly live in extra/guardrails.ts, owned by the guardrails batch.)

export const en: Record<string, string> = {
  "toolPolicies.metricNewToday": "New Today",
  "toolPolicies.metricTotalTools": "Total Tools Discovered",
  "toolPolicies.metricBlockedTools": "Blocked Tools",
  "toolPolicies.metricActiveTeams": "Active Teams",
  "toolPolicies.trendSinceYesterday": "{diff} since yesterday",

  "toolPolicies.needsReviewTitle": "Needs Review",
  "toolPolicies.needsReviewDescription": "{count} new tool{plural} discovered that require policy decisions.",
  "toolPolicies.review": "Review",

  "toolPolicies.loadError": "Failed to load tools",
  "toolPolicies.unknownError": "unknown error",
  "toolPolicies.updateInputFailed": "Failed to update input policy: {message}",
  "toolPolicies.updateOutputFailed": "Failed to update output policy: {message}",

  "toolPolicies.colDiscovered": "Discovered",
  "toolPolicies.colToolName": "Tool Name",
  "toolPolicies.colInputPolicy": "Input Policy",
  "toolPolicies.colOutputPolicy": "Output Policy",
  "toolPolicies.colCalls": "# Calls",
  "toolPolicies.colTeamName": "Team Name",
  "toolPolicies.colKeyHash": "Key Hash",
  "toolPolicies.colKeyName": "Key Name",
  "toolPolicies.colUser": "User",
  "toolPolicies.colUserTooltip":
    "The user who owns the key that discovered this tool. Displays the first available value: User Alias, User Email, or User ID.",
  "toolPolicies.colUserAgent": "User Agent",

  "toolPolicies.filterAllInputPolicies": "All Input Policies",
  "toolPolicies.filterAllOutputPolicies": "All Output Policies",
  "toolPolicies.filterAllTeams": "All Teams",
  "toolPolicies.filterAllKeys": "All Keys",

  "toolPolicies.emptyNoMatch": "No matching tools",
  "toolPolicies.emptyNoTools": "No tools discovered",
  "toolPolicies.emptyNoMatchDescription": "No tools match your search or filters.",
  "toolPolicies.emptyNoToolsDescription": "Make a chat completion that returns tool_calls to start auto-discovery.",
  "toolPolicies.loadingTools": "Loading tools…",

  "toolPolicies.searchPlaceholder": "Search by Tool Name",
  "toolPolicies.filtersTitle": "Filters",
  "toolPolicies.filtersDescription": "Narrow down discovered tools",
};

export const zh: Record<string, string> = {
  "toolPolicies.metricNewToday": "今日新增",
  "toolPolicies.metricTotalTools": "已发现工具总数",
  "toolPolicies.metricBlockedTools": "已拦截工具",
  "toolPolicies.metricActiveTeams": "活跃团队",
  "toolPolicies.trendSinceYesterday": "{diff} 较昨日",

  "toolPolicies.needsReviewTitle": "待审核",
  "toolPolicies.needsReviewDescription": "{count} 个新工具被发现，需要制定策略。",
  "toolPolicies.review": "审核",

  "toolPolicies.loadError": "加载工具失败",
  "toolPolicies.unknownError": "未知错误",
  "toolPolicies.updateInputFailed": "更新输入策略失败：{message}",
  "toolPolicies.updateOutputFailed": "更新输出策略失败：{message}",

  "toolPolicies.colDiscovered": "发现时间",
  "toolPolicies.colToolName": "工具名称",
  "toolPolicies.colInputPolicy": "输入策略",
  "toolPolicies.colOutputPolicy": "输出策略",
  "toolPolicies.colCalls": "调用次数",
  "toolPolicies.colTeamName": "团队名称",
  "toolPolicies.colKeyHash": "密钥哈希",
  "toolPolicies.colKeyName": "密钥名称",
  "toolPolicies.colUser": "用户",
  "toolPolicies.colUserTooltip": "拥有发现该工具的密钥的用户。依次显示首个可用值：用户别名、用户邮箱或用户 ID。",
  "toolPolicies.colUserAgent": "User Agent",

  "toolPolicies.filterAllInputPolicies": "全部输入策略",
  "toolPolicies.filterAllOutputPolicies": "全部输出策略",
  "toolPolicies.filterAllTeams": "全部团队",
  "toolPolicies.filterAllKeys": "全部密钥",

  "toolPolicies.emptyNoMatch": "没有匹配的工具",
  "toolPolicies.emptyNoTools": "尚未发现工具",
  "toolPolicies.emptyNoMatchDescription": "没有符合搜索或筛选条件的工具。",
  "toolPolicies.emptyNoToolsDescription": "发起一次返回 tool_calls 的对话补全即可开始自动发现。",
  "toolPolicies.loadingTools": "正在加载工具…",

  "toolPolicies.searchPlaceholder": "按工具名称搜索",
  "toolPolicies.filtersTitle": "筛选",
  "toolPolicies.filtersDescription": "缩小已发现工具的范围",
};
