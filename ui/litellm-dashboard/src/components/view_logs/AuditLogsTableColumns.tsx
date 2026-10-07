"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DateCell, IdCell, IdentityCell, StatusBadge, type StatusTone } from "@/components/shared/table_cells";
import { DEFAULT_LANGUAGE, translate, type Translate } from "@/i18n";

import DefaultProxyAdminTag from "../common_components/DefaultProxyAdminTag";

export type AuditLogEntry = {
  id: string;
  updated_at: string;
  changed_by: string;
  changed_by_api_key: string;
  action: string;
  table_name: string;
  object_id: string;
  before_value: Record<string, unknown>;
  updated_values: Record<string, unknown>;
};

export const AUDIT_TABLE_NAME_LABEL_KEYS: Record<string, string> = {
  LiteLLM_VerificationToken: "logs.audit.table.keys",
  LiteLLM_TeamTable: "logs.audit.table.teams",
  LiteLLM_UserTable: "logs.audit.table.users",
  LiteLLM_OrganizationTable: "logs.audit.table.organizations",
  LiteLLM_ProxyModelTable: "logs.audit.table.models",
  LiteLLM_AgentsTable: "logs.audit.table.agents",
};

const ACTION_TONE: Record<string, StatusTone> = {
  created: "success",
  updated: "info",
  deleted: "error",
  rotated: "warning",
  kill_switch_fired: "error",
};

export const AUDIT_ACTION_LABEL_KEYS: Record<string, string> = {
  created: "logs.audit.action.created",
  updated: "logs.audit.action.updated",
  deleted: "logs.audit.action.deleted",
  rotated: "logs.audit.action.rotated",
  kill_switch_fired: "logs.audit.action.kill_switch_fired",
};

const englishT: Translate = (key, params) => translate(DEFAULT_LANGUAGE, key, params);

/** Unknown actions keep their raw snake_case value, title-cased as before. */
export const auditActionLabel = (t: Translate, action: string): string => {
  const labelKey = AUDIT_ACTION_LABEL_KEYS[action];
  if (labelKey) return t(labelKey);
  const words = action.replace(/_/g, " ");
  return words ? words.charAt(0).toUpperCase() + words.slice(1) : words;
};

export const auditTableNameLabel = (t: Translate, tableName: string): string => {
  const labelKey = AUDIT_TABLE_NAME_LABEL_KEYS[tableName];
  return labelKey ? t(labelKey) : tableName;
};

interface AuditLogsTableColumnsDeps {
  onViewLog: (log: AuditLogEntry) => void;
  t?: Translate;
}

export const getAuditLogsTableColumns = ({
  onViewLog,
  t = englishT,
}: AuditLogsTableColumnsDeps): ColumnDef<AuditLogEntry>[] => [
  {
    id: "updated_at",
    accessorKey: "updated_at",
    header: t("logs.audit.col.timestamp"),
    size: 200,
    enableSorting: false,
    cell: ({ row }) => <DateCell value={row.original.updated_at} />,
  },
  {
    id: "action",
    accessorKey: "action",
    header: t("logs.audit.col.action"),
    size: 110,
    enableSorting: false,
    cell: ({ row }) => (
      <StatusBadge
        tone={ACTION_TONE[row.original.action] ?? "neutral"}
        label={auditActionLabel(t, row.original.action)}
      />
    ),
  },
  {
    id: "table_name",
    accessorKey: "table_name",
    header: t("logs.audit.col.table"),
    size: 130,
    enableSorting: false,
    cell: ({ row }) => (
      <span className="text-sm">{auditTableNameLabel(t, row.original.table_name)}</span>
    ),
  },
  {
    id: "object_id",
    accessorKey: "object_id",
    header: t("logs.audit.col.objectId"),
    minSize: 220,
    enableSorting: false,
    cell: ({ row }) => (
      <IdentityCell
        title={row.original.object_id}
        titleClassName="font-mono text-xs font-normal text-primary"
        className="max-w-72"
        onClick={() => onViewLog(row.original)}
      />
    ),
  },
  {
    id: "changed_by",
    accessorKey: "changed_by",
    header: t("logs.audit.col.changedBy"),
    size: 200,
    enableSorting: false,
    cell: ({ row }) => <DefaultProxyAdminTag userId={row.original.changed_by} />,
  },
  {
    id: "changed_by_api_key",
    accessorKey: "changed_by_api_key",
    header: t("logs.audit.col.apiKey"),
    size: 160,
    enableSorting: false,
    cell: ({ row }) => <IdCell value={row.original.changed_by_api_key} variant="plain" />,
  },
];
