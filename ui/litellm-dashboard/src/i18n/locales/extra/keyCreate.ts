// i18n keys owned by the "key create / regenerate" translation batch (parallel i18n effort).
// Only that batch's agent edits this file. Spread into dictionaries via locales/en.ts and zh.ts.

export const en: Record<string, string> = {
  // -------------------------------------------------- organisms/create_key_button.tsx : shell
  "keyCreate.button": "+ Create New Key",
  "keyCreate.dialogTitle": "Create New Key",
  "keyCreate.submit": "Create Key",
  "keyCreate.savedTitle": "Save your Key",
  "keyCreate.creatingNotice": "Key being created, this might take 30s",
  "keyCreate.createUserTitle": "Create New User",
  "keyCreate.required": "required",

  // -------------------------------------------------- ownership
  "keyCreate.section.ownership": "Key Ownership",
  "keyCreate.ownedBy": "Owned By",
  "keyCreate.ownedByHint": "Select who will own this Virtual Key",
  "keyCreate.owner.you": "You",
  "keyCreate.owner.serviceAccount": "Service Account",
  "keyCreate.owner.anotherUser": "Another User",
  "keyCreate.owner.agent": "Agent",
  "keyCreate.badge.new": "New",
  "keyCreate.userId": "User ID",
  "keyCreate.userIdHint": "The user who will own this key and be responsible for its usage",
  "keyCreate.userSearchPlaceholder": "Type email or user ID to search for users",
  "keyCreate.userSearchHint": "Search by email or user ID to find users",
  "keyCreate.userSearchEmpty": "No users found",
  "keyCreate.searching": "Searching...",
  "keyCreate.createUser": "Create User",
  "keyCreate.selectAgent": "Select Agent",
  "keyCreate.selectAgentPlaceholder": "Select an agent",
  "keyCreate.noAgentsFound": "No agents found",
  "keyCreate.agentKeyHint": "This key will be used by the selected agent to make requests to LiteLLM",
  "keyCreate.team": "Team",
  "keyCreate.teamHint": "The team this key belongs to, which determines available models and budget limits",
  "keyCreate.projectHint":
    "Assign this key to a project. Selecting a project will lock the team to the project's team.",
  "keyCreate.selectTeamNotice":
    "Please select a team to continue configuring your Virtual Key. If you do not see any teams, please contact your Proxy Admin to either provide you with access to models or to add you to a team.",
  "keyCreate.allTeamModels": "All Team Models",

  // -------------------------------------------------- key details
  "keyCreate.section.details": "Key Details",
  "keyCreate.keyName": "Key Name",
  "keyCreate.keyNameHint": "A descriptive name to identify this key",
  "keyCreate.serviceAccountId": "Service Account ID",
  "keyCreate.serviceAccountIdHint": "Unique identifier for this service account",
  "keyCreate.modelsHint":
    "Select which models this key can access. Choose 'All Team Models' to grant access to all models available to the team. Leave empty to allow access to all models.",
  "keyCreate.modelsOptionalHelp": "optional - leave empty to allow access to all models",
  "keyCreate.keyTypeHint": "Select the type of key to determine what routes and operations this key can access",

  // -------------------------------------------------- optional settings : budget
  "keyCreate.section.optional": "Optional Settings",
  "keyCreate.maxBudgetHint":
    "Maximum amount in USD this key can spend. When reached, the key will be blocked from making further requests",
  "keyCreate.teamMaxBudget": "Budget cannot exceed team max budget: {amount}",
  "keyCreate.resetBudgetHint":
    "How often the budget should reset. For example, setting 'daily' will reset the budget every 24 hours",
  "keyCreate.teamResetBudget": "Team Reset Budget: {duration}",
  "keyCreate.notSet": "Not set",
  "keyCreate.perModelBudgetsHint":
    "Cap spend on individual models, each with its own reset window. Enforced across every request this key makes; usage is reported on the key's info page.",
  "keyCreate.budgetFallbacksHint":
    "When a model exceeds its per-model budget (model_max_budget), requests automatically reroute to fallback models instead of failing. Configure per-model budgets in Advanced Settings.",

  // -------------------------------------------------- optional settings : rate limits
  "keyCreate.tpmLimitLabel": "Tokens per minute Limit (TPM)",
  "keyCreate.tpmLimitHint": "Maximum number of tokens this key can process per minute. Helps control usage and costs",
  "keyCreate.teamTpmLimit": "TPM cannot exceed team TPM limit: {limit}",
  "keyCreate.rpmLimitLabel": "Requests per minute Limit (RPM)",
  "keyCreate.rpmLimitHint":
    "Maximum number of API requests this key can make per minute. Helps prevent abuse and manage load",
  "keyCreate.teamRpmLimit": "RPM cannot exceed team RPM limit: {limit}",
  "keyCreate.tpdLimitLabel": "Tokens per day Limit (TPD)",
  "keyCreate.teamTpdLimit": "TPD cannot exceed team TPD limit: {limit}",

  // -------------------------------------------------- optional settings : guardrails / policies / prompts
  "keyCreate.guardrailsHint": "Apply safety guardrails to this key to filter content or enforce policies",
  "keyCreate.guardrailsHelp": "Select existing guardrails or enter new ones",
  "keyCreate.guardrailsPremium": "Premium feature - Upgrade to set guardrails by key",
  "keyCreate.guardrailsPlaceholder": "Select or enter guardrails",
  "keyCreate.bypassGlobalGuardrailsHelp": "Bypass global guardrails for this key",
  "keyCreate.disableGlobalGuardrailsPremium": "Premium feature - Upgrade to disable global guardrails by key",
  "keyCreate.policiesHelp": "Select existing policies or enter new ones",
  "keyCreate.policiesPremium": "Premium feature - Upgrade to set policies by key",
  "keyCreate.policiesPlaceholder": "Select or enter policies",
  "keyCreate.promptsHint": "Allow this key to use specific prompt templates",
  "keyCreate.promptsHelp": "Select existing prompts or enter new ones",

  // -------------------------------------------------- optional settings : access / metadata / tags
  "keyCreate.accessGroupsHelp": "Select access groups to assign to this key",
  "keyCreate.passthroughHint": "Allow this key to use specific pass through routes",
  "keyCreate.passthroughHelp": "Select existing pass through routes or enter new ones",
  "keyCreate.passthroughPremium": "Premium feature - Upgrade to set pass through routes by key",
  "keyCreate.passthroughPlaceholder": "Select or enter pass through routes",
  "keyCreate.vectorStoresLabel": "Allowed Vector Stores",
  "keyCreate.vectorStoresHint":
    "Select which vector stores this key can access. If none selected, the key will have access to all available vector stores",
  "keyCreate.vectorStoresHelp": "Select vector stores this key can access. Leave empty for access to all vector stores",
  "keyCreate.vectorStoresPlaceholder": "Select vector stores (optional)",
  "keyCreate.metadataHint": "JSON object with additional information about this key. Used for tracking or custom logic",
  "keyCreate.metadataPlaceholder": "Enter metadata as JSON",
  "keyCreate.tagsHint": "Tags for tracking spend and/or doing tag-based routing. Used for analytics and filtering",
  "keyCreate.tagsHelp": "Tags for tracking spend and/or doing tag-based routing.",

  // -------------------------------------------------- optional settings : collapsible sections
  "keyCreate.section.mcp": "MCP Settings",
  "keyCreate.allowedMcpServers": "Allowed MCP Servers",
  "keyCreate.allowedMcpServersHint": "Select which MCP servers or access groups this key can access",
  "keyCreate.allowedMcpServersHelp": "Select MCP servers or access groups this key can access",
  "keyCreate.section.agents": "Agent Settings",
  "keyCreate.allowedAgents": "Allowed Agents",
  "keyCreate.allowedAgentsHint": "Select which agents or access groups this key can access",
  "keyCreate.allowedAgentsHelp": "Select agents or access groups this key can access",
  "keyCreate.section.skills": "Skill Settings",
  "keyCreate.allowedSkills": "Allowed Skills",
  "keyCreate.allowedSkillsHint":
    "Enabled skills are visible to every key. Grant disabled (private) Claude Code plugins to this key here",
  "keyCreate.allowedSkillsHelp": "Select private skills this key can access in the Claude Code marketplace",
  "keyCreate.skillsPlaceholder": "Select skills (optional)",
  "keyCreate.loggingEnterpriseHint": "Key-level logging settings is an enterprise feature, get in touch -",
  "keyCreate.section.modelAliases": "Model Aliases",
  "keyCreate.modelAliasesBlurb":
    "Create custom aliases for models that can be used in API calls. This allows you to create shortcuts for specific models.",
  "keyCreate.section.keyLifecycle": "Key Lifecycle",
  "keyCreate.section.advanced": "Advanced Settings",
  "keyCreate.advancedDocsPrefix": "Learn more about advanced settings in our",
  "keyCreate.advancedDocsLink": "documentation",

  // -------------------------------------------------- validation messages
  "keyCreate.errors.duplicateAlias":
    "Key alias {alias} already exists for team with ID {teamId}, please provide another key alias",
  "keyCreate.errors.userIdRequired": "Please input the user ID of the user you are assigning the key to",
  "keyCreate.errors.teamRequiredForServiceAccount": "Please select a team for the service account",
  "keyCreate.errors.keyNameRequired": "Please input a key name",
  "keyCreate.errors.serviceAccountIdRequired": "Please input a service account ID",
  "keyCreate.errors.tpmCeiling": "TPM limit cannot exceed team TPM limit: {limit}",
  "keyCreate.errors.rpmCeiling": "RPM limit cannot exceed team RPM limit: {limit}",
  "keyCreate.errors.tpdCeiling": "TPD limit cannot exceed team TPD limit: {limit}",

  // -------------------------------------------------- toasts
  "keyCreate.toast.makingApiCall": "Making API Call",
  "keyCreate.toast.selectAgent": "Please select an agent",
  "keyCreate.toast.created": "Virtual Key Created",
  "keyCreate.toast.userSearchFailed": "Failed to search for users",

  // -------------------------------------------------- organisms/RegenerateKeyModal.tsx
  "keyCreate.regen.title": "Regenerate Virtual Key",
  "keyCreate.regen.submit": "Regenerate",
  "keyCreate.regen.saveNowWarning": "Save it now, you will not see it again",
  "keyCreate.regen.noAlias": "No alias set",
  "keyCreate.regen.virtualKeyLabel": "Virtual Key",
  "keyCreate.regen.copyKey": "Copy Key",
  "keyCreate.regen.expireKey": "Expire Key",
  "keyCreate.regen.durationPlaceholder": "e.g. 30s, 30h, 30d",
  "keyCreate.regen.currentExpiry": "Current expiry: {expiry}",
  "keyCreate.regen.newExpiry": "New expiry: {expiry}",
  "keyCreate.regen.never": "Never",
  "keyCreate.regen.expired": "expired",
  "keyCreate.regen.gracePeriod": "Grace Period",
  "keyCreate.regen.gracePeriodHint":
    "Keep the old key valid for this duration after rotation. Both keys work during this period for seamless cutover. Empty = immediate revoke.",
  "keyCreate.regen.gracePeriodRecommended": "Recommended: 24h to 72h for production keys",
  "keyCreate.regen.gracePeriodPlaceholder": "e.g. 24h, 2d",
  "keyCreate.regen.durationError": "Must be a duration like 30s, 30m, 24h, 2d, 1w, or 1mo",
  "keyCreate.regen.expiredDurationError": "Expiration is required for expired keys",
  "keyCreate.regen.successToast": "Virtual Key regenerated successfully",

  // -------------------------------------------------- key_team_helpers/EndUserBudgetSelect.tsx
  "keyCreate.endUserBudgetHint":
    "Reusable budget applied to every new customer (end user) this key creates via `user` or x-litellm-end-user-id. Overrides the proxy-wide max_end_user_budget_id; customers that already have their own budget keep it.",
};

