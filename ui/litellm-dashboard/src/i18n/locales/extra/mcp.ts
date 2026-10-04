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

  // -------------------------------------------------- mcp-servers/_components/CreateMCPServer.tsx
  "mcp.create.title": "Add New MCP Server",
  "mcp.create.submitTitle": "Submit MCP Server for Review",
  "mcp.create.reviewBanner":
    "Your submission will be sent for admin review. Once approved, the server will appear in your MCP Servers list. The request must be made with a team-scoped API key.",
  "mcp.create.addServer": "Add MCP Server",
  "mcp.create.creating": "Creating...",
  "mcp.create.success": "MCP Server created successfully",
  "mcp.create.submitted": "MCP Server submitted for admin review",
  "mcp.create.submittedDescription": "Once an admin approves it, the server will appear in your MCP Servers list.",
  "mcp.create.errorCreating": "Error creating MCP Server: {reason}",
  "mcp.create.errorSubmitting": "Error submitting MCP Server: {reason}",
  "mcp.create.oauthSuccess":
    "OAuth authorization successful! Please click 'Create MCP Server' to save the configuration.",
  "mcp.create.tokenHeld":
    "Token held for this browser session. Tools can now be previewed and configured; the token is not saved to LiteLLM.",
  "mcp.create.invalidToolDisplayName":
    'Tool display name "{name}" is invalid. Only letters, digits, underscores, and hyphens are allowed (no spaces).',
  "mcp.create.invalidStdioJson": "Invalid JSON in stdio configuration",
  "mcp.create.invalidTokenValidationJson": "Invalid JSON in Token Validation Rules",

  // -------------------------------------------------- mcp-servers/_components/EnvVarsSection.tsx
  "mcp.env.variables": "Variables",
  "mcp.env.variablesTooltip": "Define variables you can interpolate in Static Headers or Authentication using",
  "mcp.env.scopeInstance": "Instance",
  "mcp.env.scopeInstanceTooltip": "admin-defined value used for every user.",
  "mcp.env.scopePerUser": "Per-user",
  "mcp.env.scopePerUserTooltip":
    "each user supplies their own value (e.g. personal credentials) via the MCP Gateway dashboard.",
  "mcp.env.referenceHelp": "Reference these in Static Headers or Authentication as",
  "mcp.env.referenceExample": "For example:",
  "mcp.env.variableName": "Variable Name",
  "mcp.env.valueOrDescription": "Value / Description",
  "mcp.env.scope": "Scope",
  "mcp.env.addVariable": "Add Variable",
  "mcp.env.nameRequired": "Variable name is required",
  "mcp.env.namePattern": "Use letters, digits, underscores; cannot start with a digit.",
  "mcp.env.namePlaceholder": "e.g. DB_PROTOCOL",
  "mcp.env.hint": "Hint",
  "mcp.env.hintTooltip":
    "Per-user variables have no shared value. This text is only a hint shown to each user when they fill in their own value.",
  "mcp.env.descriptionPlaceholder": "e.g. Your DB username",
  "mcp.env.valuePlaceholder": "e.g. postgresql",

  // -------------------------------------------------- mcp-servers/_components/AwsSigV4Fields.tsx
  "mcp.form.awsSigv4.intro": "For MCP servers hosted on AWS Bedrock AgentCore.",
  "mcp.form.awsSigv4.region": "AWS Region",
  "mcp.form.awsSigv4.regionTooltip": "AWS region for SigV4 signing (e.g., us-east-1)",
  "mcp.form.awsSigv4.regionRequired": "AWS region is required for SigV4 auth",
  "mcp.form.awsSigv4.serviceName": "AWS Service Name",
  "mcp.form.awsSigv4.serviceNameTooltip": "AWS service name for SigV4 signing. Defaults to 'bedrock-agentcore'.",
  "mcp.form.awsSigv4.accessKeyId": "AWS Access Key ID",
  "mcp.form.awsSigv4.accessKeyIdTooltip":
    "Optional. If not provided, falls back to the boto3 credential chain (IAM role, env vars, etc.).",
  "mcp.form.awsSigv4.accessKeyIdRequired": "Access Key ID is required when Secret Access Key is provided",
  "mcp.form.awsSigv4.accessKeyIdPlaceholder": "AKIA... (optional — uses IAM role if blank)",
  "mcp.form.awsSigv4.secretAccessKey": "AWS Secret Access Key",
  "mcp.form.awsSigv4.secretAccessKeyTooltip": "Optional. Required if AWS Access Key ID is provided.",
  "mcp.form.awsSigv4.secretAccessKeyRequired": "Secret Access Key is required when Access Key ID is provided",
  "mcp.form.awsSigv4.secretAccessKeyPlaceholder": "Enter secret key (optional — uses IAM role if blank)",
  "mcp.form.awsSigv4.sessionToken": "AWS Session Token",
  "mcp.form.awsSigv4.sessionTokenTooltip": "Optional. Only needed for temporary STS credentials.",
  "mcp.form.awsSigv4.sessionTokenPlaceholder": "Enter session token (optional)",
  "mcp.form.awsSigv4.roleArn": "AWS Role ARN",
  "mcp.form.awsSigv4.roleArnTooltip":
    "Optional. IAM role ARN to assume via STS before signing. If set, LiteLLM calls sts:AssumeRole to get temporary credentials. Uses ambient credentials (IAM role, env vars) as the source identity unless explicit keys are also provided.",
  "mcp.form.awsSigv4.roleArnPlaceholder": "arn:aws:iam::123456789012:role/MyRole (optional)",
  "mcp.form.awsSigv4.sessionName": "AWS Session Name",
  "mcp.form.awsSigv4.sessionNameTooltip":
    "Optional. Session name for the AssumeRole call — appears in CloudTrail logs. Auto-generated if omitted.",
  "mcp.form.awsSigv4.sessionNamePlaceholder": "litellm-prod (optional, auto-generated if blank)",

  // -------------------------------------------------- mcp-servers/_components/OpenApiByokFields.tsx
  "mcp.form.byok": "BYOK (Bring Your Own Key)",
  "mcp.form.byokTooltip":
    "When enabled, each user provides their own API key for this service. Keys are stored per-user and never shared.",
  "mcp.form.byokUserKeysSentAs": "User keys will be sent as:",
  "mcp.form.byokSetAuthType": "Set the",
  "mcp.form.byokAuthTypeName": "Authentication Type",
  "mcp.form.byokSetAuthTypeHint": "below to specify how user keys are sent (e.g., Bearer Token, API Key header).",
  "mcp.form.byokAccessDescription": "Access Description",
  "mcp.form.byokAccessDescriptionTooltip":
    "List of permissions shown to users in the connection modal (e.g. 'Create and manage Jira issues')",
  "mcp.form.byokAccessDescriptionPlaceholder": "Add access description items (press Enter after each)",
  "mcp.form.byokHelpUrl": "API Key Help URL",
  "mcp.form.byokHelpUrlTooltip": "Optional link shown to users to help them find their API key",

  // -------------------------------------------------- mcp-servers/_components/DcrBridgeToggle.tsx
  "mcp.form.dcrBridge": "Gateway-hosted sign-in (DCR bridge)",
  "mcp.form.dcrBridgeTooltip":
    "Lets OAuth-only clients like Claude Desktop register and sign in through the gateway. Turn off to relay the upstream server's own OAuth metadata instead (for clients pre-registered with the upstream IdP).",

  // -------------------------------------------------- mcp-servers/_components/TokenEndpointAuthMethodField.tsx
  "mcp.form.tokenEndpointAuthMethod": "Token Endpoint Auth Method (optional)",
  "mcp.form.tokenEndpointAuthMethodTooltip":
    "How the proxy authenticates to the upstream OAuth token endpoint. Client Secret Basic sends the client credentials in an HTTP Basic Authorization header; leave blank to use the default, Client Secret Post, which sends them in the request body.",
  "mcp.form.tokenEndpointAuthMethod.clientSecretBasic": "Client Secret Basic",
  "mcp.form.tokenEndpointAuthMethod.clientSecretPost": "Client Secret Post",
  "mcp.form.tokenEndpointAuthMethodKeepExisting": "Leave blank to keep existing (default Client Secret Post)",
  "mcp.form.tokenEndpointAuthMethodDefault": "Default (Client Secret Post)",

  // -------------------------------------------------- mcp-servers/_components/UpstreamTokenHeaderField.tsx
  "mcp.form.tokenHeader": "Token Header (optional)",
  "mcp.form.tokenHeaderTooltip":
    "Which upstream header carries the token LiteLLM resolves for this server. Leave blank to send it as 'Authorization: Bearer <token>', which is the default and what most servers expect. Set a header name when the upstream expects it elsewhere, for example an API gateway that terminates its own credential on 'esb-oauth' while a separate Authorization from Static Headers passes through to the server behind it.",

  // -------------------------------------------------- mcp-servers/_components/TokenExchangeFormFields.tsx
  "mcp.form.profile": "Profile",
  "mcp.form.profileTooltip":
    "Token-exchange wire dialect. RFC 8693 is the standard token-exchange grant. Microsoft Entra OBO uses Entra's On-Behalf-Of dialect (the RFC 7523 jwt-bearer grant with requested_token_use=on_behalf_of) and carries the target resource in a scope like api://<app-id>/.default.",
  "mcp.form.tokenExchangeProfile.rfc8693": "RFC 8693 (standard)",
  "mcp.form.tokenExchangeProfile.entraObo": "Microsoft Entra OBO",
  "mcp.form.tokenExchangeEndpoint": "Token Exchange Endpoint (optional)",
  "mcp.form.tokenExchangeEndpointTooltip":
    "RFC 8693 token endpoint. The proxy exchanges the user's incoming token here for a scoped token used to call the upstream MCP server. Leave blank to auto-discover it from the upstream's protected-resource metadata (RFC 9728 then RFC 8414).",
  "mcp.form.tokenExchange.clientIdTooltip": "OAuth2 client ID used to authenticate to the token exchange endpoint.",
  "mcp.form.tokenExchange.clientIdRequired": "Client ID is required for token exchange",
  "mcp.form.tokenExchange.clientSecretTooltip":
    "OAuth2 client secret used to authenticate to the token exchange endpoint.",
  "mcp.form.tokenExchange.clientSecretRequired": "Client Secret is required for token exchange",
  "mcp.form.tokenExchange.audience": "Audience (optional)",
  "mcp.form.tokenExchange.audienceTooltip":
    "Target audience for the exchanged token (RFC 8693 audience). Identifies the upstream MCP server the token is for.",
  "mcp.form.tokenExchange.subjectTokenType": "Subject Token Type (optional)",
  "mcp.form.tokenExchange.subjectTokenTypeTooltip":
    "Type of the user's incoming token (RFC 8693 subject_token_type). Defaults to urn:ietf:params:oauth:token-type:access_token.",
  "mcp.form.scopes": "Scopes",
  "mcp.form.scopesOptional": "Scopes (optional)",
  "mcp.form.tokenExchange.entraScopesTooltip":
    "Microsoft Entra OBO carries the target resource in the scope, so at least one is required (e.g. api://<app-id>/.default).",
  "mcp.form.tokenExchange.scopesTooltip": "Optional scopes to request during the token exchange.",
  "mcp.form.tokenExchange.entraScopesRequired": "Microsoft Entra OBO requires a scope, e.g. api://<app-id>/.default",
  "mcp.form.addScopes": "Add scopes",
  "mcp.form.leaveBlankToKeepExisting": " (leave blank to keep existing)",

  // -------------------------------------------------- mcp-servers/_components/IdJagFormFields.tsx
  "mcp.form.oauth.clientId": "Client ID",
  "mcp.form.oauth.clientIdPlaceholder": "Enter OAuth client ID",
  "mcp.form.oauth.clientSecret": "Client Secret",
  "mcp.form.oauth.clientSecretPlaceholder": "Enter OAuth client secret",
  "mcp.form.idJag.orgTokenEndpoint": "Org Token Endpoint (leg 1)",
  "mcp.form.idJag.orgTokenEndpointTooltip":
    "Your IdP org authorization server's token endpoint. LiteLLM exchanges the user's identity assertion here for an ID-JAG assertion (RFC 8693 with requested_token_type=urn:ietf:params:oauth:token-type:id-jag).",
  "mcp.form.idJag.orgTokenEndpointRequired": "The org token endpoint is required for ID-JAG",
  "mcp.form.idJag.resourceTokenEndpoint": "Resource Token Endpoint (leg 2)",
  "mcp.form.idJag.resourceTokenEndpointTooltip":
    "The upstream resource authorization server's token endpoint. LiteLLM posts the ID-JAG assertion here as an RFC 7523 jwt-bearer grant to get the access token the MCP server accepts.",
  "mcp.form.idJag.resourceTokenEndpointRequired": "The resource token endpoint is required for ID-JAG",
  "mcp.form.idJag.clientIdTooltip": "OAuth2 client ID LiteLLM authenticates as on both legs.",
  "mcp.form.idJag.clientIdRequired": "Client ID is required for ID-JAG",
  "mcp.form.idJag.clientSecretTooltip":
    "Authenticates LiteLLM as the OAuth client via client_secret_post. Leave blank when using a private key instead; a private key takes precedence over this secret.",
  "mcp.form.idJag.secretOrPrivateKeyRequired": "Provide either a client secret or a client private key",
  "mcp.form.idJag.privateKey": "Client Private Key (PEM)",
  "mcp.form.idJag.privateKeyTooltip":
    "PEM private key signing the RFC 7523 private_key_jwt client assertion. Okta Cross App Access normally requires this. When set it takes precedence over the client secret.",
  "mcp.form.idJag.privateKeyId": "Private Key ID (optional)",
  "mcp.form.idJag.privateKeyIdTooltip":
    "The kid advertised in the client assertion JWT header, so the IdP can select the right registered key.",
  "mcp.form.idJag.assertionSigningAlg": "Client Assertion Signing Algorithm (optional)",
  "mcp.form.idJag.assertionSigningAlgTooltip": "Algorithm signing the client assertion JWT. Defaults to RS256.",
  "mcp.form.idJag.audience": "Audience (optional)",
  "mcp.form.idJag.audienceTooltip":
    "RFC 8693 audience sent on leg 1, identifying the upstream the ID-JAG assertion is minted for.",
  "mcp.form.idJag.resourceIndicator": "Resource Indicator (optional)",
  "mcp.form.idJag.resourceIndicatorTooltip":
    "RFC 8707 resource indicator sent on leg 1. Separate from Audience, which is the RFC 8693 parameter.",
  "mcp.form.idJag.subjectTokenType": "Subject Token Type (optional)",
  "mcp.form.idJag.subjectTokenTypeTooltip":
    "Type of the identity assertion exchanged on leg 1. Defaults to urn:ietf:params:oauth:token-type:id_token.",
  "mcp.form.idJag.scopes": "Scopes (optional)",
  "mcp.form.idJag.scopesTooltip": "Scopes requested on leg 1 of the exchange.",

  // -------------------------------------------------- mcp-servers/_components/PassthroughAuthorizeSection.tsx
  "mcp.form.oauthClientIdOptional": "OAuth Client ID (optional)",
  "mcp.form.oauthClientSecretOptional": "OAuth Client Secret (optional)",

  // -------------------------------------------------- mcp-servers/_components/CreateMCPServer.tsx (shared form fields)
  "mcp.form.viewDocs": "View docs →",
  "mcp.form.mcpLogoAlt": "MCP Logo",
  "mcp.form.serverName": "MCP Server Name",
  "mcp.form.serverNameTooltip":
    "Best practice: Use a descriptive name that indicates the server's purpose (e.g., 'GitHub_MCP', 'Email_Service'). Cannot contain spaces or hyphens; use underscores instead. Names must comply with SEP-986 and will be rejected if invalid (https://modelcontextprotocol.io/specification/2025-11-25/server/tools#tool-names).",
  "mcp.form.namePlaceholder": "e.g., GitHub_MCP, Zapier_MCP, etc.",
  "mcp.form.alias": "Alias",
  "mcp.form.aliasTooltip":
    "A short, unique identifier for this server. Defaults to the server name if not provided. Cannot contain spaces or hyphens; use underscores instead.",
  "mcp.form.descriptionPlaceholder": "Brief description of what this server does",
  "mcp.form.sourceUrl": "GitHub / Source URL",
  "mcp.form.transportType": "Transport Type",
  "mcp.form.transportTypeRequired": "Please select a transport type",
  "mcp.form.selectTransport": "Select transport",
  "mcp.form.serverUrl": "MCP Server URL",
  "mcp.form.serverUrlRequired": "Please enter a server URL",
  "mcp.form.maxConcurrentRequests": "Max Concurrent Requests (optional)",
  "mcp.form.maxConcurrentRequestsTooltip":
    "Maximum number of tool calls LiteLLM will run against this server at the same time. Additional calls wait for a free slot. Leave blank for no limit.",
  "mcp.form.maxConcurrentRequestsPlaceholder": "e.g. 10",
  "mcp.form.authenticationSettings": "Authentication settings",
  "mcp.form.authentication": "Authentication",
  "mcp.form.authTypeRequired": "Please select an auth type",
  "mcp.form.selectAuthType": "Select auth type",
  "mcp.form.authenticationValue": "Authentication Value",
  "mcp.form.authenticationValueTooltip":
    "Token, password, or header value to send with each request for the selected auth type.",
  "mcp.form.authenticationValueRequired": "Authentication value cannot be empty whitespace",
  "mcp.form.enterTokenOrSecret": "Enter token or secret",

  // -------------------------------------------------- mcp-servers/_components/OpenAPIFormSection.tsx
  "mcp.openapi.specUrl": "OpenAPI Spec URL",
  "mcp.openapi.specUrlTooltip":
    "URL to an OpenAPI specification (JSON or YAML). MCP tools will be automatically generated from the API endpoints defined in the spec.",
  "mcp.openapi.specUrlRequired": "Please enter an OpenAPI spec URL",

  // -------------------------------------------------- mcp-servers/_components/OpenAPIQuickPicker.tsx
  "mcp.openapi.popularApis": "Popular APIs",
  "mcp.openapi.pickerHint":
    "Select an API to pre-fill the spec URL and OAuth 2.0 settings, or enter your own spec URL below.",

  // -------------------------------------------------- mcp-servers/_components/StdioAvailability.tsx
  "mcp.stdio.disabledMessage":
    "stdio MCP servers are disabled on this proxy. Set LITELLM_ENABLE_MCP_STDIO=true on the proxy and restart to enable them",
  "mcp.stdio.disabledTitle": "stdio is disabled on this proxy",
  "mcp.stdio.disabledDescription": "Until then this server cannot start or be saved as stdio.",

  // -------------------------------------------------- mcp-servers/_components/StdioConfiguration.tsx
  "mcp.stdio.configuration": "Stdio Configuration (JSON)",
  "mcp.stdio.configurationTooltip":
    "Paste your stdio MCP server configuration in JSON format. You can use the full mcpServers structure from config.yaml or just the inner server configuration.",
  "mcp.stdio.configurationRequired": "Please enter stdio configuration",
  "mcp.stdio.configurationInvalidJson": "Please enter valid JSON",

  // -------------------------------------------------- mcp-servers/_components/PassthroughAuthorizeSection.tsx
  "mcp.oauth.authorizeWaiting": "Waiting for authorization...",
  "mcp.oauth.exchangingCode": "Exchanging authorization code...",
  "mcp.oauth.authorizeFetchTools": "Authorize & Fetch Tools (browser-only)",
  "mcp.oauth.clientIdPlaceholderKeepExisting": "Leave blank to keep the currently saved app (if any)",
  "mcp.oauth.clientIdPlaceholder": "Leave blank to use dynamic client registration",
  "mcp.oauth.clientSecretPlaceholderKeepExisting": "Leave blank to keep the currently saved secret (if any)",
  "mcp.oauth.clientSecretPlaceholder": "Leave blank for public clients / PKCE",
  "mcp.oauth.clientIdHelpKeepExisting":
    "Set this to make everyone authorize through a specific app; required for upstreams without dynamic client registration (e.g. a pre-registered Slack app).",
  "mcp.oauth.clientIdHelp":
    "Switching the auth type discards the previously saved app; enter a client ID here or leave blank to use dynamic client registration.",
  "mcp.oauth.removeStoredApp":
    "Remove the saved OAuth app on save (the server goes back to dynamic client registration)",
  "mcp.oauth.tokenHeldForSession":
    "Token held for this browser session. Tools can now be previewed and configured; the token was not saved to LiteLLM.",

  // -------------------------------------------------- mcp-servers/_components/PassthroughAuthorizeSection.tsx
  "mcp.oauth.passthroughIntro":
    "Callers bring their own upstream token for this auth type, so LiteLLM never stores tokens. To preview tools and configure the tool allowlist, authorize against the upstream here: the token stays in this browser session only and is never saved to LiteLLM. An OAuth app configured below IS saved with the server, so internal users who authorize from the Tools page go through it.",
  "mcp.oauth.upstreamChangedWarning":
    "You changed the upstream URL or endpoints; the OAuth app entered here was registered for the previous upstream and may not be valid. Update the client ID, or clear it to use dynamic client registration.",

  // -------------------------------------------------- mcp-servers/_components/ToolArgumentsForm.tsx
  "mcp.toolArgs.true": "True",
  "mcp.toolArgs.false": "False",
  "mcp.toolArgs.emptyString": "Empty string",
  "mcp.toolArgs.selectField": "Select {name}",
  "mcp.toolArgs.enterField": "Enter {name}",
  "mcp.toolArgs.enterJsonObject": "Enter JSON object for {name}",
  "mcp.toolArgs.enterJsonArray": "Enter JSON array for {name}",
  "mcp.toolArgs.validJsonObject": "Provide a valid JSON object.",
  "mcp.toolArgs.validJsonArray": "Provide a valid JSON array.",
  "mcp.toolArgs.input": "Input",
  "mcp.toolArgs.enterInputForTool": "Enter input for this tool",
  "mcp.toolArgs.noParametersRequired": "No Parameters Required",
  "mcp.toolArgs.noParametersDescription": "This tool can be called without any input parameters.",
  "mcp.toolArgs.callingTool": "Calling Tool...",
  "mcp.toolArgs.callAgain": "Call Again",
  "mcp.toolArgs.callTool": "Call Tool",

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
  "mcpToolPermissions.emptyAccessGroupBody1":
    "没有 MCP 服务器列出此组，因此它不授予任何权限。在 config.yaml 中定义的服务器通过其",
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

  // -------------------------------------------------- mcp-servers/_components/CreateMCPServer.tsx
  "mcp.create.title": "添加 MCP 服务器",
  "mcp.create.submitTitle": "提交 MCP 服务器审核",
  "mcp.create.reviewBanner":
    "你的提交将进入管理员审核流程。审核通过后，该服务器会出现在你的 MCP 服务器列表中。请求必须使用团队作用域的 API 密钥发出。",
  "mcp.create.addServer": "添加 MCP 服务器",
  "mcp.create.creating": "创建中...",
  "mcp.create.success": "MCP 服务器创建成功",
  "mcp.create.submitted": "MCP 服务器已提交管理员审核",
  "mcp.create.submittedDescription": "管理员批准后，该服务器会出现在你的 MCP 服务器列表中。",
  "mcp.create.errorCreating": "创建 MCP 服务器失败：{reason}",
  "mcp.create.errorSubmitting": "提交 MCP 服务器失败：{reason}",
  "mcp.create.oauthSuccess": "OAuth 授权成功！请点击“Create MCP Server”保存配置。",
  "mcp.create.tokenHeld": "令牌仅保留在当前浏览器会话中。现在可以预览和配置工具，该令牌不会保存到 LiteLLM。",
  "mcp.create.invalidToolDisplayName": "工具显示名称“{name}”无效。只允许字母、数字、下划线和连字符（不能包含空格）。",
  "mcp.create.invalidStdioJson": "stdio 配置中的 JSON 无效",
  "mcp.create.invalidTokenValidationJson": "令牌校验规则中的 JSON 无效",

  // -------------------------------------------------- mcp-servers/_components/EnvVarsSection.tsx
  "mcp.env.variables": "变量",
  "mcp.env.variablesTooltip": "定义变量后，就可以在静态请求头或认证中使用",
  "mcp.env.scopeInstance": "实例级",
  "mcp.env.scopeInstanceTooltip": "由管理员定义，所有用户共用。",
  "mcp.env.scopePerUser": "用户级",
  "mcp.env.scopePerUserTooltip": "每位用户通过 MCP Gateway 面板填写自己的值（例如个人凭据）。",
  "mcp.env.referenceHelp": "在静态请求头或认证中这样引用：",
  "mcp.env.referenceExample": "例如：",
  "mcp.env.variableName": "变量名",
  "mcp.env.valueOrDescription": "值 / 说明",
  "mcp.env.scope": "范围",
  "mcp.env.addVariable": "添加变量",
  "mcp.env.nameRequired": "变量名不能为空",
  "mcp.env.namePattern": "只能使用字母、数字、下划线，且不能以数字开头。",
  "mcp.env.namePlaceholder": "例如 DB_PROTOCOL",
  "mcp.env.hint": "提示",
  "mcp.env.hintTooltip": "用户级变量没有共享值。这段文字只是提示，会在每位用户填写自己的值时展示给他们。",
  "mcp.env.descriptionPlaceholder": "例如：你的数据库用户名",
  "mcp.env.valuePlaceholder": "例如 postgresql",

  // -------------------------------------------------- mcp-servers/_components/AwsSigV4Fields.tsx
  "mcp.form.awsSigv4.intro": "适用于托管在 AWS Bedrock AgentCore 上的 MCP 服务器。",
  "mcp.form.awsSigv4.region": "AWS 区域",
  "mcp.form.awsSigv4.regionTooltip": "用于 SigV4 签名的 AWS 区域（例如 us-east-1）",
  "mcp.form.awsSigv4.regionRequired": "SigV4 认证必须填写 AWS 区域",
  "mcp.form.awsSigv4.serviceName": "AWS 服务名称",
  "mcp.form.awsSigv4.serviceNameTooltip": "用于 SigV4 签名的 AWS 服务名称，默认值为 'bedrock-agentcore'。",
  "mcp.form.awsSigv4.accessKeyId": "AWS Access Key ID",
  "mcp.form.awsSigv4.accessKeyIdTooltip": "可选。若不提供，则回退到 boto3 凭据链（IAM 角色、环境变量等）。",
  "mcp.form.awsSigv4.accessKeyIdRequired": "填写了 Secret Access Key 时必须填写 Access Key ID",
  "mcp.form.awsSigv4.accessKeyIdPlaceholder": "AKIA...（可选，留空则使用 IAM 角色）",
  "mcp.form.awsSigv4.secretAccessKey": "AWS Secret Access Key",
  "mcp.form.awsSigv4.secretAccessKeyTooltip": "可选。填写了 AWS Access Key ID 时必填。",
  "mcp.form.awsSigv4.secretAccessKeyRequired": "填写了 Access Key ID 时必须填写 Secret Access Key",
  "mcp.form.awsSigv4.secretAccessKeyPlaceholder": "输入 Secret Key（可选，留空则使用 IAM 角色）",
  "mcp.form.awsSigv4.sessionToken": "AWS Session Token",
  "mcp.form.awsSigv4.sessionTokenTooltip": "可选。仅在使用 STS 临时凭据时需要。",
  "mcp.form.awsSigv4.sessionTokenPlaceholder": "输入 Session Token（可选）",
  "mcp.form.awsSigv4.roleArn": "AWS Role ARN",
  "mcp.form.awsSigv4.roleArnTooltip":
    "可选。签名前通过 STS 扮演的 IAM 角色 ARN。填写后 LiteLLM 会调用 sts:AssumeRole 获取临时凭据。除非同时提供了显式密钥，否则使用环境中的凭据（IAM 角色、环境变量）作为源身份。",
  "mcp.form.awsSigv4.roleArnPlaceholder": "arn:aws:iam::123456789012:role/MyRole（可选）",
  "mcp.form.awsSigv4.sessionName": "AWS Session Name",
  "mcp.form.awsSigv4.sessionNameTooltip":
    "可选。AssumeRole 调用的会话名称，会出现在 CloudTrail 日志中。留空则自动生成。",
  "mcp.form.awsSigv4.sessionNamePlaceholder": "litellm-prod（可选，留空则自动生成）",

  // -------------------------------------------------- mcp-servers/_components/OpenApiByokFields.tsx
  "mcp.form.byok": "BYOK（自带密钥）",
  "mcp.form.byokTooltip": "启用后，每位用户为该服务提供自己的 API 密钥。密钥按用户保存，不会共享。",
  "mcp.form.byokUserKeysSentAs": "用户密钥将以下面形式发送：",
  "mcp.form.byokSetAuthType": "请在下方设置",
  "mcp.form.byokAuthTypeName": "认证类型",
  "mcp.form.byokSetAuthTypeHint": "，以指定用户密钥的发送方式（例如 Bearer Token、API Key 请求头）。",
  "mcp.form.byokAccessDescription": "权限说明",
  "mcp.form.byokAccessDescriptionTooltip": "在连接弹窗中展示给用户的权限列表（例如“创建和管理 Jira 议题”）",
  "mcp.form.byokAccessDescriptionPlaceholder": "添加权限说明条目（每项输入后按回车）",
  "mcp.form.byokHelpUrl": "API 密钥帮助链接",
  "mcp.form.byokHelpUrlTooltip": "可选链接，展示给用户以帮助他们找到自己的 API 密钥",

  // -------------------------------------------------- mcp-servers/_components/DcrBridgeToggle.tsx
  "mcp.form.dcrBridge": "网关托管登录（DCR 桥接）",
  "mcp.form.dcrBridgeTooltip":
    "让 Claude Desktop 这类仅支持 OAuth 的客户端可以通过网关注册并登录。关闭则改为转发上游服务器自己的 OAuth 元信息（适用于已在上游 IdP 预注册的客户端）。",

  // -------------------------------------------------- mcp-servers/_components/TokenEndpointAuthMethodField.tsx
  "mcp.form.tokenEndpointAuthMethod": "令牌端点认证方式（可选）",
  "mcp.form.tokenEndpointAuthMethodTooltip":
    "代理访问上游 OAuth 令牌端点时使用的认证方式。Client Secret Basic 把客户端凭据放在 HTTP Basic Authorization 请求头中；留空则使用默认的 Client Secret Post，即放在请求体中。",
  "mcp.form.tokenEndpointAuthMethod.clientSecretBasic": "Client Secret Basic",
  "mcp.form.tokenEndpointAuthMethod.clientSecretPost": "Client Secret Post",
  "mcp.form.tokenEndpointAuthMethodKeepExisting": "留空则保留原值（默认 Client Secret Post）",
  "mcp.form.tokenEndpointAuthMethodDefault": "默认（Client Secret Post）",

  // -------------------------------------------------- mcp-servers/_components/UpstreamTokenHeaderField.tsx
  "mcp.form.tokenHeader": "令牌请求头（可选）",
  "mcp.form.tokenHeaderTooltip":
    "LiteLLM 为该服务器解析出的令牌放在哪个上游请求头中。留空则按 'Authorization: Bearer <token>' 发送，这也是默认值和多数服务器的预期方式。当上游期望放在别处时才填写请求头名称，例如 API 网关把自己的凭据终结在 'esb-oauth' 上，而静态请求头里另一个 Authorization 会透传给其后的服务器。",

  // -------------------------------------------------- mcp-servers/_components/TokenExchangeFormFields.tsx
  "mcp.form.profile": "配置模式",
  "mcp.form.profileTooltip":
    "令牌交换的协议方言。RFC 8693 是标准的令牌交换授权。Microsoft Entra OBO 使用 Entra 的 On-Behalf-Of 方言（RFC 7523 jwt-bearer 授权，附带 requested_token_use=on_behalf_of），并把目标资源放在形如 api://<app-id>/.default 的 scope 中。",
  "mcp.form.tokenExchangeProfile.rfc8693": "RFC 8693（标准）",
  "mcp.form.tokenExchangeProfile.entraObo": "Microsoft Entra OBO",
  "mcp.form.tokenExchangeEndpoint": "令牌交换端点（可选）",
  "mcp.form.tokenExchangeEndpointTooltip":
    "RFC 8693 令牌端点。代理在这里把用户传入的令牌换成带作用域的令牌，再调用上游 MCP 服务器。留空则根据上游的受保护资源元信息自动发现（先查 RFC 9728，再查 RFC 8414）。",
  "mcp.form.tokenExchange.clientIdTooltip": "用于向令牌交换端点认证的 OAuth2 客户端 ID。",
  "mcp.form.tokenExchange.clientIdRequired": "令牌交换必须填写 Client ID",
  "mcp.form.tokenExchange.clientSecretTooltip": "用于向令牌交换端点认证的 OAuth2 客户端密钥。",
  "mcp.form.tokenExchange.clientSecretRequired": "令牌交换必须填写 Client Secret",
  "mcp.form.tokenExchange.audience": "受众（可选）",
  "mcp.form.tokenExchange.audienceTooltip":
    "交换所得令牌的受众（RFC 8693 audience），用于标识该令牌对应的上游 MCP 服务器。",
  "mcp.form.tokenExchange.subjectTokenType": "主体令牌类型（可选）",
  "mcp.form.tokenExchange.subjectTokenTypeTooltip":
    "用户传入令牌的类型（RFC 8693 subject_token_type）。默认为 urn:ietf:params:oauth:token-type:access_token。",
  "mcp.form.scopes": "作用域",
  "mcp.form.scopesOptional": "作用域（可选）",
  "mcp.form.tokenExchange.entraScopesTooltip":
    "Microsoft Entra OBO 把目标资源放在作用域中，因此至少需要一条（例如 api://<app-id>/.default）。",
  "mcp.form.tokenExchange.scopesTooltip": "令牌交换时请求的可选作用域。",
  "mcp.form.tokenExchange.entraScopesRequired": "Microsoft Entra OBO 需要作用域，例如 api://<app-id>/.default",
  "mcp.form.addScopes": "添加作用域",
  "mcp.form.leaveBlankToKeepExisting": "（留空则保留原值）",

  // -------------------------------------------------- mcp-servers/_components/IdJagFormFields.tsx
  "mcp.form.oauth.clientId": "客户端 ID",
  "mcp.form.oauth.clientIdPlaceholder": "输入 OAuth 客户端 ID",
  "mcp.form.oauth.clientSecret": "客户端密钥",
  "mcp.form.oauth.clientSecretPlaceholder": "输入 OAuth 客户端密钥",
  "mcp.form.idJag.orgTokenEndpoint": "组织令牌端点（第一段）",
  "mcp.form.idJag.orgTokenEndpointTooltip":
    "你的 IdP 组织授权服务器的令牌端点。LiteLLM 在这里把用户的身份断言换成 ID-JAG 断言（RFC 8693，requested_token_type 为 urn:ietf:params:oauth:token-type:id-jag）。",
  "mcp.form.idJag.orgTokenEndpointRequired": "ID-JAG 必须填写组织令牌端点",
  "mcp.form.idJag.resourceTokenEndpoint": "资源令牌端点（第二段）",
  "mcp.form.idJag.resourceTokenEndpointTooltip":
    "上游资源授权服务器的令牌端点。LiteLLM 以 RFC 7523 jwt-bearer 授权把 ID-JAG 断言提交到这里，换取该 MCP 服务器可接受的访问令牌。",
  "mcp.form.idJag.resourceTokenEndpointRequired": "ID-JAG 必须填写资源令牌端点",
  "mcp.form.idJag.clientIdTooltip": "LiteLLM 在两段交换中作为 OAuth 客户端认证时使用的客户端 ID。",
  "mcp.form.idJag.clientIdRequired": "ID-JAG 必须填写客户端 ID",
  "mcp.form.idJag.clientSecretTooltip":
    "通过 client_secret_post 让 LiteLLM 以 OAuth 客户端身份认证。使用私钥时可留空，私钥的优先级高于此密钥。",
  "mcp.form.idJag.secretOrPrivateKeyRequired": "请提供客户端密钥或客户端私钥之一",
  "mcp.form.idJag.privateKey": "客户端私钥（PEM）",
  "mcp.form.idJag.privateKeyTooltip":
    "用于签署 RFC 7523 private_key_jwt 客户端断言的 PEM 私钥。Okta Cross App Access 通常需要它。填写后优先级高于客户端密钥。",
  "mcp.form.idJag.privateKeyId": "私钥 ID（可选）",
  "mcp.form.idJag.privateKeyIdTooltip": "在客户端断言 JWT 头中声明的 kid，便于 IdP 选择正确的已注册密钥。",
  "mcp.form.idJag.assertionSigningAlg": "客户端断言签名算法（可选）",
  "mcp.form.idJag.assertionSigningAlgTooltip": "签署客户端断言 JWT 的算法，默认 RS256。",
  "mcp.form.idJag.audience": "受众（可选）",
  "mcp.form.idJag.audienceTooltip": "第一段交换中发送的 RFC 8693 audience，用于标识该 ID-JAG 断言所面向的上游。",
  "mcp.form.idJag.resourceIndicator": "资源指示符（可选）",
  "mcp.form.idJag.resourceIndicatorTooltip":
    "第一段交换中发送的 RFC 8707 resource indicator。它与 audience 不同，后者是 RFC 8693 参数。",
  "mcp.form.idJag.subjectTokenType": "主体令牌类型（可选）",
  "mcp.form.idJag.subjectTokenTypeTooltip":
    "第一段交换中交换的身份断言类型。默认为 urn:ietf:params:oauth:token-type:id_token。",
  "mcp.form.idJag.scopes": "作用域（可选）",
  "mcp.form.idJag.scopesTooltip": "第一段交换中请求的作用域。",

  // -------------------------------------------------- mcp-servers/_components/PassthroughAuthorizeSection.tsx
  "mcp.form.oauthClientIdOptional": "OAuth 客户端 ID（可选）",
  "mcp.form.oauthClientSecretOptional": "OAuth 客户端密钥（可选）",

  // -------------------------------------------------- mcp-servers/_components/CreateMCPServer.tsx (shared form fields)
  "mcp.form.viewDocs": "查看文档 →",
  "mcp.form.mcpLogoAlt": "MCP 标志",
  "mcp.form.serverName": "MCP 服务器名称",
  "mcp.form.serverNameTooltip":
    "最佳实践：使用能体现服务器用途的描述性名称（例如 'GitHub_MCP'、'Email_Service'）。不能包含空格或连字符，请改用下划线。名称必须符合 SEP-986，不合法时会被拒绝（https://modelcontextprotocol.io/specification/2025-11-25/server/tools#tool-names）。",
  "mcp.form.namePlaceholder": "例如 GitHub_MCP、Zapier_MCP 等",
  "mcp.form.alias": "别名",
  "mcp.form.aliasTooltip": "该服务器的简短唯一标识。不填则默认使用服务器名称。不能包含空格或连字符，请改用下划线。",
  "mcp.form.descriptionPlaceholder": "简要说明该服务器的用途",
  "mcp.form.sourceUrl": "GitHub / 源码链接",
  "mcp.form.transportType": "传输类型",
  "mcp.form.transportTypeRequired": "请选择传输类型",
  "mcp.form.selectTransport": "选择传输方式",
  "mcp.form.serverUrl": "MCP 服务器地址",
  "mcp.form.serverUrlRequired": "请输入服务器地址",
  "mcp.form.maxConcurrentRequests": "最大并发请求数（可选）",
  "mcp.form.maxConcurrentRequestsTooltip":
    "LiteLLM 同时对该服务器执行的工具调用上限。超出后调用会排队等待空闲名额。留空表示不限制。",
  "mcp.form.maxConcurrentRequestsPlaceholder": "例如 10",
  "mcp.form.authenticationSettings": "认证设置",
  "mcp.form.authentication": "认证方式",
  "mcp.form.authTypeRequired": "请选择认证方式",
  "mcp.form.selectAuthType": "选择认证方式",
  "mcp.form.authenticationValue": "认证值",
  "mcp.form.authenticationValueTooltip": "按所选认证方式随每次请求发送的令牌、密码或请求头值。",
  "mcp.form.authenticationValueRequired": "认证值不能只包含空白字符",
  "mcp.form.enterTokenOrSecret": "输入令牌或密钥",

  // -------------------------------------------------- mcp-servers/_components/OpenAPIFormSection.tsx
  "mcp.openapi.specUrl": "OpenAPI 规范地址",
  "mcp.openapi.specUrlTooltip": "OpenAPI 规范（JSON 或 YAML）的地址。MCP 工具会根据规范中定义的 API 端点自动生成。",
  "mcp.openapi.specUrlRequired": "请输入 OpenAPI 规范地址",

  // -------------------------------------------------- mcp-servers/_components/OpenAPIQuickPicker.tsx
  "mcp.openapi.popularApis": "热门 API",
  "mcp.openapi.pickerHint": "选择一个 API 可自动填入规范地址和 OAuth 2.0 设置，也可以在下方填写自己的规范地址。",

  // -------------------------------------------------- mcp-servers/_components/StdioAvailability.tsx
  "mcp.stdio.disabledMessage":
    "此代理已禁用 stdio MCP 服务器。请在代理上设置 LITELLM_ENABLE_MCP_STDIO=true 并重启以启用",
  "mcp.stdio.disabledTitle": "此代理已禁用 stdio",
  "mcp.stdio.disabledDescription": "在此之前，该服务器无法启动，也无法保存为 stdio。",

  // -------------------------------------------------- mcp-servers/_components/StdioConfiguration.tsx
  "mcp.stdio.configuration": "Stdio 配置（JSON）",
  "mcp.stdio.configurationTooltip":
    "粘贴 stdio MCP 服务器的 JSON 配置。可以使用 config.yaml 中完整的 mcpServers 结构，也可以只填内层的服务器配置。",
  "mcp.stdio.configurationRequired": "请输入 stdio 配置",
  "mcp.stdio.configurationInvalidJson": "请输入有效的 JSON",

  // -------------------------------------------------- mcp-servers/_components/PassthroughAuthorizeSection.tsx
  "mcp.oauth.authorizeWaiting": "等待授权中...",
  "mcp.oauth.exchangingCode": "正在交换授权码...",
  "mcp.oauth.authorizeFetchTools": "授权并获取工具（仅浏览器）",
  "mcp.oauth.clientIdPlaceholderKeepExisting": "留空则保留当前已保存的应用（若有）",
  "mcp.oauth.clientIdPlaceholder": "留空则使用动态客户端注册",
  "mcp.oauth.clientSecretPlaceholderKeepExisting": "留空则保留当前已保存的密钥（若有）",
  "mcp.oauth.clientSecretPlaceholder": "公开客户端 / PKCE 请留空",
  "mcp.oauth.clientIdHelpKeepExisting":
    "填写后所有人都通过这个指定应用授权；上游不支持动态客户端注册时必须填写（例如预注册的 Slack 应用）。",
  "mcp.oauth.clientIdHelp": "切换认证方式会丢弃之前保存的应用；在此填写客户端 ID，或留空以使用动态客户端注册。",
  "mcp.oauth.removeStoredApp": "保存时删除已保存的 OAuth 应用（服务器将回到动态客户端注册）",
  "mcp.oauth.tokenHeldForSession": "令牌仅保留在当前浏览器会话中。现在可以预览和配置工具，该令牌未保存到 LiteLLM。",

  // -------------------------------------------------- mcp-servers/_components/PassthroughAuthorizeSection.tsx
  "mcp.oauth.passthroughIntro":
    "此认证方式下由调用方自带上游令牌，因此 LiteLLM 不会保存任何令牌。要预览工具并配置工具允许列表，可在上游完成授权：令牌只保留在当前浏览器会话中，绝不会保存到 LiteLLM。而下方配置的 OAuth 应用会随服务器一起保存，因此内部用户从工具页面授权时走的是它。",
  "mcp.oauth.upstreamChangedWarning":
    "你修改了上游地址或端点，此处填写的 OAuth 应用是为原上游注册的，可能已失效。请更新客户端 ID，或清空以使用动态客户端注册。",

  // -------------------------------------------------- mcp-servers/_components/ToolArgumentsForm.tsx
  "mcp.toolArgs.true": "真",
  "mcp.toolArgs.false": "假",
  "mcp.toolArgs.emptyString": "空字符串",
  "mcp.toolArgs.selectField": "选择 {name}",
  "mcp.toolArgs.enterField": "输入 {name}",
  "mcp.toolArgs.enterJsonObject": "为 {name} 输入 JSON 对象",
  "mcp.toolArgs.enterJsonArray": "为 {name} 输入 JSON 数组",
  "mcp.toolArgs.validJsonObject": "请提供有效的 JSON 对象。",
  "mcp.toolArgs.validJsonArray": "请提供有效的 JSON 数组。",
  "mcp.toolArgs.input": "输入",
  "mcp.toolArgs.enterInputForTool": "输入该工具的入参",
  "mcp.toolArgs.noParametersRequired": "无需参数",
  "mcp.toolArgs.noParametersDescription": "该工具无需任何输入参数即可调用。",
  "mcp.toolArgs.callingTool": "正在调用工具...",
  "mcp.toolArgs.callAgain": "再次调用",
  "mcp.toolArgs.callTool": "调用工具",

  // -------------------------------------------------- shared
  "mcp.noDescription": "无描述",
};
