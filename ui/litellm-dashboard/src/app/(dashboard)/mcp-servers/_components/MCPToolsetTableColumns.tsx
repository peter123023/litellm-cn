"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Copy, Link2, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { DataTableSortHeader } from "@/components/shared/DataTable";
import { DateCell, IdCell, IdentityCell } from "@/components/shared/table_cells";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/cva.config";
import { getProxyBaseUrl } from "@/components/networking";
import { MCPToolset } from "@/components/mcp_tools/types";
import { copyToClipboard } from "@/utils/dataUtils";
import { DEFAULT_LANGUAGE, translate, useTranslation, type Translate } from "@/i18n";

// Column factories are plain functions invoked inside useMemo, so they cannot use hooks.
// Callers that have a `t` should pass it; every other caller falls back to English.
const englishT: Translate = (key, params) => translate(DEFAULT_LANGUAGE, key, params);

// Display-only. Toolsets persist {server_id, bare tool_name}; the gateway serves
// each tool prefixed as "{server-prefix}-{tool}". Render that qualified form so
// the same tool name on different servers stays distinguishable. This mirrors the
// backend default MCP_TOOL_PREFIX_SEPARATOR; overriding that env var only changes
// this cosmetic label, never what is stored or how tools are matched.
const MCP_TOOL_PREFIX_SEPARATOR = "-";

export function displayToolName(serverPrefix: string | undefined, toolName: string): string {
  return serverPrefix ? `${serverPrefix}${MCP_TOOL_PREFIX_SEPARATOR}${toolName}` : toolName;
}

export function toolsetEndpointUrl(toolsetName: string): string {
  return `${getProxyBaseUrl()}/toolset/${toolsetName}/mcp`;
}

interface ToolsetRowActionsProps {
  toolset: MCPToolset;
  isAdmin: boolean;
  onEditClick: (toolset: MCPToolset) => void;
  onDeleteClick: (toolsetId: string) => void;
}

function ToolsetRowActions({ toolset, isAdmin, onEditClick, onDeleteClick }: ToolsetRowActionsProps) {
  const { t } = useTranslation();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("mcpTools.toolsets.openActions")}
        data-testid={`toolset-actions-${toolset.toolset_id}`}
        className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), "text-muted-foreground")}
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem
          data-testid="toolset-action-copy-url"
          onClick={() =>
            void copyToClipboard(toolsetEndpointUrl(toolset.toolset_name), t("mcpTools.toolsets.endpointUrlCopied"))
          }
        >
          <Link2 />
          {t("mcpTools.toolsets.copyEndpointUrl")}
        </DropdownMenuItem>
        <DropdownMenuItem
          data-testid="toolset-action-copy-id"
          onClick={() => void copyToClipboard(toolset.toolset_id, t("mcpTools.toolsets.toolsetIdCopied"))}
        >
          <Copy />
          {t("mcpTools.toolsets.copyToolsetId")}
        </DropdownMenuItem>
        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem data-testid="toolset-action-edit" onClick={() => onEditClick(toolset)}>
              <Pencil />
              {t("common.edit")}
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              data-testid="toolset-action-delete"
              onClick={() => onDeleteClick(toolset.toolset_id)}
            >
              <Trash2 />
              {t("common.delete")}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface MCPToolsetTableColumnsDeps {
  isAdmin: boolean;
  serverPrefixById: Map<string, string>;
  onEditClick: (toolset: MCPToolset) => void;
  onDeleteClick: (toolsetId: string) => void;
  t?: Translate;
}

export const getMCPToolsetTableColumns = ({
  isAdmin,
  serverPrefixById,
  onEditClick,
  onDeleteClick,
  t: tOverride,
}: MCPToolsetTableColumnsDeps): ColumnDef<MCPToolset>[] => {
  const t = tOverride ?? englishT;
  return [
    {
      id: "toolset_id",
      accessorKey: "toolset_id",
      meta: { title: t("mcpTools.toolsets.toolsetIdColumn") },
      header: t("mcpTools.toolsets.toolsetIdColumn"),
      size: 140,
      enableSorting: false,
      cell: ({ row }) => <IdCell value={row.original.toolset_id} />,
    },
    {
      id: "toolset_name",
      accessorKey: "toolset_name",
      meta: { title: t("common.name") },
      header: ({ column }) => <DataTableSortHeader column={column} title={t("common.name")} />,
      size: 260,
      enableSorting: true,
      sortingFn: "alphanumeric",
      cell: ({ row }) => (
        <IdentityCell
          title={row.original.toolset_name}
          subtitle={toolsetEndpointUrl(row.original.toolset_name)}
          className="max-w-80"
          onClick={isAdmin ? () => onEditClick(row.original) : undefined}
        />
      ),
    },
    {
      id: "description",
      accessorKey: "description",
      meta: { title: t("common.description") },
      header: t("common.description"),
      size: 200,
      enableSorting: false,
      cell: ({ row }) => (
        <span className="block max-w-72 truncate text-sm text-muted-foreground" title={row.original.description}>
          {row.original.description || "—"}
        </span>
      ),
    },
    {
      id: "tools",
      meta: { title: t("mcpTools.toolsets.toolsColumn"), skeleton: "chips" },
      header: t("mcpTools.toolsets.toolsColumn"),
      size: 260,
      enableSorting: false,
      cell: ({ row }) => {
        const tools = row.original.tools;
        return (
          <div className="flex max-w-xs flex-wrap gap-1">
            {tools.slice(0, 4).map((tool) => (
              <span
                key={`${tool.server_id}-${tool.tool_name}`}
                className="inline-flex items-center rounded-md bg-muted px-1.5 py-0.5 text-xs"
              >
                {displayToolName(serverPrefixById.get(tool.server_id), tool.tool_name)}
              </span>
            ))}
            {tools.length > 4 && (
              <span className="self-center text-xs text-muted-foreground">
                {t("mcpTools.toolsets.moreCount", { count: tools.length - 4 })}
              </span>
            )}
          </div>
        );
      },
    },
    {
      id: "created_at",
      accessorKey: "created_at",
      meta: { title: t("mcpTools.toolsets.createdColumn") },
      header: ({ column }) => <DataTableSortHeader column={column} title={t("mcpTools.toolsets.createdColumn")} />,
      size: 120,
      enableSorting: true,
      cell: ({ row }) => <DateCell value={row.original.created_at} precision="date" />,
    },
    {
      id: "actions",
      meta: { className: "text-right", headerClassName: "text-right" },
      header: () => <span className="sr-only">{t("common.actions")}</span>,
      size: 64,
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <ToolsetRowActions
            toolset={row.original}
            isAdmin={isAdmin}
            onEditClick={onEditClick}
            onDeleteClick={onDeleteClick}
          />
        </div>
      ),
    },
  ];
};
