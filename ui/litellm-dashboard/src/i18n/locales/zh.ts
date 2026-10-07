/**
 * Chinese (Simplified) translations. Keys mirror en.ts 1:1; anything missing here
 * automatically falls back to the English value at lookup time.
 */
import { zh as keysZh } from "./extra/keys";
import { zh as modelsCoreZh } from "./extra/modelsCore";
import { zh as addModelZh } from "./extra/addModel";
import { zh as mcpZh } from "./extra/mcp";
import { zh as mcpToolsZh } from "./extra/mcpTools";
import { zh as mcpServersZh } from "./extra/mcpServers";
import { zh as settingsAdminZh } from "./extra/settingsAdmin";
import { zh as keyCreateZh } from "./extra/keyCreate";
import { zh as settingsNetZh } from "./extra/settingsNet";
import { zh as playgroundZh } from "./extra/playground";
import { zh as promptsZh } from "./extra/prompts";
import { zh as guardrailsZh } from "./extra/guardrails";
import { zh as teamsOrgZh } from "./extra/teamsOrg";
import { zh as usageZh } from "./extra/usage";
import { zh as settingsZh } from "./extra/settings";
import { zh as sharedUiZh } from "./extra/sharedUi";
import { zh as lensZh } from "./extra/lens";
import { zh as agentsSkillsZh } from "./extra/agentsSkills";
import { zh as chatZh } from "./extra/chat";
import { zh as homeZh } from "./extra/home";
import { zh as miscZh } from "./extra/misc";
import { zh as lensViewsZh } from "./extra/lensViews";
import { zh as sharedWidgetsZh } from "./extra/sharedWidgets";
import { zh as costAnalyticsZh } from "./extra/costAnalytics";
import { zh as roiCalculatorZh } from "./extra/roiCalculator";
import { zh as toolPoliciesZh } from "./extra/toolPolicies";
import { zh as cachingZh } from "./extra/caching";
import { zh as vectorStoresZh } from "./extra/vectorStores";

