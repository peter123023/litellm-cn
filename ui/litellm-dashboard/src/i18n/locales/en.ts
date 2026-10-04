/**
 * English source strings.
 *
 * `zh.ts` mirrors these keys 1:1; a key missing from zh falls back to the value here, so the
 * English file doubles as the reference for translators and stays the single source of truth
 * for the original copy.
 *
 * Key shape: "<area>.<name>", flat so lookups stay O(1) and keys can be relocated freely.
 * Placeholders use {braces} and are substituted by `translate()` in ./index.ts.
 */
import { en as keysEn } from "./extra/keys";
import { en as modelsCoreEn } from "./extra/modelsCore";
import { en as addModelEn } from "./extra/addModel";
import { en as mcpEn } from "./extra/mcp";
import { en as playgroundEn } from "./extra/playground";
import { en as promptsEn } from "./extra/prompts";
import { en as guardrailsEn } from "./extra/guardrails";
import { en as teamsOrgEn } from "./extra/teamsOrg";
import { en as usageEn } from "./extra/usage";
import { en as settingsEn } from "./extra/settings";
import { en as sharedUiEn } from "./extra/sharedUi";
import { en as lensEn } from "./extra/lens";
import { en as agentsSkillsEn } from "./extra/agentsSkills";
import { en as chatEn } from "./extra/chat";
import { en as homeEn } from "./extra/home";
import { en as miscEn } from "./extra/misc";
import { en as lensViewsEn } from "./extra/lensViews";
import { en as sharedWidgetsEn } from "./extra/sharedWidgets";
import { en as costAnalyticsEn } from "./extra/costAnalytics";

