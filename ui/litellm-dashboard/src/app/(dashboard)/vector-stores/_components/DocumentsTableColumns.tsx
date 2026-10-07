"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Copy, MoreHorizontal, Trash2 } from "lucide-react";

import { StatusBadge, type StatusTone } from "@/components/shared/table_cells";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DocumentUpload } from "@/components/vector_store_management/types";
import { cn } from "@/lib/cva.config";
import { copyToClipboard } from "@/utils/dataUtils";
import { translate, useTranslation, type Translate } from "@/i18n";

const STATUS_TONE: Record<DocumentUpload["status"], StatusTone> = {
  uploading: "info",
  done: "success",
  error: "error",
  removed: "neutral",
};

const STATUS_LABEL_KEY: Record<DocumentUpload["status"], string> = {
  uploading: "vectorStores.documents.status.uploading",
  done: "vectorStores.documents.status.ready",
  error: "vectorStores.documents.status.error",
  removed: "vectorStores.documents.status.removed",
};

function formatFileSize(bytes?: number): string {
  if (!bytes) return "-";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(2)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
}

function DocumentRowActions({ document, onRemove }: { document: DocumentUpload; onRemove: (uid: string) => void }) {
  const { t } = useTranslation();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("vectorStores.documents.openActions")}
        data-testid={`document-actions-${document.uid}`}
        className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), "text-muted-foreground")}
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem
          data-testid="document-action-copy"
          onClick={() => void copyToClipboard(document.uid, t("vectorStores.documents.copiedToast"))}
        >
          <Copy />
          {t("vectorStores.documents.copyId")}
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          data-testid="document-action-remove"
          onClick={() => onRemove(document.uid)}
        >
          <Trash2 />
          {t("vectorStores.documents.remove")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface DocumentsTableColumnsDeps {
  onRemove: (uid: string) => void;
  t?: Translate;
}

export const getDocumentsTableColumns = ({
  onRemove,
  t = translate,
}: DocumentsTableColumnsDeps): ColumnDef<DocumentUpload>[] => [
  {
    id: "name",
    accessorKey: "name",
    meta: { title: t("vectorStores.documents.col.name") },
    header: t("vectorStores.documents.col.name"),
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="block max-w-72 truncate text-sm" title={row.original.name}>
          {row.original.name}
        </span>
        {row.original.size ? (
          <span className="text-xs text-muted-foreground">({formatFileSize(row.original.size)})</span>
        ) : null}
      </div>
    ),
  },
  {
    id: "status",
    accessorKey: "status",
    meta: { title: t("vectorStores.documents.col.status"), skeleton: "badge" },
    header: t("vectorStores.documents.col.status"),
    size: 150,
    enableSorting: false,
    cell: ({ row }) => {
      const key = STATUS_LABEL_KEY[row.original.status];
      const label = key ? t(key) : row.original.status;
      return <StatusBadge tone={STATUS_TONE[row.original.status] ?? "neutral"} label={label} />;
    },
  },
  {
    id: "actions",
    meta: { className: "text-right", headerClassName: "text-right" },
    header: () => <span className="sr-only">{t("vectorStores.documents.col.actions")}</span>,
    size: 64,
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <DocumentRowActions document={row.original} onRemove={onRemove} />
      </div>
    ),
  },
];
