"use client";

import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { DataTableSortHeader } from "@/components/shared/DataTable";
import { DateCell, IdCell, MoneyCell } from "@/components/shared/table_cells";
import type { budgetItem } from "@/app/(dashboard)/hooks/budgets/useBudgets";
import { buttonVariants } from "@/components/ui/button";
import type { Translate } from "@/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/cva.config";

/**
 * Filtering happens on the server, so this never runs as a predicate. It exists to override
 * TanStack's auto-remove heuristic, which infers a filter shape from the column's first cell
 * and silently discards a filter whose value is not that shape (a range object on a numeric
 * column, for instance).
 */
const serverFilter: FilterFn<budgetItem> = () => true;
serverFilter.autoRemove = () => false;

function RateLimitCell({ value }: { value: number | null | undefined }) {
  if (value == null) {
    return <span className="text-muted-foreground">n/a</span>;
  }
  return <span className="tabular-nums">{value}</span>;
}

const durationLabel = (value: string, t: Translate): string => {
  if (value === "1h") return t("budgets.duration.hourly");
  if (value === "24h") return t("budgets.duration.daily");
  if (value === "7d") return t("budgets.duration.weekly");
  if (value === "30d") return t("budgets.duration.monthly");
  return value;
};

function BudgetDurationCell({ value, t }: { value: string | null | undefined; t: Translate }) {
  if (!value) {
    return <span className="text-muted-foreground">{t("budgets.duration.notSet")}</span>;
  }
  return <span className="whitespace-nowrap">{durationLabel(value, t)}</span>;
}

interface BudgetRowActionsProps {
  budget: budgetItem;
  t: Translate;
  onEditClick: (budget: budgetItem) => void;
  onDeleteClick: (budget: budgetItem) => void;
}

function BudgetRowActions({ budget, t, onEditClick, onDeleteClick }: BudgetRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("budgets.table.openActionsAria")}
        data-testid={`budget-actions-${budget.budget_id}`}
        className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), "text-muted-foreground")}
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem data-testid="budget-action-edit" onClick={() => onEditClick(budget)}>
          <Pencil />
          {t("budgets.table.editAction")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          data-testid="budget-action-delete"
          onClick={() => onDeleteClick(budget)}
        >
          <Trash2 />
          {t("budgets.table.deleteAction")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Off by default so the table opens on the four columns it has always shown; the Columns menu turns them on. */
export const BUDGET_TABLE_HIDDEN_COLUMNS: Record<string, boolean> = {
  budget_duration: false,
  created_at: false,
};

interface BudgetTableColumnsDeps {
  canModify: boolean;
  t: Translate;
  onEditClick: (budget: budgetItem) => void;
  onDeleteClick: (budget: budgetItem) => void;
}

export const getBudgetTableColumns = ({
  canModify,
  t,
  onEditClick,
  onDeleteClick,
}: BudgetTableColumnsDeps): ColumnDef<budgetItem>[] => [
  {
    id: "budget_id",
    accessorKey: "budget_id",
    meta: { title: t("budgets.col.budgetId") },
    header: ({ column }) => <DataTableSortHeader column={column} title={t("budgets.col.budgetId")} />,
    cell: ({ row }) => (
      <IdCell value={row.original.budget_id} variant="plain" truncate={false} copyable className="whitespace-nowrap" />
    ),
  },
  {
    id: "max_budget",
    accessorKey: "max_budget",
    filterFn: serverFilter,
    meta: { title: t("budgets.col.maxBudget"), numeric: true },
    header: ({ column }) => <DataTableSortHeader column={column} title={t("budgets.col.maxBudget")} />,
    size: 120,
    cell: ({ row }) => (
      <MoneyCell value={row.original.max_budget} decimals={2} showZero emptyText={t("budgets.unlimited")} />
    ),
  },
  {
    id: "tpm_limit",
    accessorKey: "tpm_limit",
    meta: { title: t("budgets.col.tpm"), numeric: true },
    header: ({ column }) => <DataTableSortHeader column={column} title={t("budgets.col.tpm")} />,
    size: 100,
    cell: ({ row }) => <RateLimitCell value={row.original.tpm_limit} />,
  },
  {
    id: "rpm_limit",
    accessorKey: "rpm_limit",
    meta: { title: t("budgets.col.rpm"), numeric: true },
    header: ({ column }) => <DataTableSortHeader column={column} title={t("budgets.col.rpm")} />,
    size: 100,
    cell: ({ row }) => <RateLimitCell value={row.original.rpm_limit} />,
  },
  {
    id: "tpd_limit",
    accessorKey: "tpd_limit",
    meta: { title: t("budgets.col.tpdBatch"), numeric: true },
    header: ({ column }) => <DataTableSortHeader column={column} title={t("budgets.col.tpdBatch")} />,
    size: 110,
    cell: ({ row }) => <RateLimitCell value={row.original.tpd_limit} />,
  },
  {
    id: "budget_duration",
    accessorKey: "budget_duration",
    filterFn: serverFilter,
    meta: { title: t("budgets.col.reset") },
    // "7d"/"30d" sort lexicographically, not chronologically, so the route does not offer it.
    enableSorting: false,
    header: ({ column }) => <DataTableSortHeader column={column} title={t("budgets.col.reset")} />,
    size: 110,
    cell: ({ row }) => <BudgetDurationCell value={row.original.budget_duration} t={t} />,
  },
  {
    id: "created_at",
    accessorKey: "created_at",
    filterFn: serverFilter,
    meta: { title: t("budgets.col.created") },
    header: ({ column }) => <DataTableSortHeader column={column} title={t("budgets.col.created")} />,
    size: 160,
    cell: ({ row }) => <DateCell value={row.original.created_at} />,
  },
  ...(canModify
    ? [
        {
          id: "actions",
          meta: { className: "text-right", headerClassName: "text-right" },
          header: () => <span className="sr-only">{t("common.actions")}</span>,
          size: 64,
          enableSorting: false,
          enableHiding: false,
          cell: ({ row }) => (
            <div className="flex justify-end">
              <BudgetRowActions budget={row.original} t={t} onEditClick={onEditClick} onDeleteClick={onDeleteClick} />
            </div>
          ),
        } satisfies ColumnDef<budgetItem>,
      ]
    : []),
];
