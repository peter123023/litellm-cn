// i18n keys owned by the "mcp" domain translation batch (parallel i18n effort).
// Only that batch's agent edits this file. Spread into dictionaries via locales/en.ts and zh.ts.

export const en: Record<string, string> = {
  // -------------------------------------------------- components/mcp_server_management/MCPServerSelector.tsx
  "mcpServers.selectServers": "Select MCP servers",
  "mcpServers.accessGroup": "Access Group",
  "mcpServers.mcpServer": "MCP Server",
  "mcpServers.toolset": "Toolset",
  "mcpServers.allProxyServers": "All Proxy MCP Servers",
  "mcpServers.noServers": "No MCP Servers",
  "mcpServers.blockAll": "Block all",
  "mcpServers.noServersFound": "No MCP servers found",

  // -------------------------------------------------- components/mcp_server_management/MCPToolPermissions.tsx
  "mcpToolPermissions.viaAccessGroup": "Via access group: {name}",
  "mcpToolPermissions.viaToolset": "Via toolset: {name}",
  "mcpToolPermissions.viaToolPermissions": "Via tool permissions",
  "mcpToolPermissions.failedToFetchTools": "Failed to fetch tools",
  "mcpToolPermissions.unableToLoadServers": "Unable to load MCP servers",
  "mcpToolPermissions.incompleteServerList":
    "This list is incomplete; servers granted directly or through an access group may be missing. Reload before changing tool permissions",
  "mcpToolPermissions.emptyAccessGroup": 'Access group "{group}" has 0 servers',
  "mcpToolPermissions.emptyAccessGroupBody1":
    "No MCP server lists this group, so it grants nothing. A server defined in config.yaml joins a group through its",
  "mcpToolPermissions.emptyAccessGroupBody2": "key;",
  "mcpToolPermissions.emptyAccessGroupBody3": "is ignored there",
  "mcpToolPermissions.unableToLoadToolsets": "Unable to load toolsets",
  "mcpToolPermissions.toolsetServersMissing": "Servers reached through the selected toolsets are not listed below",
  "mcpToolPermissions.loadingServers": "Loading MCP servers...",
  "mcpToolPermissions.allToolsAllowed": "All tools allowed, including tools added to this server later",
  "mcpToolPermissions.ambiguousGrant":
    "Also granted by {keys}, which names another server too. Those tools stay allowed here until the servers no longer share that name",
  "mcpToolPermissions.toolsetGrantedOne":
    "{name} is granted by a selected toolset, so it stays allowed here; edit the toolset to revoke it",
  "mcpToolPermissions.toolsetGrantedMany":
    "{names} are granted by a selected toolset, so they stay allowed here; edit the toolset to revoke them",
  "mcpToolPermissions.riskGroups": "Risk Groups",
  "mcpToolPermissions.flatList": "Flat List",
  "mcpToolPermissions.selectAll": "Select All",
  "mcpToolPermissions.deselectAll": "Deselect All",
  "mcpToolPermissions.loadingTools": "Loading tools...",
  "mcpToolPermissions.unableToLoadTools": "Unable to load tools",
  "mcpToolPermissions.noTools": "No tools available",

  // -------------------------------------------------- shared
  "mcp.noDescription": "No description",
};

export const zh: Record<string, string> = {
  // -------------------------------------------------- components/mcp_server_management/MCPServerSelector.tsx
  "mcpServers.selectServers": "选择 MCP 服务器",
  "mcpServers.accessGroup": "访问组",
  "mcpServers.mcpServer": "MCP 服务器",
  "mcpServers.toolset": "工具集",
  "mcpServers.allProxyServers": "所有代理 MCP 服务器",
  "mcpServers.noServers": "无 MCP 服务器",
  "mcpServers.blockAll": "全部阻止",
  "mcpServers.noServersFound": "未找到 MCP 服务器",

  // -------------------------------------------------- components/mcp_server_management/MCPToolPermissions.tsx
  "mcpToolPermissions.viaAccessGroup": "通过访问组：{name}",
  "mcpToolPermissions.viaToolset": "通过工具集：{name}",
  "mcpToolPermissions.viaToolPermissions": "通过工具权限",
  "mcpToolPermissions.failedToFetchTools": "获取工具失败",
  "mcpToolPermissions.unableToLoadServers": "无法加载 MCP 服务器",
  "mcpToolPermissions.incompleteServerList":
    "此列表不完整；直接授予或通过访问组授予的服务器可能缺失。更改工具权限前请先重新加载",
  "mcpToolPermissions.emptyAccessGroup": "访问组“{group}”有 0 台服务器",
  "mcpToolPermissions.emptyAccessGroupBody1": "没有 MCP 服务器列出此组，因此它不授予任何权限。在 config.yaml 中定义的服务器通过其",
  "mcpToolPermissions.emptyAccessGroupBody2": "键加入组；",
  "mcpToolPermissions.emptyAccessGroupBody3": "在此处会被忽略",
  "mcpToolPermissions.unableToLoadToolsets": "无法加载工具集",
  "mcpToolPermissions.toolsetServersMissing": "通过所选工具集可达的服务器未在下方列出",
  "mcpToolPermissions.loadingServers": "正在加载 MCP 服务器...",
  "mcpToolPermissions.allToolsAllowed": "允许所有工具，包括之后添加到此服务器的工具",
  "mcpToolPermissions.ambiguousGrant":
    "同时由 {keys} 授予，该键也指向另一台服务器。在这些服务器不再共用该名称之前，这些工具将保持允许状态",
  "mcpToolPermissions.toolsetGrantedOne": "{name} 由所选工具集授予，因此在此处保持允许；编辑该工具集即可撤销",
  "mcpToolPermissions.toolsetGrantedMany": "{names} 由所选工具集授予，因此在此处保持允许；编辑该工具集即可撤销",
  "mcpToolPermissions.riskGroups": "风险分组",
  "mcpToolPermissions.flatList": "平铺列表",
  "mcpToolPermissions.selectAll": "全选",
  "mcpToolPermissions.deselectAll": "全部取消",
  "mcpToolPermissions.loadingTools": "正在加载工具...",
  "mcpToolPermissions.unableToLoadTools": "无法加载工具",
  "mcpToolPermissions.noTools": "无可用工具",

  // -------------------------------------------------- shared
  "mcp.noDescription": "无描述",
};
