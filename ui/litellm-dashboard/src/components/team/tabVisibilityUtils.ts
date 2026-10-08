/**
 * Team info tab configuration and permission logic.
 * Extracted for testability - permission rules can be unit tested in isolation.
 */
import { DEFAULT_LANGUAGE, translate, type Translate } from "@/i18n";

export const TEAM_INFO_TAB_KEYS = {
  OVERVIEW: "overview",
  MY_USER: "my-user",
  VIRTUAL_KEYS: "virtual-keys",
  MEMBERS: "members",
  MEMBER_PERMISSIONS: "member-permissions",
  SETTINGS: "settings",
} as const;

const TEAM_INFO_TAB_LABEL_KEYS: Record<string, string> = {
  [TEAM_INFO_TAB_KEYS.OVERVIEW]: "teamSettings.tab.overview",
  [TEAM_INFO_TAB_KEYS.MY_USER]: "teamSettings.tab.myUser",
  [TEAM_INFO_TAB_KEYS.VIRTUAL_KEYS]: "teamSettings.tab.virtualKeys",
  [TEAM_INFO_TAB_KEYS.MEMBERS]: "teamSettings.tab.members",
  [TEAM_INFO_TAB_KEYS.MEMBER_PERMISSIONS]: "teamSettings.tab.memberPermissions",
  [TEAM_INFO_TAB_KEYS.SETTINGS]: "teamSettings.tab.settings",
};

export const teamInfoTabLabel = (
  tabKey: string,
  t: Translate = (key, params) => translate(DEFAULT_LANGUAGE, key, params),
): string => t(TEAM_INFO_TAB_LABEL_KEYS[tabKey] ?? tabKey);

/**
 * Returns the list of tab keys that should be visible based on permissions.
 * - Overview, My User, Virtual Keys: always visible
 * - Members, Member Permissions, Settings: only when canEditTeam is true
 */
export function getTeamInfoVisibleTabs(canEditTeam: boolean): readonly string[] {
  const baseTabs = [TEAM_INFO_TAB_KEYS.OVERVIEW, TEAM_INFO_TAB_KEYS.MY_USER, TEAM_INFO_TAB_KEYS.VIRTUAL_KEYS];
  if (canEditTeam) {
    return [
      ...baseTabs,
      TEAM_INFO_TAB_KEYS.MEMBERS,
      TEAM_INFO_TAB_KEYS.MEMBER_PERMISSIONS,
      TEAM_INFO_TAB_KEYS.SETTINGS,
    ];
  }
  return baseTabs;
}

/**
 * Returns the default active tab key based on permissions and edit intent.
 * - When editTeam is true and user can edit: open Settings tab
 * - Otherwise: open Overview tab
 */
export function getTeamInfoDefaultTab(editTeam: boolean, canEditTeam: boolean): string {
  if (editTeam && canEditTeam) {
    return TEAM_INFO_TAB_KEYS.SETTINGS;
  }
  return TEAM_INFO_TAB_KEYS.OVERVIEW;
}

/**
 * Checks if a specific tab should be visible based on permissions.
 */
export function isTeamInfoTabVisible(tabKey: string, canEditTeam: boolean): boolean {
  const visibleTabs = getTeamInfoVisibleTabs(canEditTeam);
  return visibleTabs.includes(tabKey);
}
