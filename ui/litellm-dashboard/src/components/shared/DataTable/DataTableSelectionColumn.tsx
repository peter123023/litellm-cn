"use client";

import type { ColumnDef, Row, RowData, Table } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { DEFAULT_LANGUAGE, translate, useTranslation } from "@/i18n";

interface SelectionColumnOptions<TData> {
  rowAriaLabel?: (row: Row<TData>) => string;
}

function SelectAllCheckbox<TData>({ table }: { table: Table<TData> }) {
  const { t } = useTranslation();
  const allSelected = table.getIsAllPageRowsSelected();
  const someSelected = table.getIsSomePageRowsSelected();

  return (
    <Checkbox
      aria-label={t("dataTable.selectAllRows")}
      data-testid="datatable-select-all"
      checked={allSelected}
      indeterminate={someSelected && !allSelected}
      onCheckedChange={(checked) => table.toggleAllPageRowsSelected(Boolean(checked))}
    />
  );
}

function SelectRowCheckbox<TData>({ row, label }: { row: Row<TData>; label?: string }) {
  const { t } = useTranslation();

  return (
    <Checkbox
      aria-label={label ?? t("dataTable.selectRow")}
      data-testid={`datatable-select-row-${row.id}`}
      checked={row.getIsSelected()}
      disabled={!row.getCanSelect()}
      onCheckedChange={(checked) => row.toggleSelected(Boolean(checked))}
    />
  );
}

export function createSelectionColumn<TData extends RowData>(
  options: SelectionColumnOptions<TData> = {},
): ColumnDef<TData, unknown> {
  const { rowAriaLabel } = options;

  return {
    id: "select",
    size: 44,
    enableSorting: false,
    enableHiding: false,
    enableResizing: false,
    meta: { title: translate(DEFAULT_LANGUAGE, "common.select"), className: "w-11", headerClassName: "w-11" },
    header: ({ table }) => <SelectAllCheckbox table={table} />,
    cell: ({ row }) => <SelectRowCheckbox row={row} label={rowAriaLabel?.(row)} />,
  };
}