export const zh: Record<string, string> = {
  ...toolPoliciesZh,
  ...cachingZh,
  ...vectorStoresZh,
  // ---------------------------------------------------------------- language switcher
  "language.switchTo": "切换到{language}",
  "language.current": "当前语言：{language}",

  // ---------------------------------------------------------------- shared vocabulary
  "common.save": "保存",
  "common.saveChanges": "保存更改",
  "common.cancel": "取消",
  "common.close": "关闭",
  "common.delete": "删除",
  "common.edit": "编辑",
  "common.add": "添加",
  "common.remove": "移除",
  "common.update": "更新",
  "common.copy": "复制",
  "common.copied": "已复制",
  "common.search": "搜索",
  "common.reset": "重置",
  "common.clear": "清空",
  "common.clearAll": "全部清空",
  "common.apply": "应用",
  "common.loading": "加载中...",
  "common.yes": "是",
  "common.no": "否",
  "common.back": "返回",
  "common.next": "下一步",
  "common.previous": "上一步",
  "common.optional": "可选",
  "common.required": "必填",
  "common.none": "无",
  "common.status": "状态",
  "common.name": "名称",
  "common.description": "描述",
  "common.actions": "操作",
  "common.details": "详情",
  "common.view": "查看",
  "common.refresh": "刷新",
  "common.retry": "重试",
  "common.error": "错误",
  "common.success": "成功",
  "common.enabled": "已启用",
  "common.disabled": "已禁用",
  "common.default": "默认",
  "common.select": "选择",
  "common.type": "类型",
  "common.value": "值",
  "common.date": "日期",
  "common.total": "总计",
  "common.learnMore": "了解更多",
  "common.continue": "继续",
  "common.hide": "隐藏",
  "common.show": "显示",
  "common.stop": "停止",
  "common.done": "完成",
  "common.duplicate": "复制",
  "common.dangerZone": "危险区",
  "common.unlimited": "无限制",
  "common.unlimitedLower": "无限制",
  "common.unavailable": "不可用",

  // ---------------------------------------------------------------- sidebar: groups
  "navGroup.AI_GATEWAY": "AI 网关",
  "navGroup.OBSERVABILITY": "可观测性",
  "navGroup.ACCESS_CONTROL": "访问控制",
  "navGroup.DEVELOPER_TOOLS": "开发者工具",
  "navGroup.SETTINGS": "设置",

  // ---------------------------------------------------------------- sidebar: items
  "nav.api-keys": "虚拟密钥",
  "nav.llm-playground": "调试台",
  "nav.models": "模型 + 端点",
  "nav.agentic": "智能体",
  "nav.agents": "智能体",
  "nav.workflows": "工作流运行",
  "nav.memory": "记忆",
  "nav.mcp-servers": "MCP 服务器",
  "nav.skills": "技能",
  "nav.guardrails": "防护栏",
  "nav.policies": "策略",
  "nav.tools": "工具",
  "nav.search-tools": "搜索工具",
  "nav.vector-stores": "向量库",
  "nav.tool-policies": "工具策略",
  "nav.new_usage": "用量",
  "nav.model-insights": "模型排行榜",
  "nav.roi-calculator": "ROI 计算器",
  "nav.cost-optimization": "成本优化",
  "nav.logs": "日志",
  "nav.lens": "Lens",
  "nav.guardrails-monitor": "防护栏监控",
  "nav.teams": "团队",
  "nav.projects": "项目",
  "nav.users": "内部用户",
  "nav.organizations": "组织",
  "nav.access-groups": "访问组",
  "nav.budgets": "预算",
  "nav.api_ref": "API 参考",
  "nav.model-hub-table": "AI Hub",
  "nav.learning-resources": "学习资源",
  "nav.caching": "响应缓存",
  "nav.experimental": "实验功能",
  "nav.prompts": "提示词",
  "nav.transform-request": "API 调试台",
  "nav.tag-management": "标签管理",
  "nav.4": "旧版用量",
  "nav.settings": "设置",
  "nav.router-settings": "路由设置",
  "nav.logging-and-alerts": "日志与告警",
  "nav.admin-panel": "管理设置",
  "nav.cost-tracking": "成本追踪",
  "nav.ui-theme": "界面主题",
  "nav.account.fallback": "账户",
  "nav.account.tier": "套餐",
  "nav.account.role": "角色",
  "nav.account.email": "邮箱",
  "nav.account.userId": "用户 ID",
  "nav.account.premium": "高级版",
  "nav.account.standard": "标准版",
  "nav.account.upgradeToPremium": "升级到高级版以解锁更多功能",
  "nav.account.copyEmail": "复制邮箱",
  "nav.account.copyUserId": "复制用户 ID",
  "nav.account.copyUserIdTitle": "复制用户 ID",
  "nav.account.triggerLabel": "账户菜单 — {role} — 当前登录为 {user}",
  "nav.account.unknownRole": "未知角色",
  "nav.account.hideNewFeatureIndicators": "隐藏新功能标记",
  "nav.account.hideNewFeatureIndicatorsToggle": "切换是否隐藏新功能标记",
  "nav.account.hideAllPrompts": "隐藏所有提示",
  "nav.account.hideAllPromptsToggle": "切换是否隐藏所有提示",
  "nav.account.hideBlogPosts": "隐藏博客文章",
  "nav.account.hideBlogPostsToggle": "切换是否隐藏博客文章",
  "nav.account.hideBouncingIcon": "隐藏跳动图标",
  "nav.account.hideBouncingIconToggle": "切换是否隐藏跳动图标",
  "nav.account.hideLiteAdmin": "隐藏 LiteAdmin",
  "nav.account.hideLiteAdminToggle": "切换是否隐藏 LiteAdmin",
  "nav.account.changePassword": "修改密码",
  "nav.account.logout": "退出登录",
  "nav.community.joinSlack": "加入 Slack",
  "nav.community.slackTooltip": "LiteLLM Slack 社区",
  "nav.community.github": "LiteLLM 的 GitHub 仓库",
  "nav.community.links": "社区链接",

  // ---------------------------------------------------------------- navbar
  "navbar.expandSidebar": "展开侧边栏",
  "navbar.collapseSidebar": "收起侧边栏",
  "navbar.docs": "文档",
  "navbar.blog": "博客",
  "navbar.notifications": "通知",
  "navbar.thanksForUsing": "感谢使用 LiteLLM！",
  "navbar.documentation": "产品文档",
  "navbar.home": "LiteLLM 首页",
  "navbar.theme.light": "切换到浅色模式",
  "navbar.theme.dark": "切换到深色模式（Beta）",
  "navbar.workerSwitcher": "切换 Worker",
  "navbar.aiGateway": "AI 网关",
  "navbar.chat": "对话",
  "navbar.chatDisabledHint": "管理员可在设置中启用",
  "navbar.noMatchingWorkers": "没有匹配的 Worker",
  "navbar.blogLoadFailed": "文章加载失败",
  "navbar.blogEmpty": "暂无文章",
  "navbar.blogViewAll": "查看全部文章",
  "navbar.loading": "加载中",
  "navbar.autoRouterBody": "把每次请求都路由到能处理它的最便宜的模型，无需改动提示词。",
  "navbar.autoRouterReadDocs": "阅读文档",
  "navbar.autoRouterMarkRead": "标记为已读",

  // ---------------------------------------------------------------- login page
  "login.title": "登录",
  "login.subtitle": "访问您的 LiteLLM 管理界面。",
  "login.defaultCredentials": "默认凭据",
  "login.defaultCredPrefix": "默认用户名为",
  "login.defaultCredMiddle": "，密码为您设置的 LiteLLM Proxy",
  "login.needCredentials": "需要设置界面凭据或 SSO？",
  "login.checkDocs": "查看文档",
  "login.username": "用户名",
  "login.usernameRequired": "请输入用户名",
  "login.usernamePlaceholder": "请输入用户名",
  "login.password": "密码",
  "login.passwordRequired": "请输入密码",
  "login.passwordPlaceholder": "请输入密码",
  "login.login": "登录",
  "login.loggingIn": "登录中...",
  "login.loginWithSso": "使用 SSO 登录",
  "login.ssoNotConfigured": "请先配置 SSO 后方可使用 SSO 登录。",
  "login.worker": "Worker",
  "login.chooseWorker": "选择要连接的 Worker",
  "login.adminUIDisabled": "管理界面已禁用",
  "login.adminUIDisabledBody": "管理界面已被管理员禁用。如需重新启用，请更新以下环境变量：",
  "login.ssoNotice":
    "单点登录（SSO）已启用。LiteLLM 在加载此页面时不再自动跳转到 SSO 登录流程。如需恢复自动跳转，请在环境配置中设置",
  "login.ssoNoticeTail": "。",
  "login.close": "关闭",

  // ---------------------------------------------------------------- sidebar usage card
  "sidebarUsage.enterpriseUsage": "企业版用量",
  "sidebarUsage.seats": "席位",
  "sidebarUsage.teams": "团队",
  "sidebarUsage.activePlan": "有效订阅",

  // ---------------------------------------------------------------- user banner
  "userBanner.dismiss": "关闭横幅",

  // ---------------------------------------------------------------- deprecation banner
  "deprecation.title": "{feature} 已列入弃用草案清单",
  "deprecation.body":
    "{feature} 是我们正在考虑移除的若干实验功能之一，最早可能于 {date} 移除。此清单为草案，并非最终决定。如果您依赖此功能，请在",
  "deprecation.discussionLink": "弃用讨论帖",
  "deprecation.bodySuffix": "中分享反馈。",

  // ---------------------------------------------------------------- license expiry banner
  "licenseExpiry.expiresToday": "将于今日到期",
  "licenseExpiry.expiresInOneDay": "将于 1 天后到期",
  "licenseExpiry.expiresInDays": "将于 {days} 天后到期",
  "licenseExpiry.expiredTitle": "您的 LiteLLM Enterprise 许可证已于 {date} 过期",
  "licenseExpiry.countdownTitle": "您的 LiteLLM Enterprise 许可证{countdown}（{date}）",
  "licenseExpiry.expiredPrefix": "企业版功能现已停用，请联系 ",
  "licenseExpiry.expiredSuffix": " 恢复访问",
  "licenseExpiry.criticalPrefix": "请立即续订以避免失去企业版功能，请联系 ",
  "licenseExpiry.criticalSuffix": "。",
  "licenseExpiry.warningPrefix": "请在到期前续订以保留企业版功能，请联系 ",
  "licenseExpiry.warningSuffix": "。",

  // ---------------------------------------------------------------- debug warning banner
  "debugWarning.title": "性能警告：详细调试模式已开启",
  "debugWarning.descPrefix": "详细调试日志（",
  "debugWarning.descSuffix": "）已开启。该模式会记录大量诊断信息并显著降低性能，仅应用于故障排查，请在生产环境中关闭。",

  // ---------------------------------------------------------------- upgrade banner
  "upgradeBanner.latestPrefix": "最新版本为 ",
  "upgradeBanner.latestSuffix": "：{stats}",
  "upgradeBanner.currentVersion": "您当前的版本为 v{version}",
  "upgradeBanner.newFeature": "{count} 个新功能",
  "upgradeBanner.newFeatures": "{count} 个新功能",
  "upgradeBanner.fix": "{count} 项修复",
  "upgradeBanner.fixes": "{count} 项修复",
  "upgradeBanner.otherUpdate": "{count} 项其他更新",
  "upgradeBanner.otherUpdates": "{count} 项其他更新",
  "upgradeBanner.and": "以及 {rest}",
  "upgradeBanner.listSeparator": "、",

  // ---------------------------------------------------------------- no redis warning banner
  "noRedis.title": "未配置 Redis，强烈建议配置 Redis",
  "noRedis.bodyPrefix":
    "此代理正在运行多个 Worker（或无法验证 Worker 数量）。在没有 Redis 的情况下，速率限制、预算、路由器状态和缓存失效都按 Worker 独立生效，因此限制会按 Worker 各执行一次，支出可能超出预期。",
  "noRedis.linkText": "查看没有 Redis 时无法正常工作的全部功能",
  "noRedis.bodyMiddle": "。设置 ",
  "noRedis.bodySuffix": " 以隐藏此横幅。",

  // ---------------------------------------------------------------- env credential login warning banner
  "envCredential.title": "环境变量凭据登录已启用",
  "envCredential.anyoneWith": "任何拥有 ",
  "envCredential.slash": "/",
  "envCredential.orMasterKeyWhen": "（或在 ",
  "envCredential.canSignIn":
    " 未设置时为主密钥）都能使用共享的静态密钥以代理管理员身份登录。请先创建一个拥有独立密码的常规管理员账号，然后设置 ",
  "envCredential.turnOff": " 以关闭此登录路径。",

  // ---------------------------------------------------------------- delete resource modal
  "common.deleting": "删除中…",
  "deleteResource.typePrefix": "输入 ",
  "deleteResource.typeSuffix": " 以确认删除：",

  // ---------------------------------------------------------------- default proxy admin tag
  "defaultProxyAdmin.tag": "默认代理管理员",

  // ---------------------------------------------------------------- domain batches (parallel i18n effort)
  ...keysZh,
  ...modelsCoreZh,
  ...addModelZh,
  ...mcpZh,
  ...mcpToolsZh,
  ...mcpServersZh,
  ...settingsAdminZh,
  ...keyCreateZh,
  ...settingsNetZh,
  ...playgroundZh,
  ...promptsZh,
  ...guardrailsZh,
  ...teamsOrgZh,
  ...usageZh,
  ...settingsZh,
  ...sharedUiZh,
  ...lensZh,
  ...agentsSkillsZh,
  ...chatZh,
  ...homeZh,
  ...miscZh,
  ...lensViewsZh,
  ...sharedWidgetsZh,
  ...costAnalyticsZh,
  ...roiCalculatorZh,
};
