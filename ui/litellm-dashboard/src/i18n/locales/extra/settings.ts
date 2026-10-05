// i18n keys owned by the "settings" domain translation batch (parallel i18n effort).
// Only that batch's agent edits this file. Spread into dictionaries via locales/en.ts and zh.ts.

// ---------------------------------------------------------------- alerting (alerting_settings.tsx, dynamic_form.tsx)
export const en: Record<string, string> = {
  "alerting.waitProxyUpdate": "Wait 10s for proxy to update.",
  "alerting.enterpriseFeature": "✨ Enterprise Feature",
  "alerting.inDb": "In DB",
  "alerting.inConfig": "In Config",
  "alerting.notSet": "Not Set",
  "alerting.resetField": "Reset {name}",
  "alerting.updateSettings": "Update Settings",

  // ------------------------------------------------------- loggingAndAlerts (LoggingCallbacksTable.tsx, LoggingCallbacksTableColumns.tsx)
  "loggingAndAlerts.callbacks.activeTitle": "Active Logging Callbacks",
  "loggingAndAlerts.callbacks.add": "Add Callback",
  "loggingAndAlerts.callbacks.loading": "Loading callbacks…",
  "loggingAndAlerts.callbacks.emptyTitle": "No callbacks configured",
  "loggingAndAlerts.callbacks.emptyDescription": "Add your first callback to start logging data to external services.",
  "loggingAndAlerts.callbacks.columnName": "Callback Name",
  "loggingAndAlerts.callbacks.columnMode": "Mode",
  "loggingAndAlerts.callbacks.modeFailure": "Failure",
  "loggingAndAlerts.callbacks.modeSuccessAndFailure": "Success & Failure",
  "loggingAndAlerts.callbacks.openActions": "Open callback actions",
  "loggingAndAlerts.callbacks.test": "Test",
  "loggingAndAlerts.callbacks.readOnly": "Read only",
  "loggingAndAlerts.callbacks.readOnlyTooltip":
    "Active callback that was not added through the dashboard. Edit it where it was configured.",

  // ------------------------------------------------------- settingsTabs (settings.tsx)
  "settingsTabs.loggingCallbacks": "Logging Callbacks",
  "settingsTabs.cloudzeroCostTracking": "CloudZero Cost Tracking",
  "settingsTabs.alertingTypes": "Alerting Types",
  "settingsTabs.alertingSettings": "Alerting Settings",
  "settingsTabs.emailAlerts": "Email Alerts",
  "settingsTabs.msTeamsAlerts": "MS Teams Alerts",

  // ------------------------------------------------------- settingsCommon (settings.tsx)
  // "Save Changes" intentionally not reusing common.saveChanges ("Save changes") to keep the English byte-identical.
  "settingsCommon.saveChanges": "Save Changes",
  "settingsCommon.adding": "Adding...",
  "settingsCommon.saving": "Saving...",

  // ------------------------------------------------------- settingsAlerts (settings.tsx, Alerting Types tab)
  "settingsAlerts.webhookIntro":
    "Alerts are sent to any Slack-compatible incoming webhook URL (Slack, Rocket.Chat, Mattermost, etc.). Get Slack webhook urls from",
  "settingsAlerts.webhookLink": "here",
  "settingsAlerts.webhookUrlHeader": "Webhook URL (Slack-compatible)",
  "settingsAlerts.types.llmExceptions": "LLM Exceptions",
  "settingsAlerts.types.llmResponsesTooSlow": "LLM Responses Too Slow",
  "settingsAlerts.types.llmRequestsHanging": "LLM Requests Hanging",
  "settingsAlerts.types.budgetAlerts": "Budget Alerts (API Keys, Users)",
  "settingsAlerts.types.userSpendThresholds": "User Spend Thresholds (Daily/Monthly)",
  "settingsAlerts.types.userSpendAnomalies": "User Spend Anomaly Detection",
  "settingsAlerts.types.dbExceptions": "Database Exceptions (Read/Write)",
  "settingsAlerts.types.spendReports": "Weekly/Monthly Spend Reports",
  "settingsAlerts.types.outageAlerts": "Outage Alerts",
  "settingsAlerts.types.regionOutageAlerts": "Region Outage Alerts",
  "settingsAlerts.types.modelDeprecationWarnings": "Model Deprecation Warnings",
  "settingsAlerts.updatedSuccess": "Alerts updated successfully",
  "settingsAlerts.testTriggered":
    "Alert test triggered. Test request to slack made - check logs/alerts on slack to verify",
  "settingsAlerts.testButton": "Test Alerts",

  // ------------------------------------------------------- settingsCallback (settings.tsx, callback modals)
  "settingsCallback.label": "Callback",
  "settingsCallback.choosePlaceholder": "Choose a logging callback...",
  // Not common.noResults ("No results found") - that would change the existing English copy.
  "settingsCallback.noResults": "No results",
  "settingsCallback.selectRequired": "Please select a callback",
  "settingsCallback.requiredField": "Please enter the {name}",
  "settingsCallback.selectPlaceholder": "Select {name}",
  "settingsCallback.enterPlaceholder": "Enter {name}",
  "settingsCallback.enterYourPlaceholder": "Enter your {name}",
  "settingsCallback.docsLink": "LiteLLM Docs: Logging",
  "settingsCallback.addDialogTitle": "Add Logging Callback",
  "settingsCallback.editDialogTitle": "Edit Callback Settings",
  "settingsCallback.healthCheckTriggered": "Health check triggered",
  "settingsCallback.addedSuccess": "Callback {name} added successfully",
  "settingsCallback.updatedSuccess": "Callback updated successfully",
  "settingsCallback.deletedSuccess": "Callback {name} deleted successfully",
  "settingsCallback.loadConfigsError": "Failed to load callback configs: {message}",
  "settingsCallback.deleteDialogTitle": "Delete Callback",
  "settingsCallback.deleteDialogMessage":
    "Are you sure you want to delete this callback? This action cannot be undone.",
  "settingsCallback.deleteInfoTitle": "Callback Information",

  // -------------------------------------------------- app/(dashboard)/change-password/ChangePasswordForm.tsx
  "changePassword.title": "Change Password",
  "changePassword.description":
    "Enter your current password and choose a new one. The new password must meet this proxy's password policy.",
  "changePassword.mustChangeWarning":
    "Your password must be changed before you can use the dashboard: it was either found in a known data breach or set by an administrator as a temporary password. After updating it, you will be signed out to log in again.",
  "changePassword.currentPassword": "Current Password",
  "changePassword.newPassword": "New Password",
  "changePassword.confirmNewPassword": "Confirm New Password",
  "changePassword.submit": "Change Password",
  "changePassword.required_current": "Current password is required",
  "changePassword.required_new": "New password is required",
  "changePassword.required_confirm": "Confirm your new password",
  "changePassword.mismatch": "New passwords do not match",
  "changePassword.toast.updated": "Password updated",
  "changePassword.toast.updatedRelogin": "Password updated. Please log in with your new password.",
};

