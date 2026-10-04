// i18n keys owned by the "sharedUi" domain translation batch (parallel i18n effort).
// Only that batch's agent edits this file. Spread into dictionaries via locales/en.ts and zh.ts.

export const en: Record<string, string> = {
  // -------------------------------------------------- AdminOnlyNotice.tsx
  "adminOnlyNotice.adminOnly": "{pageTitle} is only available to admin users.",

  // -------------------------------------------------- CreatedKeyDisplay.tsx
  "createdKeyDisplay.copiedToast": "Key copied to clipboard",
  "createdKeyDisplay.warningPrefix":
    "Please save this secret key somewhere safe and accessible. For security reasons, ",
  "createdKeyDisplay.warningBold": "you will not be able to view it again",
  "createdKeyDisplay.warningSuffix":
    " through your LiteLLM account. If you lose this secret key, you will need to generate a new one.",
  "createdKeyDisplay.virtualKeyLabel": "Virtual Key:",
  "createdKeyDisplay.copied": "Copied!",
  "createdKeyDisplay.copy": "Copy Virtual Key",

  // -------------------------------------------------- DemoNotice.tsx
  "demoNotice.viewingDemoData": "You’re viewing demo data",
  "demoNotice.exitDemo": "Exit demo",

  // -------------------------------------------------- DurationInput.tsx
  "durationInput.minutes": "minutes",
  "durationInput.hours": "hours",
  "durationInput.days": "days",
  "durationInput.unitAria": "{label} unit",

  // -------------------------------------------------- InheritedBudgetHint.tsx
  "inheritedBudgetHint.intro": "This key has no budget of its own, but its spend still counts toward:",
  "inheritedBudgetHint.scopeTeam": "Team",
  "inheritedBudgetHint.scopeOrganization": "Organization",
  "inheritedBudgetHint.scopeUser": "User",

  // -------------------------------------------------- advanced_date_picker.tsx
  "advancedDatePicker.selectTimeRange": "Select Time Range",
  "advancedDatePicker.selectDateRange": "Select date range",
  "advancedDatePicker.relativeTime": "Relative time",
  "advancedDatePicker.today": "Today",
  "advancedDatePicker.last7Days": "Last 7 days",
  "advancedDatePicker.last30Days": "Last 30 days",
  "advancedDatePicker.monthToDate": "Month to date",
  "advancedDatePicker.yearToDate": "Year to date",
  "advancedDatePicker.startAndEndDates": "Start and end dates",
  "advancedDatePicker.startDate": "Start date",
  "advancedDatePicker.endDate": "End date",
  "advancedDatePicker.invalidDateFormat": "Invalid date format",
  "advancedDatePicker.endBeforeStart": "End date cannot be before start date",
  "advancedDatePicker.from": "From:",
  "advancedDatePicker.to": "To:",

  // -------------------------------------------------- chart_loader.tsx
  "chartLoader.processingDate": "Processing date selection...",
  "chartLoader.justAMoment": "This will only take a moment",
  "chartLoader.loadingChart": "Loading chart data...",
  "chartLoader.fetchingData": "Fetching your data",

  // -------------------------------------------------- numerical_input.tsx
  "numericalInput.placeholder": "Enter a numerical value",

  // -------------------------------------------------- PageHeader.tsx
  "pageHeader.controls": "Page controls",

  // -------------------------------------------------- SearchSelect.tsx, PaginatedSearchSelect.tsx, PaginatedMultiSelect.tsx, MultiSelect.tsx
  "select.search": "Search…",
  "select.choose": "Select…",
  "select.loading": "Loading…",
  "select.noResults": "No results",
  "select.noOptions": "No options found",
  "select.placeholderOptions": "Select options",
  "select.createOption": 'Create "{value}"',

  // -------------------------------------------------- PasswordInput.tsx
  "passwordInput.show": "Show password",
  "passwordInput.hide": "Hide password",

  // -------------------------------------------------- SavingsTiles.tsx
  "savingsTiles.totalRecorded": "Total recorded savings",
  "savingsTiles.totalHint": "Compression + prompt caching + auto-router",
  "savingsTiles.totalInfo":
    "The sum of recorded savings in the three tiles beside it. Auto-router requests without an estimate are excluded. Its caching term is the LiteLLM-injected share; caching supplied by clients or providers appears only in the caching tile's Total figure.",
  "savingsTiles.compression": "Compression savings",
  "savingsTiles.tokensCompressed": "{count} tokens compressed",
  "savingsTiles.compressionInfo": "Tokens Headroom removed before the call, priced at the model's input rate.",
  "savingsTiles.promptCaching": "Prompt caching savings",
  "savingsTiles.litellmInjected": "LiteLLM injected",
  "savingsTiles.promptCachingInfo":
    "What caching saved against paying the input rate for every token: the discount on tokens served from cache, less the premium providers charge to write a cache entry. The headline figure is the share LiteLLM earned by inserting the breakpoints itself, through configured injection points or auto prompt caching. The total beside it also counts requests that arrived with their own cache_control and providers that cache implicitly. Either can be negative on traffic that writes more cache than it reuses, which is why the headline is not always the smaller of the two.",
  "savingsTiles.autoRouter": "Auto-router savings",
  "savingsTiles.autoRouterHint": "Recorded estimates subtotal",
  "savingsTiles.autoRouterInfo":
    "Sum of available per-request savings estimates against each router's highest-tier baseline, net of classifier cost. Requests without an estimate contribute nothing to this subtotal; this does not mean they saved zero. Historical records retain the estimator used when they were written. The Auto-router usage tab shows coverage for current estimates.",

  // -------------------------------------------------- ScopedSavingsTab.tsx
  "scopedSavingsTab.utcBucketed": "Spend is bucketed by UTC day",
  "scopedSavingsTab.unavailable": "Savings are unavailable for this range. Try another date range or reopen this tab.",
  "scopedSavingsTab.savings": "Savings",
  "scopedSavingsTab.runningTotalSaved": "Running total saved",
  "scopedSavingsTab.savedPerDay": "Saved per day",
  "scopedSavingsTab.perDay": "Per day",
  "scopedSavingsTab.cumulative": "Cumulative",
  "scopedSavingsTab.loadingSavings": "Loading savings...",
  "scopedSavingsTab.noUsage": "No usage recorded for this {entityType} in this range.",

  // -------------------------------------------------- SidePanel.tsx
  "sidePanel.resize": "Resize {noun} panel",
  "sidePanel.close": "Close (Esc)",
  "sidePanel.next": "Next {noun} (J)",
  "sidePanel.previous": "Previous {noun} (K)",
  "sidePanel.enterFullScreen": "Enter full screen",
  "sidePanel.exitFullScreen": "Exit full screen",
  "sidePanel.closeNoun": "Close {noun} (Esc)",

  // -------------------------------------------------- SummaryCard.tsx
  "summaryCard.howCalculated": "How {label} is calculated",

  // -------------------------------------------------- QueryParamInput.tsx
  "queryParams.paramName": "Parameter Name (e.g., version)",
  "queryParams.paramValue": "Parameter Value (e.g., v1)",
  "queryParams.removeParam": "Remove query parameter {index}",
  "queryParams.addParam": "Add Query Parameter",

  // -------------------------------------------------- onboarding_link.tsx
  "onboarding.invitationLinkTitle": "Invitation Link",
  "onboarding.resetPasswordLinkTitle": "Reset Password Link",
  "onboarding.invitationDescription": "Copy and send the generated link to onboard this user to the proxy.",
  "onboarding.resetPasswordDescription": "Copy and send the generated link to the user to reset their password.",
  "onboarding.userId": "User ID",
  "onboarding.invitationLink": "Invitation link",
  "onboarding.resetPasswordLink": "Reset password link",
  "onboarding.copyInvitationLink": "Copy invitation link",
  "onboarding.copyPasswordResetLink": "Copy password reset link",
};

