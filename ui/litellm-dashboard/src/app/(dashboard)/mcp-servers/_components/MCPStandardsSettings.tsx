"use client";

import { MCPServer } from "@/components/mcp_tools/types";

export interface RequiredFieldDef {
  key: string;
  labelKey: string;
  descriptionKey: string;
  check: (server: MCPServer) => boolean;
}

export interface FieldGroup {
  labelKey: string;
  fields: RequiredFieldDef[];
}

export const FIELD_GROUPS: FieldGroup[] = [
  {
    labelKey: "mcpServers.standards.group.documentation",
    fields: [
      {
        key: "description",
        labelKey: "mcpServers.standards.field.description.label",
        descriptionKey: "mcpServers.standards.field.description.description",
        check: (s) => !!s.description?.trim(),
      },
      {
        key: "alias",
        labelKey: "mcpServers.standards.field.alias.label",
        descriptionKey: "mcpServers.standards.field.alias.description",
        check: (s) => !!s.alias?.trim(),
      },
    ],
  },
  {
    labelKey: "mcpServers.standards.group.source",
    fields: [
      {
        key: "source_url",
        labelKey: "mcpServers.standards.field.source_url.label",
        descriptionKey: "mcpServers.standards.field.source_url.description",
        check: (s) => !!s.source_url?.trim(),
      },
    ],
  },
  {
    labelKey: "mcpServers.standards.group.connection",
    fields: [
      {
        key: "url",
        labelKey: "mcpServers.standards.field.url.label",
        descriptionKey: "mcpServers.standards.field.url.description",
        check: (s) => !!s.url?.trim(),
      },
    ],
  },
  {
    labelKey: "mcpServers.standards.group.security",
    fields: [
      {
        key: "auth_type",
        labelKey: "mcpServers.standards.field.auth_type.label",
        descriptionKey: "mcpServers.standards.field.auth_type.description",
        check: (s) => !!s.auth_type && s.auth_type !== "none",
      },
    ],
  },
];

export const MCP_REQUIRED_FIELD_DEFS: RequiredFieldDef[] = FIELD_GROUPS.flatMap((g) => g.fields);

export const SETTINGS_KEY = "mcp_required_fields";
