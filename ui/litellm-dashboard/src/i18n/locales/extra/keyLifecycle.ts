// i18n keys owned by the "key lifecycle" translation batch (parallel i18n effort).
// KeyLifecycleSettings is shared by the key create and key edit views, so its strings
// live in their own neutral namespace rather than keyCreate/keyEdit.
// Only that batch's agent edits this file. Spread into dictionaries via locales/en.ts and zh.ts.

export const en: Record<string, string> = {
  "keyLifecycle.expirySettings": "Key Expiry Settings",
  "keyLifecycle.expireKey": "Expire Key",
  "keyLifecycle.expireKeyHint":
    "Set when this key should expire. Format: 30s (seconds), 30m (minutes), 30h (hours), 30d (days). Leave empty to keep the current expiry unchanged.",
  "keyLifecycle.neverExpire": "Never Expire",
  "keyLifecycle.durationPlaceholderCreate": "e.g., 30d or leave empty to never expire",
  "keyLifecycle.durationPlaceholderEdit": "e.g., 30d",
  "keyLifecycle.autoRotationSettings": "Auto-Rotation Settings",
  "keyLifecycle.enableAutoRotation": "Enable Auto-Rotation",
  "keyLifecycle.enableAutoRotationHint":
    "Key will automatically regenerate at the specified interval for enhanced security.",
  "keyLifecycle.rotationInterval": "Rotation Interval",
  "keyLifecycle.rotationIntervalHint":
    "How often the key should be automatically rotated. Choose the interval that best fits your security requirements.",
  "keyLifecycle.selectInterval": "Select interval",
  "keyLifecycle.interval.7d": "7 days",
  "keyLifecycle.interval.30d": "30 days",
  "keyLifecycle.interval.90d": "90 days",
  "keyLifecycle.interval.180d": "180 days",
  "keyLifecycle.interval.365d": "365 days",
  "keyLifecycle.interval.custom": "Custom interval",
  "keyLifecycle.customIntervalPlaceholder": "e.g., 1s, 5m, 2h, 14d",
  "keyLifecycle.supportedFormats": "Supported formats: seconds (s), minutes (m), hours (h), days (d)",
  "keyLifecycle.rotationNotice":
    "When rotation occurs, you'll receive a notification with the new key. The old key will be deactivated after a brief grace period.",
};

export const zh: Record<string, string> = {
  "keyLifecycle.expirySettings": "密钥过期设置",
  "keyLifecycle.expireKey": "密钥过期时间",
  "keyLifecycle.expireKeyHint":
    "设置该密钥的过期时间。格式：30s（秒）、30m（分钟）、30h（小时）、30d（天）。留空则保持当前过期时间不变。",
  "keyLifecycle.neverExpire": "永不过期",
  "keyLifecycle.durationPlaceholderCreate": "例如 30d，或留空表示永不过期",
  "keyLifecycle.durationPlaceholderEdit": "例如 30d",
  "keyLifecycle.autoRotationSettings": "自动轮换设置",
  "keyLifecycle.enableAutoRotation": "启用自动轮换",
  "keyLifecycle.enableAutoRotationHint": "密钥会在指定间隔自动重新生成，以提升安全性。",
  "keyLifecycle.rotationInterval": "轮换间隔",
  "keyLifecycle.rotationIntervalHint": "密钥自动轮换的频率。请选择最符合你安全要求的间隔。",
  "keyLifecycle.selectInterval": "选择间隔",
  "keyLifecycle.interval.7d": "7 天",
  "keyLifecycle.interval.30d": "30 天",
  "keyLifecycle.interval.90d": "90 天",
  "keyLifecycle.interval.180d": "180 天",
  "keyLifecycle.interval.365d": "365 天",
  "keyLifecycle.interval.custom": "自定义间隔",
  "keyLifecycle.customIntervalPlaceholder": "例如 1s、5m、2h、14d",
  "keyLifecycle.supportedFormats": "支持的格式：秒（s）、分钟（m）、小时（h）、天（d）",
  "keyLifecycle.rotationNotice":
    "轮换发生时，你会收到包含新密钥的通知。旧密钥会在短暂的宽限期后停用。",
};
