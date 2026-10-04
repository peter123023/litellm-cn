"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Copy, Info, MoreHorizontal } from "lucide-react";

import { DataTableSortHeader } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/table_cells";
import { IdentityCell } from "@/components/shared/table_cells";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { translate, useTranslation, type Language, type Translate } from "@/i18n";
import { cn } from "@/lib/cva.config";
import { copyToClipboard } from "@/utils/dataUtils";

export interface AgentHubData {
  agent_id?: string;
  protocolVersion: string;
  name: string;
  description: string;
  url: string;
  version: string;
  capabilities?: {
    streaming?: boolean;
    [key: string]: any;
  };
  defaultInputModes?: string[];
  defaultOutputModes?: string[];
  skills?: Array<{
    id: string;
    name: string;
    description: string;
    tags?: string[];
    examples?: string[];
  }>;
  supportsAuthenticatedExtendedCard?: boolean;
  is_public?: boolean;
  [key: string]: any;
}

interface AgentHubRowActionsProps {
  agent: AgentHubData;
  onAgentClick: (agent: AgentHubData) => void;
}

function AgentHubRowActions({ agent, onAgentClick }: AgentHubRowActionsProps) {
  const { t } = useTranslation();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("aiHub.agent.openActions")}
        data-testid={`agent-hub-actions-${agent.agent_id || agent.name}`}
        className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), "text-muted-foreground")}
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem data-testid="agent-hub-action-details" onClick={() => onAgentClick(agent)}>
          <Info />
          {t("aiHub.viewDetails")}
        </DropdownMenuItem>
        <DropdownMenuItem
          data-testid="agent-hub-action-copy"
          onClick={() => void copyToClipboard(agent.name, t("aiHub.agent.nameCopied"))}
        >
          <Copy />
          {t("aiHub.agent.copyName")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface AgentHubTableColumnsDeps {
  onAgentClick: (agent: AgentHubData) => void;
  language?: Language;
}

export const getAgentHubTableColumns = ({
  onAgentClick,
  language = "en",
}: AgentHubTableColumnsDeps): ColumnDef<AgentHubData>[] => {
  const t: Translate = (key, params) => translate(language, key, params);
  return [
    {
      id: "name",
      accessorKey: "name",
      meta: { title: t("aiHub.agentName") },
      header: ({ column }) => <DataTableSortHeader column={column} title={t("aiHub.agentName")} />,
      size: 200,
      enableSorting: true,
      sortingFn: "alphanumeric",
      cell: ({ row }) => (
        <IdentityCell title={row.original.name} className="max-w-72" onClick={() => onAgentClick(row.original)} />
      ),
    },
    {
      id: "description",
      accessorKey: "description",
      meta: { title: t("common.description"), className: "hidden md:table-cell" },
      header: ({ column }) => <DataTableSortHeader column={column} title={t("common.description")} />,
      size: 240,
      enableSorting: true,
      sortingFn: "alphanumeric",
      cell: ({ row }) => (
        <span className="block max-w-72 truncate text-xs" title={row.original.description || undefined}>
          {row.original.description || "-"}
        </span>
      ),
    },
    {
      id: "version",
      accessorKey: "version",
      meta: { title: t("aiHub.version"), skeleton: "badge", className: "hidden lg:table-cell" },
      header: ({ column }) => <DataTableSortHeader column={column} title={t("aiHub.version")} />,
      size: 100,
      enableSorting: true,
      sortingFn: "alphanumeric",
      cell: ({ row }) => (
        <Badge variant="outline" className="font-mono font-normal">
          v{row.original.version}
        </Badge>
      ),
    },
    {
      id: "protocolVersion",
      accessorKey: "protocolVersion",
      meta: { title: t("aiHub.protocol"), className: "hidden lg:table-cell" },
      header: ({ column }) => <DataTableSortHeader column={column} title={t("aiHub.protocol")} />,
      size: 100,
      enableSorting: true,
      sortingFn: "alphanumeric",
      cell: ({ row }) => <span className="text-xs">{row.original.protocolVersion || "-"}</span>,
    },
    {
      id: "skills",
      meta: { title: t("aiHub.skills"), skeleton: "chips" },
      header: t("aiHub.skills"),
      size: 180,
      enableSorting: false,
      cell: ({ row }) => {
        const skills = row.original.skills || [];
        const skillLabel = (count: number) =>
          t(count === 1 ? "aiHub.skillCountOne" : "aiHub.skillCountOther", { count });
        return (
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium">{skillLabel(skills.length)}</span>
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {skills.slice(0, 2).map((skill) => (
                  <Badge key={skill.id} variant="secondary">
                    {skill.name}
                  </Badge>
                ))}
                {skills.length > 2 && <span className="text-xs text-muted-foreground">+{skills.length - 2}</span>}
              </div>
            )}
          </div>
        );
      },
    },
    {
      id: "capabilities",
      meta: { title: t("aiHub.capabilities"), skeleton: "chips" },
      header: t("aiHub.capabilities"),
      size: 160,
      enableSorting: false,
      cell: ({ row }) => {
        const capabilityList = Object.entries(row.original.capabilities || {})
          .filter(([, value]) => value === true)
          .map(([key]) => key);
        if (capabilityList.length === 0) {
          return <span className="text-xs text-muted-foreground">-</span>;
        }
        return (
          <div className="flex flex-wrap gap-1">
            {capabilityList.map((capability) => (
              <Badge key={capability} variant="outline">
                {capability}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      id: "io_modes",
      meta: { title: t("aiHub.ioModes"), skeleton: "twoLine", className: "hidden xl:table-cell" },
      header: t("aiHub.ioModes"),
      size: 150,
      enableSorting: false,
      cell: ({ row }) => {
        const inputModes = row.original.defaultInputModes || [];
        const outputModes = row.original.defaultOutputModes || [];
        return (
          <div className="flex flex-col gap-0.5 text-xs">
            <span>
              <span className="font-medium">{t("aiHub.input")}</span> {inputModes.join(", ") || "-"}
            </span>
            <span>
              <span className="font-medium">{t("aiHub.output")}</span> {outputModes.join(", ") || "-"}
            </span>
          </div>
        );
      },
    },
    {
      id: "is_public",
      accessorKey: "is_public",
      meta: { title: t("aiHub.public"), skeleton: "badge", className: "hidden md:table-cell" },
      header: ({ column }) => <DataTableSortHeader column={column} title={t("aiHub.public")} />,
      size: 100,
      enableSorting: true,
      sortingFn: (rowA, rowB) => {
        const publicA = rowA.original.is_public === true ? 1 : 0;
        const publicB = rowB.original.is_public === true ? 1 : 0;
        return publicA - publicB;
      },
      cell: ({ row }) => {
        const isPublic = row.original.is_public === true;
        return (
          <StatusBadge tone={isPublic ? "success" : "neutral"} label={isPublic ? t("common.yes") : t("common.no")} />
        );
      },
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
          <AgentHubRowActions agent={row.original} onAgentClick={onAgentClick} />
        </div>
      ),
    },
  ];
};