export const zh: Record<string, string> = {
  // -------------------------------------------------- AdminOnlyNotice.tsx
  "adminOnlyNotice.adminOnly": "{pageTitle} 仅限管理员用户使用。",

  // -------------------------------------------------- CreatedKeyDisplay.tsx
  "createdKeyDisplay.copiedToast": "密钥已复制到剪贴板",
  "createdKeyDisplay.warningPrefix": "请把这个密钥妥善保存在安全且便于取用的地方。出于安全考虑，",
  "createdKeyDisplay.warningBold": "您将无法再次查看它",
  "createdKeyDisplay.warningSuffix": "。如果丢失了这个密钥，您需要重新生成一个。",
  "createdKeyDisplay.virtualKeyLabel": "虚拟密钥：",
  "createdKeyDisplay.copied": "已复制！",
  "createdKeyDisplay.copy": "复制虚拟密钥",

  // -------------------------------------------------- DemoNotice.tsx
  "demoNotice.viewingDemoData": "您正在查看演示数据",
  "demoNotice.exitDemo": "退出演示",

  // -------------------------------------------------- DurationInput.tsx
  "durationInput.minutes": "分钟",
  "durationInput.hours": "小时",
  "durationInput.days": "天",
  "durationInput.unitAria": "{label}单位",

  // -------------------------------------------------- InheritedBudgetHint.tsx
  "inheritedBudgetHint.intro": "该密钥自身没有预算，但它的花费仍会计入：",
  "inheritedBudgetHint.scopeTeam": "团队",
  "inheritedBudgetHint.scopeOrganization": "组织",
  "inheritedBudgetHint.scopeUser": "用户",

  // -------------------------------------------------- advanced_date_picker.tsx
  "advancedDatePicker.selectTimeRange": "选择时间范围",
  "advancedDatePicker.selectDateRange": "选择日期范围",
  "advancedDatePicker.relativeTime": "相对时间",
  "advancedDatePicker.today": "今天",
  "advancedDatePicker.last7Days": "最近 7 天",
  "advancedDatePicker.last30Days": "最近 30 天",
  "advancedDatePicker.monthToDate": "本月至今",
  "advancedDatePicker.yearToDate": "本年至今",
  "advancedDatePicker.startAndEndDates": "开始和结束日期",
  "advancedDatePicker.startDate": "开始日期",
  "advancedDatePicker.endDate": "结束日期",
  "advancedDatePicker.invalidDateFormat": "日期格式无效",
  "advancedDatePicker.endBeforeStart": "结束日期不能早于开始日期",
  "advancedDatePicker.from": "开始：",
  "advancedDatePicker.to": "结束：",

  // -------------------------------------------------- chart_loader.tsx
  "chartLoader.processingDate": "正在处理所选日期...",
  "chartLoader.justAMoment": "请稍候片刻",
  "chartLoader.loadingChart": "正在加载图表数据...",
  "chartLoader.fetchingData": "正在获取数据",

  // -------------------------------------------------- numerical_input.tsx
  "numericalInput.placeholder": "请输入数值",

  // -------------------------------------------------- PageHeader.tsx
  "pageHeader.controls": "页面操作",

  // -------------------------------------------------- SearchSelect.tsx, PaginatedSearchSelect.tsx, PaginatedMultiSelect.tsx, MultiSelect.tsx
  "select.search": "搜索…",
  "select.choose": "选择…",
  "select.loading": "加载中…",
  "select.noResults": "无结果",
  "select.noOptions": "未找到选项",
  "select.placeholderOptions": "选择选项",
  "select.createOption": "创建“{value}”",

  // -------------------------------------------------- PasswordInput.tsx
  "passwordInput.show": "显示密码",
  "passwordInput.hide": "隐藏密码",

  // -------------------------------------------------- SavingsTiles.tsx
  "savingsTiles.totalRecorded": "累计节省总额",
  "savingsTiles.totalHint": "压缩 + 提示词缓存 + 自动路由",
  "savingsTiles.totalInfo":
    "旁边三张卡片各自记录的节省金额之和。没有估算值的自动路由请求不计入。其中缓存项是 LiteLLM 自身注入带来的份额；由客户端或供应商提供的缓存只体现在缓存卡片的 Total 数值中。",
  "savingsTiles.compression": "压缩节省",
  "savingsTiles.tokensCompressed": "已压缩 {count} 个 token",
  "savingsTiles.compressionInfo": "在调用前移除的 Tokens Headroom，按该模型的输入价格计费。",
  "savingsTiles.promptCaching": "提示词缓存节省",
  "savingsTiles.litellmInjected": "LiteLLM 注入",
  "savingsTiles.promptCachingInfo":
    "缓存相对于每个 token 都按输入价付费所节省的部分：命中缓存的 token 获得的折扣，减去供应商写入缓存条目时收取的溢价。标题数字是 LiteLLM 通过配置的注入点或自动提示词缓存自行插入断点所赚取的份额。旁边的 Total 还包含自带 cache_control 的请求以及隐式缓存的供应商。在写入多于复用的流量上，两者都可能为负，所以标题数字并不总是二者中较小的那个。",
  "savingsTiles.autoRouter": "自动路由节省",
  "savingsTiles.autoRouterHint": "已记录估算值的小计",
  "savingsTiles.autoRouterInfo":
    "按各路由最高档位基线计算出的、当前可用的逐请求节省估算之和，已扣除分类器成本。没有估算值的请求对这个小计没有任何贡献，但这并不表示它们节省为零。历史记录保留写入当时所用的估算器。自动路由的使用标签页会展示当前估算值的覆盖情况。",

  // -------------------------------------------------- ScopedSavingsTab.tsx
  "scopedSavingsTab.utcBucketed": "花费按 UTC 自然日归集",
  "scopedSavingsTab.unavailable": "该时间范围内没有节省数据。请换一个时间范围，或重新打开此标签页。",
  "scopedSavingsTab.savings": "节省",
  "scopedSavingsTab.runningTotalSaved": "累计节省",
  "scopedSavingsTab.savedPerDay": "每天节省",
  "scopedSavingsTab.perDay": "每天",
  "scopedSavingsTab.cumulative": "累计",
  "scopedSavingsTab.loadingSavings": "正在加载节省数据...",
  "scopedSavingsTab.noUsage": "该时间范围内没有此 {entityType} 的用量记录。",

  // -------------------------------------------------- SidePanel.tsx
  "sidePanel.resize": "调整 {noun} 面板宽度",
  "sidePanel.close": "关闭 (Esc)",
  "sidePanel.next": "下一个 {noun} (J)",
  "sidePanel.previous": "上一个 {noun} (K)",
  "sidePanel.enterFullScreen": "进入全屏",
  "sidePanel.exitFullScreen": "退出全屏",
  "sidePanel.closeNoun": "关闭 {noun} (Esc)",

  // -------------------------------------------------- SummaryCard.tsx
  "summaryCard.howCalculated": "{label} 是如何计算的",

  // -------------------------------------------------- QueryParamInput.tsx
  "queryParams.paramName": "参数名（例如 version）",
  "queryParams.paramValue": "参数值（例如 v1）",
  "queryParams.removeParam": "移除查询参数 {index}",
  "queryParams.addParam": "添加查询参数",

  // -------------------------------------------------- onboarding_link.tsx
  "onboarding.invitationLinkTitle": "邀请链接",
  "onboarding.resetPasswordLinkTitle": "重置密码链接",
  "onboarding.invitationDescription": "复制并发送生成的链接，把该用户接入代理。",
  "onboarding.resetPasswordDescription": "复制并发送生成的链接，让该用户重置密码。",
  "onboarding.userId": "用户 ID",
  "onboarding.invitationLink": "邀请链接",
  "onboarding.resetPasswordLink": "重置密码链接",
  "onboarding.copyInvitationLink": "复制邀请链接",
  "onboarding.copyPasswordResetLink": "复制密码重置链接",
};
