import { DEFAULT_LANGUAGE, translate, type Translate } from "@/i18n";

export interface PermissionInfo {
  method: string;
  endpoint: string;
  description: string;
  route: string;
}

const defaultTranslate: Translate = (key, params) => translate(DEFAULT_LANGUAGE, key, params);

/**
 * Map of permission endpoint patterns to the i18n key of their description
 */
export const PERMISSION_DESCRIPTION_KEYS: Record<string, string> = {
  "/auto_router/manage": "teamSettings.permissionDesc.autoRouterManage",
  "/key/generate": "teamSettings.permissionDesc.keyGenerate",
  "/key/service-account/generate": "teamSettings.permissionDesc.keyServiceAccountGenerate",
  "/key/update": "teamSettings.permissionDesc.keyUpdate",
  "/key/delete": "teamSettings.permissionDesc.keyDelete",
  "/key/info": "teamSettings.permissionDesc.keyInfo",
  "/key/regenerate": "teamSettings.permissionDesc.keyRegenerate",
  "/key/{key_id}/regenerate": "teamSettings.permissionDesc.keyRegenerate",
  "/key/list": "teamSettings.permissionDesc.keyList",
  "/key/block": "teamSettings.permissionDesc.keyBlock",
  "/key/unblock": "teamSettings.permissionDesc.keyUnblock",
  "/key/access_group_assignment": "teamSettings.permissionDesc.keyAccessGroupAssignment",
  "/team/daily/activity": "teamSettings.permissionDesc.teamDailyActivity",
  "/spend/logs": "teamSettings.permissionDesc.spendLogs",
};

/**
 * Determines the HTTP method for a given permission endpoint
 */
export const getMethodForEndpoint = (endpoint: string): string => {
  if (
    endpoint.includes("/info") ||
    endpoint.includes("/list") ||
    endpoint.includes("/activity") ||
    endpoint === "/spend/logs"
  ) {
    return "GET";
  }
  return "POST";
};

export const permissionDescription = (endpoint: string, t: Translate = defaultTranslate): string =>
  t(PERMISSION_DESCRIPTION_KEYS[endpoint] ?? "teamSettings.permissionDesc.fallback", { permission: endpoint });

/**
 * Parses a permission string into a structured PermissionInfo object
 */
export const getPermissionInfo = (permission: string, t: Translate = defaultTranslate): PermissionInfo => {
  const method = getMethodForEndpoint(permission);
  const endpoint = permission;

  // Find exact match or fall back to a partial match based on patterns
  const match = Object.keys(PERMISSION_DESCRIPTION_KEYS).find((pattern) => permission.includes(pattern));

  return {
    method,
    endpoint,
    description: permissionDescription(match ?? endpoint, t),
    route: permission,
  };
};
