"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Copy, MoreHorizontal, Trash2 } from "lucide-react";

import { DataTableSortHeader } from "@/components/shared/DataTable";
import { DateCell, IdCell, StatusBadge } from "@/components/shared/table_cells";
import { PolicyAttachment } from "@/components/policies/types";
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
import { DEFAULT_LANGUAGE, translate, Translate, useTranslation } from "@/i18n";

import ImpactPopover from "./impact_popover";

const englishT: Translate = (key, params) => translate(DEFAULT_LANGUAGE, key, params);

function ChipList({ values }: { values: string[] }) {
  if (values.length === 0) {
    return <span className="text-muted-foreground">-</span>;
  }
  return (
    <div className="flex flex-wrap items-center gap-1">
      {values.slice(0, 2).map((value) => (
        <StatusBadge key={value} tone="neutral" label={value} />
      ))}
      {values.length > 2 && (
        <StatusBadge tone="neutral" label={`+${values.length - 2}`} tooltip={values.slice(2).join(", ")} />
      )}
    </div>
  );
}

interface AttachmentRowActionsProps {
  attachment: PolicyAttachment;
  isAdmin: boolean;
  onDeleteClick: (attachmentId: string) => void;
  t?: Translate;
}

const CONFIG_ATTACHMENT_HINT = "policies.attachments.configAttachmentHint";

function AttachmentRowActions({ attachment, isAdmin, onDeleteClick }: AttachmentRowActionsProps) {
  const { t } = useTranslation();
  const isConfigAttachment = attachment.definition_location === "config";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("policies.attachments.openActions")}
        data-testid={`attachment-actions-${attachment.attachment_id}`}
        className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), "text-muted-foreground")}
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem
          data-testid="attachment-action-copy-id"
          onClick={() => void copyToClipboard(attachment.attachment_id, t("policies.attachments.idCopied"))}
        >
          <Copy />
          {t("policies.attachments.copyId")}
        </DropdownMenuItem>
        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              data-testid="attachment-action-delete"
              disabled={isConfigAttachment}
              title={isConfigAttachment ? t(CONFIG_ATTACHMENT_HINT) : undefined}
              onClick={() => onDeleteClick(attachment.attachment_id)}
            >
              <Trash2 />
              {t("policies.attachments.deleteAttachment")}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface AttachmentTableColumnsDeps {
  isAdmin: boolean;
  accessToken: string | null;
  onDeleteClick: (attachmentId: string) => void;
  t?: Translate;
}

export const getAttachmentTableColumns = ({
  isAdmin,
  accessToken,
  onDeleteClick,
  t = englishT,
}: AttachmentTableColumnsDeps): ColumnDef<PolicyAttachment>[] => [
  {
    id: "attachment_id",
    accessorKey: "attachment_id",
    meta: { title: t("policies.attachments.colAttachmentId") },
    header: t("policies.attachments.colAttachmentId"),
    size: 160,
    enableSorting: false,
    cell: ({ row }) => <IdCell value={row.original.attachment_id} variant="plain" />,
  },
  {
    id: "policy_name",
    accessorKey: "policy_name",
    meta: { title: t("policies.attachments.colPolicy"), skeleton: "badge" },
    header: ({ column }) => <DataTableSortHeader column={column} title={t("policies.attachments.colPolicy")} />,
    size: 180,
    enableSorting: true,
    cell: ({ row }) => <StatusBadge tone="info" label={row.original.policy_name} />,
  },
  {
    id: "scope",
    accessorFn: (row) => row.scope ?? "",
    meta: { title: t("policies.attachments.colScope"), skeleton: "badge" },
    header: t("policies.attachments.colScope"),
    size: 120,
    enableSorting: false,
    cell: ({ row }) => {
      const scope = row.original.scope;
      if (!scope) {
        return <span className="text-muted-foreground">-</span>;
      }
      if (scope === "*") {
        return <StatusBadge tone="warning" label={t("policies.attachments.globalBadge")} />;
      }
      return (
        <span className="block max-w-40 truncate text-xs" title={scope}>
          {scope}
        </span>
      );
    },
  },
  {
    id: "teams",
    meta: { title: t("policies.attachments.colTeams"), skeleton: "chips" },
    header: t("policies.attachments.colTeams"),
    size: 160,
    enableSorting: false,
    cell: ({ row }) => <ChipList values={row.original.teams ?? []} />,
  },
  {
    id: "keys",
    meta: { title: t("policies.attachments.colKeys"), skeleton: "chips" },
    header: t("policies.attachments.colKeys"),
    size: 160,
    enableSorting: false,
    cell: ({ row }) => <ChipList values={row.original.keys ?? []} />,
  },
  {
    id: "models",
    meta: { title: t("policies.attachments.colModels"), skeleton: "chips" },
    header: t("policies.attachments.colModels"),
    size: 160,
    enableSorting: false,
    cell: ({ row }) => <ChipList values={row.original.models ?? []} />,
  },
  {
    id: "tags",
    meta: { title: t("policies.attachments.colTags"), skeleton: "chips" },
    header: t("policies.attachments.colTags"),
    size: 160,
    enableSorting: false,
    cell: ({ row }) => <ChipList values={row.original.tags ?? []} />,
  },
  {
    id: "priority",
    accessorFn: (row) => row.priority ?? Number.POSITIVE_INFINITY,
    meta: { title: t("policies.attachments.colPriority") },
    header: ({ column }) => <DataTableSortHeader column={column} title={t("policies.attachments.colPriority")} />,
    size: 100,
    enableSorting: true,
    cell: ({ row }) =>
      row.original.priority == null ? (
        <span className="text-muted-foreground">-</span>
      ) : (
        <span className="font-mono text-xs">{row.original.priority}</span>
      ),
  },
  {
    id: "default",
    accessorFn: (row) => (row.default ? 1 : 0),
    meta: { title: t("policies.attachments.colDefault") },
    header: ({ column }) => <DataTableSortHeader column={column} title={t("policies.attachments.colDefault")} />,
    size: 100,
    enableSorting: true,
    cell: ({ row }) =>
      row.original.default ? (
        <StatusBadge
          tone="info"
          label={t("policies.attachments.defaultBadge")}
          tooltip={t("policies.attachments.defaultTooltip")}
        />
      ) : (
        <span className="text-muted-foreground">-</span>
      ),
  },
  {
    id: "created_at",
    accessorFn: (row) => row.created_at ?? "",
    meta: { title: t("policies.attachments.colCreatedAt") },
    header: ({ column }) => <DataTableSortHeader column={column} title={t("policies.attachments.colCreatedAt")} />,
    size: 150,
    enableSorting: true,
    cell: ({ row }) => <DateCell value={row.original.created_at} />,
  },
  {
    id: "actions",
    meta: { className: "text-right", headerClassName: "text-right" },
    header: () => <span className="sr-only">{t("policies.attachments.colActions")}</span>,
    size: 88,
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => (
      <div className="flex items-center justify-end gap-1">
        <ImpactPopover attachment={row.original} accessToken={accessToken} />
        <AttachmentRowActions attachment={row.original} isAdmin={isAdmin} onDeleteClick={onDeleteClick} />
      </div>
    ),
  },
];