export const en: Record<string, string> = {
  // ---------------------------------------------------------------- language switcher
  "language.label": "Language",
  "language.switchTo": "Switch to {language}",
  "language.current": "Current language: {language}",

  // ---------------------------------------------------------------- shared vocabulary
  "common.save": "Save",
  "common.saveChanges": "Save changes",
  "common.cancel": "Cancel",
  "common.close": "Close",
  "common.delete": "Delete",
  "common.edit": "Edit",
  "common.add": "Add",
  "common.remove": "Remove",
  "common.create": "Create",
  "common.update": "Update",
  "common.copy": "Copy",
  "common.copied": "Copied",
  "common.search": "Search",
  "common.filter": "Filter",
  "common.reset": "Reset",
  "common.clear": "Clear",
  "common.clearAll": "Clear all",
  "common.apply": "Apply",
  "common.confirm": "Confirm",
  "common.loading": "Loading...",
  "common.yes": "Yes",
  "common.no": "No",
  "common.back": "Back",
  "common.next": "Next",
  "common.previous": "Previous",
  "common.submit": "Submit",
  "common.optional": "Optional",
  "common.required": "Required",
  "common.all": "All",
  "common.none": "None",
  "common.status": "Status",
  "common.name": "Name",
  "common.description": "Description",
  "common.actions": "Actions",
  "common.details": "Details",
  "common.view": "View",
  "common.download": "Download",
  "common.refresh": "Refresh",
  "common.retry": "Retry",
  "common.error": "Error",
  "common.success": "Success",
  "common.warning": "Warning",
  "common.enabled": "Enabled",
  "common.disabled": "Disabled",
  "common.default": "Default",
  "common.select": "Select",
  "common.type": "Type",
  "common.value": "Value",
  "common.date": "Date",
  "common.time": "Time",
  "common.total": "Total",
  "common.expand": "Expand",
  "common.collapse": "Collapse",
  "common.showMore": "Show more",
  "common.showLess": "Show less",
  "common.learnMore": "Learn more",
  "common.noResults": "No results found",
  "common.dismiss": "Dismiss",
  "common.undo": "Undo",
  "common.continue": "Continue",
  "common.getStarted": "Get started",

  // ---------------------------------------------------------------- sidebar: groups
  "navGroup.AI GATEWAY": "AI Gateway",
  "navGroup.OBSERVABILITY": "Observability",
  "navGroup.ACCESS_CONTROL": "Access Control",
  "navGroup.DEVELOPER TOOLS": "Developer Tools",
  "navGroup.SETTINGS": "Settings",

  // ---------------------------------------------------------------- sidebar: items
  "nav.api-keys": "Virtual Keys",
  "nav.llm-playground": "Playground",
  "nav.models": "Models + Endpoints",
  "nav.agentic": "Agentic",
  "nav.agents": "Agents",
  "nav.workflows": "Workflow Runs",
  "nav.memory": "Memory",
  "nav.mcp-servers": "MCP Servers",
  "nav.skills": "Skills",
  "nav.guardrails": "Guardrails",
  "nav.policies": "Policies",
  "nav.tools": "Tools",
  "nav.search-tools": "Search Tools",
  "nav.vector-stores": "Vector Stores",
  "nav.tool-policies": "Tool Policies",
  "nav.new_usage": "Usage",
  "nav.model-insights": "Model Leaderboard",
  "nav.roi-calculator": "ROI Calculator",
  "nav.cost-optimization": "Cost Optimization",
  "nav.logs": "Logs",
  "nav.lens": "Lens",
  "nav.guardrails-monitor": "Guardrails Monitor",
  "nav.teams": "Teams",
  "nav.projects": "Projects",
  "nav.users": "Internal Users",
  "nav.organizations": "Organizations",
  "nav.access-groups": "Access Groups",
  "nav.budgets": "Budgets",
  "nav.api_ref": "API Reference",
  "nav.model-hub-table": "AI Hub",
  "nav.learning-resources": "Learning Resources",
  "nav.caching": "Response Cache",
  "nav.experimental": "Experimental",
  "nav.prompts": "Prompts",
  "nav.transform-request": "API Playground",
  "nav.tag-management": "Tag Management",
  "nav.4": "Old Usage",
  "nav.settings": "Settings",
  "nav.router-settings": "Router Settings",
  "nav.logging-and-alerts": "Logging & Alerts",
  "nav.admin-panel": "Admin Settings",
  "nav.cost-tracking": "Cost Tracking",
  "nav.ui-theme": "UI Theme",

  // ---------------------------------------------------------------- navbar
  "navbar.expandSidebar": "Expand sidebar",
  "navbar.collapseSidebar": "Collapse sidebar",
  "navbar.docs": "Docs",
  "navbar.blog": "Blog",
  "navbar.notifications": "Notifications",
  "navbar.thanksForUsing": "Thanks for using LiteLLM!",
  "navbar.documentation": "Product documentation",
  "navbar.home": "LiteLLM home",
  "navbar.theme.light": "Switch to light mode",
  "navbar.theme.dark": "Switch to dark mode (beta)",
  "navbar.userMenu": "User menu",
  "navbar.viewSwitcher": "Switch view",
  "navbar.workerSwitcher": "Switch worker",
  "navbar.signOut": "Sign out",

  // ---------------------------------------------------------------- login page
  "login.title": "Login",
  "login.subtitle": "Access your LiteLLM Admin UI.",
  "login.defaultCredentials": "Default Credentials",
  "login.defaultCredPrefix": "By default, Username is",
  "login.defaultCredMiddle": "and Password is your set LiteLLM Proxy",
  "login.needCredentials": "Need to set UI credentials or SSO?",
  "login.checkDocs": "Check the documentation",
  "login.username": "Username",
  "login.usernameRequired": "Please enter your username",
  "login.usernamePlaceholder": "Enter your username",
  "login.password": "Password",
  "login.passwordRequired": "Please enter your password",
  "login.passwordPlaceholder": "Enter your password",
  "login.login": "Login",
  "login.loggingIn": "Logging in...",
  "login.loginWithSso": "Login with SSO",
  "login.ssoNotConfigured": "Please configure SSO to log in with SSO.",
  "login.worker": "Worker",
  "login.chooseWorker": "Choose a worker to connect to",
  "login.adminUIDisabled": "Admin UI Disabled",
  "login.adminUIDisabledBody": "The Admin UI has been disabled by the administrator. To re-enable it, please update the following environment variable:",
  "login.ssoNotice": "Single Sign-On (SSO) is enabled. LiteLLM no longer automatically redirects to the SSO login flow upon loading this page. To re-enable auto-redirect-to-SSO, set",
  "login.ssoNoticeTail": "in your environment configuration.",
  "login.close": "Close",

  // ---------------------------------------------------------------- sidebar usage card
  "sidebarUsage.enterpriseUsage": "Enterprise usage",
  "sidebarUsage.seats": "Seats",
  "sidebarUsage.teams": "Teams",
  "sidebarUsage.activePlan": "Active plan",

  // ---------------------------------------------------------------- user banner
  "userBanner.dismiss": "Dismiss banner",

  // ---------------------------------------------------------------- deprecation banner
  "deprecation.title": "{feature} is on a draft deprecation list",
  "deprecation.body":
    "{feature} is one of several experimental features we're considering removing, potentially as early as {date}. This list is a draft and is not final. If you rely on this feature, please share feedback on the ",
  "deprecation.discussionLink": "deprecation discussion",
  "deprecation.bodySuffix": ".",

  // ---------------------------------------------------------------- license expiry banner
  "licenseExpiry.expiresToday": "expires today",
  "licenseExpiry.expiresInOneDay": "expires in 1 day",
  "licenseExpiry.expiresInDays": "expires in {days} days",
  "licenseExpiry.expiredTitle": "Your LiteLLM Enterprise license expired on {date}",
  "licenseExpiry.countdownTitle": "Your LiteLLM Enterprise license {countdown} ({date})",
  "licenseExpiry.expiredPrefix": "Enterprise features are now disabled. Reach out to ",
  "licenseExpiry.expiredSuffix": " to restore access",
  "licenseExpiry.criticalPrefix": "Renew now to avoid losing enterprise features. Reach out to ",
  "licenseExpiry.criticalSuffix": "",
  "licenseExpiry.warningPrefix": "Renew before it lapses to keep enterprise features. Reach out to ",
  "licenseExpiry.warningSuffix": "",

  // ---------------------------------------------------------------- debug warning banner
  "debugWarning.title": "Performance Warning: Detailed Debug Mode Active",
  "debugWarning.descPrefix": "Detailed debug logging (",
  "debugWarning.descSuffix":
    ") is currently enabled. This mode logs extensive diagnostic information and will significantly degrade performance. It should only be used for troubleshooting and disabled in production environments.",

  // ---------------------------------------------------------------- upgrade banner
  "upgradeBanner.latestPrefix": "The latest version is ",
  "upgradeBanner.latestSuffix": ": {stats}",
  "upgradeBanner.currentVersion": "Your current version is v{version}",
  "upgradeBanner.newFeature": "{count} new feature",
  "upgradeBanner.newFeatures": "{count} new features",
  "upgradeBanner.fix": "{count} fix",
  "upgradeBanner.fixes": "{count} fixes",
  "upgradeBanner.otherUpdate": "{count} other update",
  "upgradeBanner.otherUpdates": "{count} other updates",
  "upgradeBanner.and": "and {rest}",
  "upgradeBanner.listSeparator": ", ",

  // ---------------------------------------------------------------- no redis warning banner
  "noRedis.title": "No Redis configured. Redis is highly recommended",
  "noRedis.bodyPrefix":
    "This proxy is running more than one worker (or the worker count could not be verified). Without Redis, rate limits, budgets, router state, and cache invalidation are per worker, so limits are enforced once per worker and spend can overshoot. ",
  "noRedis.linkText": "See everything that does not work without Redis",
  "noRedis.bodyMiddle": ". Set ",
  "noRedis.bodySuffix": " to hide this banner anyway.",

  // ---------------------------------------------------------------- env credential login warning banner
  "envCredential.title": "Environment-credential login is enabled",
  "envCredential.anyoneWith": "Anyone with ",
  "envCredential.slash": "/",
  "envCredential.orMasterKeyWhen": " (or the master key, when ",
  "envCredential.canSignIn":
    " is unset) can sign in as a proxy admin with a shared static secret. First create a regular admin account with its own password, then set ",
  "envCredential.turnOff": " to turn this login path off.",

  // ---------------------------------------------------------------- delete resource modal
  "common.deleting": "Deleting...",
  "deleteResource.typePrefix": "Type ",
  "deleteResource.typeSuffix": " to confirm deletion:",

  // ---------------------------------------------------------------- default proxy admin tag
  "defaultProxyAdmin.tag": "Default Proxy Admin",

  // ---------------------------------------------------------------- domain batches (parallel i18n effort)
  ...keysEn,
  ...modelsCoreEn,
  ...addModelEn,
  ...mcpEn,
  ...playgroundEn,
  ...promptsEn,
  ...guardrailsEn,
  ...teamsOrgEn,
  ...usageEn,
  ...settingsEn,
  ...sharedUiEn,
  ...lensEn,
  ...agentsSkillsEn,
  ...chatEn,
  ...homeEn,
  ...miscEn,
  ...lensViewsEn,
  ...sharedWidgetsEn,
  ...costAnalyticsEn,
};
