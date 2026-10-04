"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { DataTableSortHeader } from "@/components/shared/DataTable";
import { CellTooltip, DateCell, IdentityCell } from "@/components/shared/table_cells";
import { Tag } from "@/components/tag_management/types";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/cva.config";
import { useTranslation, type Translate } from "@/i18n";

export const DYNAMIC_SPEND_TAG_DESCRIPTION =
  "This is just a spend tag that was passed dynamically in a request. It does not control any LLM models.";

const isDynamicSpendTag = (tag: Tag) => tag.description === DYNAMIC_SPEND_TAG_DESCRIPTION;

function TagNameCell({ tag, onSelectTag }: { tag: Tag; onSelectTag: (tagName: string) => void }) {
  const { t } = useTranslation();
  if (isDynamicSpendTag(tag)) {
    return (
      <CellTooltip
        content={t("tagMgmt.dynamicViewHint")}
        trigger={<span className="block max-w-60 truncate font-mono text-xs text-muted-foreground">{tag.name}</span>}
      />
    );
  }
  return (
    <IdentityCell
      title={tag.name}
      titleClassName="font-mono text-xs font-normal text-primary"
      className="max-w-60"
      onClick={() => onSelectTag(tag.name)}
    />
  );
}

function TagModelsCell({ tag }: { tag: Tag }) {
  const { t } = useTranslation();
  const models = tag.models ?? [];
  if (models.length === 0) {
    return <Badge variant="secondary">{t("tagMgmt.allModels")}</Badge>;
  }
  return (
    <div className="flex flex-wrap items-center gap-1">
      {models.map((modelId) => (
        <CellTooltip
          key={modelId}
          content={t("tagMgmt.modelId", { id: modelId })}
          trigger={
            <Badge variant="outline" className="cursor-default">
              {tag.model_info?.[modelId] || modelId}
            </Badge>
          }
        />
      ))}
    </div>
  );
}

interface TagRowActionsProps {
  tag: Tag;
  onEdit: (tag: Tag) => void;
  onDelete: (tagName: string) => void;
}

function TagRowActions({ tag, onEdit, onDelete }: TagRowActionsProps) {
  const { t } = useTranslation();
  const isDynamic = isDynamicSpendTag(tag);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("tagMgmt.openActions")}
        data-testid={`tag-actions-${tag.name}`}
        className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), "text-muted-foreground")}
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem
          disabled={isDynamic}
          data-testid="tag-action-edit"
          title={isDynamic ? t("tagMgmt.dynamicEditHint") : undefined}
          onClick={() => onEdit(tag)}
        >
          <Pencil />
          {t("tagMgmt.edit")}
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          disabled={isDynamic}
          data-testid="tag-action-delete"
          title={isDynamic ? t("tagMgmt.dynamicDeleteHint") : undefined}
          onClick={() => onDelete(tag.name)}
        >
          <Trash2 />
          {t("tagMgmt.delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface TagTableColumnsDeps {
  onSelectTag: (tagName: string) => void;
  onEdit: (tag: Tag) => void;
  onDelete: (tagName: string) => void;
  t: Translate;
}

export const getTagTableColumns = ({ onSelectTag, onEdit, onDelete, t }: TagTableColumnsDeps): ColumnDef<Tag>[] => [
  {
    id: "name",
    accessorKey: "name",
    meta: { title: t("tagMgmt.name") },
    header: ({ column }) => <DataTableSortHeader column={column} title={t("tagMgmt.name")} />,
    size: 260,
    enableSorting: true,
    filterFn: "includesString",
    cell: ({ row }) => <TagNameCell tag={row.original} onSelectTag={onSelectTag} />,
  },
  {
    id: "description",
    accessorKey: "description",
    meta: { title: t("tagMgmt.description") },
    header: t("tagMgmt.description"),
    size: 300,
    enableSorting: false,
    filterFn: "includesString",
    cell: ({ row }) => {
      const description = row.original.description;
      return (
        <span className="block max-w-72 truncate text-sm text-muted-foreground" title={description}>
          {description || "-"}
        </span>
      );
    },
  },
  {
    id: "models",
    meta: { title: t("tagMgmt.allowedModels"), skeleton: "chips" },
    header: t("tagMgmt.allowedModels"),
    size: 240,
    enableSorting: false,
    cell: ({ row }) => <TagModelsCell tag={row.original} />,
  },
  {
    id: "created_at",
    accessorKey: "created_at",
    sortingFn: "datetime",
    meta: { title: t("tagMgmt.createdColumn") },
    header: ({ column }) => <DataTableSortHeader column={column} title={t("tagMgmt.createdColumn")} />,
    size: 150,
    enableSorting: true,
    cell: ({ row }) => <DateCell value={row.original.created_at} precision="date" />,
  },
  {
    id: "actions",
    meta: { className: "text-right", headerClassName: "text-right" },
    header: () => <span className="sr-only">{t("tagMgmt.actions")}</span>,
    size: 64,
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <TagRowActions tag={row.original} onEdit={onEdit} onDelete={onDelete} />
      </div>
    ),
  },
];