export const zh: Record<string, string> = {
  // -------------------------------------------------- organisms/create_key_button.tsx : shell
  "keyCreate.button": "+ 创建新密钥",
  "keyCreate.dialogTitle": "创建新密钥",
  "keyCreate.submit": "创建密钥",
  "keyCreate.savedTitle": "保存你的密钥",
  "keyCreate.creatingNotice": "密钥正在创建中，可能需要 30 秒",
  "keyCreate.createUserTitle": "创建新用户",
  "keyCreate.required": "必填",

  // -------------------------------------------------- ownership
  "keyCreate.section.ownership": "密钥归属",
  "keyCreate.ownedBy": "归属方",
  "keyCreate.ownedByHint": "选择这个虚拟密钥的归属方",
  "keyCreate.owner.you": "你自己",
  "keyCreate.owner.serviceAccount": "服务账号",
  "keyCreate.owner.anotherUser": "其他用户",
  "keyCreate.owner.agent": "Agent",
  "keyCreate.badge.new": "新",
  "keyCreate.userId": "用户 ID",
  "keyCreate.userIdHint": "该密钥的归属用户，由其对用量负责",
  "keyCreate.userSearchPlaceholder": "输入邮箱或用户 ID 搜索用户",
  "keyCreate.userSearchHint": "按邮箱或用户 ID 搜索以找到用户",
  "keyCreate.userSearchEmpty": "未找到用户",
  "keyCreate.searching": "搜索中...",
  "keyCreate.createUser": "创建用户",
  "keyCreate.selectAgent": "选择 Agent",
  "keyCreate.selectAgentPlaceholder": "选择一个 Agent",
  "keyCreate.noAgentsFound": "未找到 Agent",
  "keyCreate.agentKeyHint": "该密钥将被选中的 Agent 用于向 LiteLLM 发起请求",
  "keyCreate.team": "团队",
  "keyCreate.teamHint": "该密钥所属的团队，决定可用的模型和预算上限",
  "keyCreate.projectHint": "把该密钥分配给某个项目。选择项目后，团队会被锁定为该项目所属的团队。",
  "keyCreate.selectTeamNotice":
    "请先选择一个团队，然后才能继续配置虚拟密钥。如果没有看到任何团队，请联系你的 Proxy Admin，让他为你开通模型访问权限或把你加入某个团队。",
  "keyCreate.allTeamModels": "团队全部模型",

  // -------------------------------------------------- key details
  "keyCreate.section.details": "密钥详情",
  "keyCreate.keyName": "密钥名称",
  "keyCreate.keyNameHint": "用于识别该密钥的描述性名称",
  "keyCreate.serviceAccountId": "服务账号 ID",
  "keyCreate.serviceAccountIdHint": "该服务账号的唯一标识",
  "keyCreate.modelsHint":
    "选择该密钥可以访问的模型。选择“All Team Models”即可获得团队全部模型的访问权限。留空表示允许访问所有模型。",
  "keyCreate.modelsOptionalHelp": "可选，留空表示允许访问所有模型",
  "keyCreate.keyTypeHint": "选择密钥类型，以确定该密钥可以访问的路由和操作",

  // -------------------------------------------------- optional settings : budget
  "keyCreate.section.optional": "可选设置",
  "keyCreate.maxBudgetHint": "该密钥可消费的最高金额（美元）。达到上限后，密钥将被阻止继续发起请求",
  "keyCreate.teamMaxBudget": "预算不能超过团队的最高预算：{amount}",
  "keyCreate.resetBudgetHint": "预算重置的频率。例如设置为“daily”表示每 24 小时重置一次预算",
  "keyCreate.teamResetBudget": "团队预算重置周期：{duration}",
  "keyCreate.notSet": "未设置",
  "keyCreate.perModelBudgetsHint":
    "为每个模型单独限制消费金额，各自按自己的周期重置。对该密钥发起的每一次请求都会执行这项限制，用量可在密钥信息页查看。",
  "keyCreate.budgetFallbacksHint":
    "当某个模型超出其单模型预算（model_max_budget）时，请求会自动改路由到回退模型，而不是直接失败。请在“高级设置”中配置单模型预算。",

  // -------------------------------------------------- optional settings : rate limits
  "keyCreate.tpmLimitLabel": "每分钟令牌数上限 (TPM)",
  "keyCreate.tpmLimitHint": "该密钥每分钟最多可处理的令牌数，有助于控制用量和成本",
  "keyCreate.teamTpmLimit": "TPM 不能超过团队的 TPM 上限：{limit}",
  "keyCreate.rpmLimitLabel": "每分钟请求数上限 (RPM)",
  "keyCreate.rpmLimitHint": "该密钥每分钟最多可发起的 API 请求数，有助于防止滥用和管理负载",
  "keyCreate.teamRpmLimit": "RPM 不能超过团队的 RPM 上限：{limit}",
  "keyCreate.tpdLimitLabel": "每天令牌数上限 (TPD)",
  "keyCreate.teamTpdLimit": "TPD 不能超过团队的 TPD 上限：{limit}",

  // -------------------------------------------------- optional settings : guardrails / policies / prompts
  "keyCreate.guardrailsHint": "为该密钥应用安全护栏，用于过滤内容或执行策略",
  "keyCreate.guardrailsHelp": "选择已有护栏，或输入新的护栏",
  "keyCreate.guardrailsPremium": "高级版功能 - 升级后可按密钥设置护栏",
  "keyCreate.guardrailsPlaceholder": "选择或输入护栏",
  "keyCreate.bypassGlobalGuardrailsHelp": "该密钥将跳过全局护栏",
  "keyCreate.disableGlobalGuardrailsPremium": "高级版功能 - 升级后可按密钥禁用全局护栏",
  "keyCreate.policiesHelp": "选择已有策略，或输入新的策略",
  "keyCreate.policiesPremium": "高级版功能 - 升级后可按密钥设置策略",
  "keyCreate.policiesPlaceholder": "选择或输入策略",
  "keyCreate.promptsHint": "允许该密钥使用指定的提示词模板",
  "keyCreate.promptsHelp": "选择已有提示词，或输入新的提示词",

  // -------------------------------------------------- optional settings : access / metadata / tags
  "keyCreate.accessGroupsHelp": "选择要分配给该密钥的访问组",
  "keyCreate.passthroughHint": "允许该密钥使用指定的透传路由",
  "keyCreate.passthroughHelp": "选择已有透传路由，或输入新的路由",
  "keyCreate.passthroughPremium": "高级版功能 - 升级后可按密钥设置透传路由",
  "keyCreate.passthroughPlaceholder": "选择或输入透传路由",
  "keyCreate.vectorStoresLabel": "允许访问的向量库",
  "keyCreate.vectorStoresHint": "选择该密钥可以访问的向量库。若不选择，则该密钥可以访问所有可用的向量库",
  "keyCreate.vectorStoresHelp": "选择该密钥可以访问的向量库。留空表示可访问全部向量库",
  "keyCreate.vectorStoresPlaceholder": "选择向量库（可选）",
  "keyCreate.metadataHint": "包含该密钥额外信息的 JSON 对象，用于追踪或自定义逻辑",
  "keyCreate.metadataPlaceholder": "以 JSON 格式输入元数据",
  "keyCreate.tagsHint": "用于追踪消费和/或基于标签路由的标签。用于分析和筛选",
  "keyCreate.tagsHelp": "用于追踪消费和/或基于标签路由的标签。",

  // -------------------------------------------------- optional settings : collapsible sections
  "keyCreate.section.mcp": "MCP 设置",
  "keyCreate.allowedMcpServers": "允许访问的 MCP 服务器",
  "keyCreate.allowedMcpServersHint": "选择该密钥可以访问的 MCP 服务器或访问组",
  "keyCreate.allowedMcpServersHelp": "选择该密钥可以访问的 MCP 服务器或访问组",
  "keyCreate.section.agents": "Agent 设置",
  "keyCreate.allowedAgents": "允许访问的 Agent",
  "keyCreate.allowedAgentsHint": "选择该密钥可以访问的 Agent 或访问组",
  "keyCreate.allowedAgentsHelp": "选择该密钥可以访问的 Agent 或访问组",
  "keyCreate.section.skills": "技能设置",
  "keyCreate.allowedSkills": "允许访问的技能",
  "keyCreate.allowedSkillsHint":
    "已启用的技能对所有密钥都可见。可在这里把未启用（私有）的 Claude Code 插件授权给该密钥",
  "keyCreate.allowedSkillsHelp": "选择该密钥在 Claude Code 市场中可以访问的私有技能",
  "keyCreate.skillsPlaceholder": "选择技能（可选）",
  "keyCreate.loggingEnterpriseHint": "密钥级日志设置属于企业版功能，请联系我们 -",
  "keyCreate.section.modelAliases": "模型别名",
  "keyCreate.modelAliasesBlurb": "为模型创建可在 API 调用中使用的自定义别名，从而为特定模型创建快捷方式。",
  "keyCreate.section.keyLifecycle": "密钥生命周期",
  "keyCreate.section.advanced": "高级设置",
  "keyCreate.advancedDocsPrefix": "在我们的",
  "keyCreate.advancedDocsLink": "文档",

  // -------------------------------------------------- validation messages
  "keyCreate.errors.duplicateAlias": "ID 为 {teamId} 的团队下已存在别名 {alias} 的密钥，请换一个密钥别名",
  "keyCreate.errors.userIdRequired": "请输入你要把该密钥分配给的用户 ID",
  "keyCreate.errors.teamRequiredForServiceAccount": "请为该服务账号选择一个团队",
  "keyCreate.errors.keyNameRequired": "请输入密钥名称",
  "keyCreate.errors.serviceAccountIdRequired": "请输入服务账号 ID",
  "keyCreate.errors.tpmCeiling": "TPM 上限不能超过团队的 TPM 上限：{limit}",
  "keyCreate.errors.rpmCeiling": "RPM 上限不能超过团队的 RPM 上限：{limit}",
  "keyCreate.errors.tpdCeiling": "TPD 上限不能超过团队的 TPD 上限：{limit}",

  // -------------------------------------------------- toasts
  "keyCreate.toast.makingApiCall": "正在发起 API 请求",
  "keyCreate.toast.selectAgent": "请选择一个 Agent",
  "keyCreate.toast.created": "虚拟密钥已创建",
  "keyCreate.toast.userSearchFailed": "搜索用户失败",

  // -------------------------------------------------- organisms/RegenerateKeyModal.tsx
  "keyCreate.regen.title": "重新生成虚拟密钥",
  "keyCreate.regen.submit": "重新生成",
  "keyCreate.regen.saveNowWarning": "请立即保存，之后将无法再次查看",
  "keyCreate.regen.noAlias": "未设置别名",
  "keyCreate.regen.virtualKeyLabel": "虚拟密钥",
  "keyCreate.regen.copyKey": "复制密钥",
  "keyCreate.regen.expireKey": "密钥过期时间",
  "keyCreate.regen.durationPlaceholder": "例如 30s、30h、30d",
  "keyCreate.regen.currentExpiry": "当前过期时间：{expiry}",
  "keyCreate.regen.newExpiry": "新的过期时间：{expiry}",
  "keyCreate.regen.never": "永不过期",
  "keyCreate.regen.expired": "已过期",
  "keyCreate.regen.gracePeriod": "宽限期",
  "keyCreate.regen.gracePeriodHint":
    "轮换之后，在这段时长内旧密钥仍然有效。在此期间两个密钥同时可用，便于无缝切换。留空表示立即吊销。",
  "keyCreate.regen.gracePeriodRecommended": "生产环境密钥建议设置为 24h 到 72h",
  "keyCreate.regen.gracePeriodPlaceholder": "例如 24h、2d",
  "keyCreate.regen.durationError": "必须是类似 30s、30m、24h、2d、1w 或 1mo 的时长",
  "keyCreate.regen.expiredDurationError": "已过期的密钥必须设置过期时间",
  "keyCreate.regen.successToast": "虚拟密钥已重新生成",

  // -------------------------------------------------- key_team_helpers/EndUserBudgetSelect.tsx
  "keyCreate.endUserBudgetHint":
    "该密钥通过 `user` 或 x-litellm-end-user-id 创建的每个新客户（终端用户）都会应用这个可复用预算。它的优先级高于代理全局的 max_end_user_budget_id；已经拥有自己预算的客户会继续沿用原预算。",
};