export const zh: Record<string, string> = {
  "alerting.waitProxyUpdate": "请等待 10 秒让代理更新。",
  "alerting.enterpriseFeature": "✨ 企业版功能",
  "alerting.inDb": "存于数据库",
  "alerting.inConfig": "存于配置",
  "alerting.notSet": "未设置",
  "alerting.resetField": "重置 {name}",
  "alerting.updateSettings": "更新设置",

  // ------------------------------------------------------- loggingAndAlerts (LoggingCallbacksTable.tsx, LoggingCallbacksTableColumns.tsx)
  "loggingAndAlerts.callbacks.activeTitle": "已启用的日志回调",
  "loggingAndAlerts.callbacks.add": "添加回调",
  "loggingAndAlerts.callbacks.loading": "正在加载回调…",
  "loggingAndAlerts.callbacks.emptyTitle": "尚未配置回调",
  "loggingAndAlerts.callbacks.emptyDescription": "添加第一个回调，即可把日志数据发送到外部服务。",
  "loggingAndAlerts.callbacks.columnName": "回调名称",
  "loggingAndAlerts.callbacks.columnMode": "模式",
  "loggingAndAlerts.callbacks.modeFailure": "失败",
  "loggingAndAlerts.callbacks.modeSuccessAndFailure": "成功与失败",
  "loggingAndAlerts.callbacks.openActions": "打开回调操作菜单",
  "loggingAndAlerts.callbacks.test": "测试",
  "loggingAndAlerts.callbacks.readOnly": "只读",
  "loggingAndAlerts.callbacks.readOnlyTooltip": "该回调不是通过控制台添加的，请回到它原本配置的位置进行修改。",

  // ------------------------------------------------------- settingsTabs (settings.tsx)
  "settingsTabs.loggingCallbacks": "日志回调",
  "settingsTabs.cloudzeroCostTracking": "CloudZero 成本追踪",
  "settingsTabs.alertingTypes": "告警类型",
  "settingsTabs.alertingSettings": "告警设置",
  "settingsTabs.emailAlerts": "邮件告警",
  "settingsTabs.msTeamsAlerts": "MS Teams 告警",

  // ------------------------------------------------------- settingsCommon (settings.tsx)
  "settingsCommon.saveChanges": "保存更改",
  "settingsCommon.adding": "添加中...",
  "settingsCommon.saving": "保存中...",

  // ------------------------------------------------------- settingsAlerts (settings.tsx, Alerting Types tab)
  "settingsAlerts.webhookIntro":
    "告警会发送到任何兼容 Slack 的 incoming webhook URL（Slack、Rocket.Chat、Mattermost 等）。获取 Slack webhook 地址请前往",
  "settingsAlerts.webhookLink": "这里",
  "settingsAlerts.webhookUrlHeader": "Webhook URL（兼容 Slack）",
  "settingsAlerts.types.llmExceptions": "LLM 异常",
  "settingsAlerts.types.llmResponsesTooSlow": "LLM 响应过慢",
  "settingsAlerts.types.llmRequestsHanging": "LLM 请求挂起",
  "settingsAlerts.types.budgetAlerts": "预算告警（API Key、用户）",
  "settingsAlerts.types.userSpendThresholds": "用户花费阈值（每日/每月）",
  "settingsAlerts.types.userSpendAnomalies": "用户花费异常检测",
  "settingsAlerts.types.dbExceptions": "数据库异常（读/写）",
  "settingsAlerts.types.spendReports": "每周/每月花费报告",
  "settingsAlerts.types.outageAlerts": "服务中断告警",
  "settingsAlerts.types.regionOutageAlerts": "区域中断告警",
  "settingsAlerts.types.modelDeprecationWarnings": "模型弃用警告",
  "settingsAlerts.updatedSuccess": "告警配置更新成功",
  "settingsAlerts.testTriggered": "告警测试已触发。已向 Slack 发送测试请求 - 请在 Slack 的日志/告警中确认结果",
  "settingsAlerts.testButton": "测试告警",

  // ------------------------------------------------------- settingsCallback (settings.tsx, callback modals)
  "settingsCallback.label": "回调",
  "settingsCallback.choosePlaceholder": "选择一个日志回调...",
  "settingsCallback.noResults": "无结果",
  "settingsCallback.selectRequired": "请选择一个回调",
  "settingsCallback.requiredField": "请输入 {name}",
  "settingsCallback.selectPlaceholder": "请选择 {name}",
  "settingsCallback.enterPlaceholder": "请输入 {name}",
  "settingsCallback.enterYourPlaceholder": "请输入你的 {name}",
  "settingsCallback.docsLink": "LiteLLM 文档：日志",
  "settingsCallback.addDialogTitle": "添加日志回调",
  "settingsCallback.editDialogTitle": "编辑回调设置",
  "settingsCallback.healthCheckTriggered": "健康检查已触发",
  "settingsCallback.addedSuccess": "回调 {name} 添加成功",
  "settingsCallback.updatedSuccess": "回调更新成功",
  "settingsCallback.deletedSuccess": "回调 {name} 删除成功",
  "settingsCallback.loadConfigsError": "加载回调配置失败：{message}",
  "settingsCallback.deleteDialogTitle": "删除回调",
  "settingsCallback.deleteDialogMessage": "确定要删除这个回调吗？此操作无法撤销。",
  "settingsCallback.deleteInfoTitle": "回调信息",

  // -------------------------------------------------- app/(dashboard)/change-password/ChangePasswordForm.tsx
  "changePassword.title": "修改密码",
  "changePassword.description": "请输入当前密码并设置新密码。新密码必须满足此代理的密码策略。",
  "changePassword.mustChangeWarning":
    "您必须先修改密码才能使用仪表盘：该密码要么出现在已知的数据泄露中，要么由管理员设置为临时密码。更新后您将被登出并需要重新登录。",
  "changePassword.currentPassword": "当前密码",
  "changePassword.newPassword": "新密码",
  "changePassword.confirmNewPassword": "确认新密码",
  "changePassword.submit": "修改密码",
  "changePassword.required_current": "请输入当前密码",
  "changePassword.required_new": "请输入新密码",
  "changePassword.required_confirm": "请确认新密码",
  "changePassword.mismatch": "两次输入的新密码不一致",
  "changePassword.toast.updated": "密码已更新",
  "changePassword.toast.updatedRelogin": "密码已更新，请使用新密码重新登录。",
};
