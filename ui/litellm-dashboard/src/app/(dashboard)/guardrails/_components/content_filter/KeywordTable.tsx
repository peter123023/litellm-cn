import { Trash2 } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ACTION_ITEMS } from "./action_options";
import { useTranslation } from "@/i18n";

interface BlockedWord {
  id: string;
  keyword: string;
  action: "BLOCK" | "MASK";
  description?: string;
}

interface KeywordTableProps {
  keywords: BlockedWord[];
  onActionChange: (id: string, field: string, value: any) => void;
  onRemove: (id: string) => void;
}

const KeywordTable: React.FC<KeywordTableProps> = ({ keywords, onActionChange, onRemove }) => {
  const { t } = useTranslation();
  const actionItems = ACTION_ITEMS.map((item) => ({ value: item.value, label: t(item.labelKey) }));

  const columns: ColumnDef<BlockedWord>[] = [
    {
      header: t("contentFilter.keywordLabel"),
      accessorKey: "keyword",
    },
    {
      header: t("contentFilter.actionLabel"),
      accessorKey: "action",
      size: 150,
      cell: ({ row }) => (
        <Select
          items={actionItems}
          value={row.original.action}
          onValueChange={(value: string | null) => value && onActionChange(row.original.id, "action", value)}
        >
          <SelectTrigger size="sm" className="w-[120px]" aria-label={t("contentFilter.actionLabel")}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ACTION_ITEMS.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {t(item.labelKey)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
    },
    {
      header: t("contentFilter.descriptionLabel"),
      accessorKey: "description",
      cell: ({ row }) => row.original.description || "-",
    },
    {
      header: "",
      id: "actions",
      size: 100,
      cell: ({ row }) => (
        <Button variant="ghost" size="sm" onClick={() => onRemove(row.original.id)}>
          <Trash2 />
          {t("common.delete")}
        </Button>
      ),
    },
  ];

  if (keywords.length === 0) {
    return <div className="py-10 text-center text-muted-foreground">{t("contentFilter.noKeywords")}</div>;
  }

  return <DataTable data={keywords} columns={columns} getRowId={(row) => row.id} size="compact" />;
};

export default KeywordTable;
