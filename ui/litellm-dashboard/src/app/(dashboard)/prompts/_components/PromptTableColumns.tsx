"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Copy, MoreHorizontal, Trash2 } from "lucide-react";

import { DataTableSortHeader } from "@/components/shared/DataTable";
import { CellTooltip, DateCell, IdentityCell, StatusBadge, StatusTone } from "@/components/shared/table_cells";
import { PromptSpec } from "@/components/networking";
import { getProviderLogoAndName } from "@/components/provider_info_helpers";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/cva.config";
import { copyToClipboard } from "@/utils/dataUtils";
import { userDetailHref } from "@/utils/entityLinks";

import { extractModel, getProviderFromModelHub, ModelGroupInfo } from "./prompt_utils";
import { useTranslation, type Translate } from "@/i18n";

const ENVIRONMENT_TONE: Record<string, StatusTone> = {
  production: "error",
  staging: "warning",
  development: "success",
};

function PromptModelCell({ prompt, modelHubData }: { prompt: PromptSpec; modelHubData: Map<string, ModelGroupInfo> }) {
  const model = extractModel(prompt);
  if (!model) {
    return <span className="text-sm text-muted-foreground">-</span>;
  }

  const provider = getProviderFromModelHub(model, modelHubData);
  const { logo } = provider ? getProviderLogoAndName(provider) : { logo: "" };

  return (
    <CellTooltip
      content={model}
      trigger={
        <div className="flex items-center gap-2">
          {logo ? (
            <img
              src={logo}
              alt=""
              className="size-4 shrink-0"
              onError={(event) => {
                (event.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground">
              {provider?.charAt(0) || "-"}
            </span>
          )}
          <span className="max-w-40 truncate text-sm">{model}</span>
        </div>
      }
    />
  );
}

interface PromptRowActionsProps {
  prompt: PromptSpec;
  isAdmin: boolean;
  onDeleteClick?: (id: string, name: string, environment: string) => void;
}

function PromptRowActions({ prompt, isAdmin, onDeleteClick }: PromptRowActionsProps) {
  const { t } = useTranslation();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("prompts.table.actionsAria")}
        data-testid={`prompt-actions-${prompt.prompt_id}`}
        className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), "text-muted-foreground")}
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem
          data-testid="prompt-action-copy"
          onClick={() => void copyToClipboard(prompt.prompt_id, t("prompts.table.copiedId"))}
        >
          <Copy />
          {t("prompts.table.copyId")}
        </DropdownMenuItem>
        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              data-testid="prompt-action-delete"
              onClick={() =>
                onDeleteClick?.(
                  prompt.prompt_id,
                  prompt.prompt_id || t("prompts.table.unknownPrompt"),
                  prompt.environment || "development",
                )
              }
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

interface PromptTableColumnsDeps {
  modelHubData: Map<string, ModelGroupInfo>;
  isAdmin: boolean;
  onPromptClick?: (id: string, environment: string) => void;
  onDeleteClick?: (id: string, name: string, environment: string) => void;
  t: Translate;
}

export const getPromptTableColumns = ({
  modelHubData,
  isAdmin,
  onPromptClick,
  onDeleteClick,
  t,
}: PromptTableColumnsDeps): ColumnDef<PromptSpec>[] => [
  {
    id: "prompt_id",
    accessorKey: "prompt_id",
    meta: { title: t("prompts.table.promptId") },
    header: ({ column }) => <DataTableSortHeader column={column} title={t("prompts.table.promptId")} />,
    size: 220,
    enableSorting: true,
    cell: ({ row }) => (
      <IdentityCell
        title={row.original.prompt_id}
        titleClassName="font-mono text-xs font-normal"
        className="max-w-60"
        onClick={
          onPromptClick
            ? () => onPromptClick(row.original.prompt_id, row.original.environment || "development")
            : undefined
        }
      />
    ),
  },
  {
    id: "model",
    meta: { title: t("prompts.field.model") },
    header: t("prompts.field.model"),
    size: 200,
    enableSorting: false,
    cell: ({ row }) => <PromptModelCell prompt={row.original} modelHubData={modelHubData} />,
  },
  {
    id: "created_at",
    accessorKey: "created_at",
    sortingFn: "datetime",
    meta: { title: t("prompts.field.createdAt") },
    header: ({ column }) => <DataTableSortHeader column={column} title={t("prompts.field.createdAt")} />,
    size: 160,
    enableSorting: true,
    cell: ({ row }) => <DateCell value={row.original.created_at} />,
  },
  {
    id: "updated_at",
    accessorKey: "updated_at",
    sortingFn: "datetime",
    meta: { title: t("prompts.field.updatedAt") },
    header: ({ column }) => <DataTableSortHeader column={column} title={t("prompts.field.updatedAt")} />,
    size: 160,
    enableSorting: true,
    cell: ({ row }) => <DateCell value={row.original.updated_at} />,
  },
  {
    id: "environment",
    accessorKey: "environment",
    meta: { title: t("prompts.field.environment"), skeleton: "badge" },
    header: t("prompts.field.environment"),
    size: 130,
    enableSorting: false,
    cell: ({ row }) => {
      const environment = row.original.environment || "development";
      return <StatusBadge tone={ENVIRONMENT_TONE[environment] ?? "neutral"} label={environment} />;
    },
  },
  {
    id: "created_by",
    accessorKey: "created_by",
    meta: { title: t("prompts.field.createdBy") },
    header: t("prompts.field.createdBy"),
    size: 160,
    enableSorting: false,
    cell: ({ row }) => {
      const createdBy = row.original.created_by;
      if (!createdBy) {
        return <span className="text-muted-foreground">-</span>;
      }
      return (
        <span className="block max-w-60" title={createdBy}>
          <IdentityCell
            title={createdBy}
            titleClassName="font-normal text-muted-foreground"
            href={userDetailHref(createdBy)}
          />
        </span>
      );
    },
  },
  {
    id: "prompt_type",
    accessorKey: "prompt_info.prompt_type",
    meta: { title: t("common.type") },
    header: t("common.type"),
    size: 140,
    enableSorting: false,
    cell: ({ row }) => {
      const promptType = row.original.prompt_info.prompt_type;
      return (
        <span className="block max-w-40 truncate text-sm" title={promptType}>
          {promptType}
        </span>
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
        <PromptRowActions prompt={row.original} isAdmin={isAdmin} onDeleteClick={onDeleteClick} />
      </div>
    ),
  },
];
