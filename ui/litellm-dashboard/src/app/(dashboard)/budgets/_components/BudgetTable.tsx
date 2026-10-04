"use client";

import { Inbox, ShieldAlert } from "lucide-react";
import React, { useMemo, useState } from "react";

import {
  BUDGET_DURATION_FILTER_OPTIONS,
  BUDGET_DURATION_UNSET,
  type CreatedAtFilterValue,
  type MaxBudgetFilterValue,
} from "@/app/(dashboard)/hooks/budgets/budgetFilters";
import type { budgetItem } from "@/app/(dashboard)/hooks/budgets/useBudgets";
import type { ResourceListResult } from "@/app/(dashboard)/hooks/common/useResourceList";
import {
  DataTable,
  DataTableFilterDrawer,
  DataTableFilterField,
  DataTableToolbar,
  type FilterDraft,
} from "@/components/shared/DataTable";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError } from "@/lib/http/client";
import { useTranslation, type Translate } from "@/i18n";

import { BUDGET_TABLE_HIDDEN_COLUMNS, getBudgetTableColumns } from "./BudgetTableColumns";

interface BudgetTableProps {
  list: ResourceListResult<budgetItem>;
  canModify: boolean;
  onEditClick: (budget: budgetItem) => void;
  onDeleteClick: (budget: budgetItem) => void;
}

const PAGE_SIZE_OPTIONS = [25, 50, 100];

const durationLabel = (value: string, t: Translate): string => {
  if (value === "1h") return t("budgets.duration.hourly");
  if (value === "24h") return t("budgets.duration.daily");
  if (value === "7d") return t("budgets.duration.weekly");
  if (value === "30d") return t("budgets.duration.monthly");
  if (value === BUDGET_DURATION_UNSET) return t("budgets.duration.notSet");
  return value;
};

const formatFilterValue =
  (t: Translate) =>
  (columnId: string, value: unknown): string => {
    if (columnId === "budget_duration") {
      return (Array.isArray(value) ? value : []).map((entry) => durationLabel(String(entry), t)).join(", ");
    }
    if (columnId === "max_budget") {
      const { min, max, unlimitedOnly } = (value ?? {}) as MaxBudgetFilterValue;
      return unlimitedOnly === true
        ? t("budgets.filters.unlimitedOnly")
        : t("budgets.filters.rangeValue", {
            from: min ? `$${min}` : t("budgets.filters.any"),
            to: max ? `$${max}` : t("budgets.filters.any"),
          });
    }
    if (columnId === "created_at") {
      const { from, to } = (value ?? {}) as CreatedAtFilterValue;
      return t("budgets.filters.rangeValue", {
        from: from || t("budgets.filters.any"),
        to: to || t("budgets.filters.any"),
      });
    }
    return String(value);
  };

/** The drawer keeps any non-empty object as an active filter, so collapse a blank draft to nothing. */
const normalizeMaxBudget = (draft: MaxBudgetFilterValue): MaxBudgetFilterValue | undefined => {
  if (draft.unlimitedOnly === true) {
    return { unlimitedOnly: true };
  }
  const min = draft.min?.trim() ?? "";
  const max = draft.max?.trim() ?? "";
  if (min === "" && max === "") {
    return undefined;
  }
  return { ...(min === "" ? {} : { min }), ...(max === "" ? {} : { max }) };
};

const normalizeCreatedAt = (draft: CreatedAtFilterValue): CreatedAtFilterValue | undefined => {
  const from = draft.from ?? "";
  const to = draft.to ?? "";
  if (from === "" && to === "") {
    return undefined;
  }
  return { ...(from === "" ? {} : { from }), ...(to === "" ? {} : { to }) };
};

function EmptyState({ hasQuery, t }: { hasQuery: boolean; t: Translate }) {
  return (
    <div className="flex flex-col items-center gap-1 py-6">
      <div className="mb-1 flex size-10 items-center justify-center rounded-lg bg-muted">
        <Inbox className="size-5 text-muted-foreground" />
      </div>
      <div className="text-sm font-medium text-foreground">
        {hasQuery ? t("budgets.empty.noMatch") : t("budgets.empty.none")}
      </div>
      <div className="text-sm text-muted-foreground">
        {hasQuery ? t("budgets.empty.noMatchBody") : t("budgets.empty.noneBody")}
      </div>
    </div>
  );
}

function ErrorState({ error, t }: { error: Error; t: Translate }) {
  const forbidden = error instanceof ApiError && error.status === 403;
  return (
    <div className="flex flex-col items-center gap-1 py-6">
      <div className="mb-1 flex size-10 items-center justify-center rounded-lg bg-muted">
        <ShieldAlert className="size-5 text-muted-foreground" />
      </div>
      <div className="text-sm font-medium text-foreground">
        {forbidden ? t("budgets.error.noAccess") : t("budgets.error.loadFailed")}
      </div>
      <div className="text-sm text-muted-foreground">{forbidden ? t("budgets.error.noAccessBody") : error.message}</div>
    </div>
  );
}

/** "Not set" and the concrete durations are exclusive; see serializeBudgetFilters for why. */
function DurationFilter({
  selected,
  onChange,
  t,
}: {
  selected: string[];
  onChange: (selected: string[]) => void;
  t: Translate;
}) {
  const toggle = (value: string, checked: boolean): void => {
    if (!checked) {
      onChange(selected.filter((entry) => entry !== value));
      return;
    }
    const kept = value === BUDGET_DURATION_UNSET ? [] : selected.filter((entry) => entry !== BUDGET_DURATION_UNSET);
    onChange([...kept, value]);
  };

  return (
    <div className="flex flex-col gap-2">
      {BUDGET_DURATION_FILTER_OPTIONS.map((option) => (
        <Label key={option.value} className="font-normal">
          <Checkbox
            checked={selected.includes(option.value)}
            onCheckedChange={(checked) => toggle(option.value, checked === true)}
            data-testid={`budget-filter-duration-${option.value}`}
          />
          {durationLabel(option.value, t)}
        </Label>
      ))}
    </div>
  );
}

function BudgetFilterFields({ get, set, t }: FilterDraft & { t: Translate }) {
  const maxBudget = (get("max_budget") as MaxBudgetFilterValue | undefined) ?? {};
  const created = (get("created_at") as CreatedAtFilterValue | undefined) ?? {};
  const unlimitedOnly = maxBudget.unlimitedOnly === true;

  return (
    <>
      <DataTableFilterField label={t("budgets.col.reset")}>
        <DurationFilter
          selected={(get("budget_duration") as string[] | undefined) ?? []}
          onChange={(selected) => set("budget_duration", selected)}
          t={t}
        />
      </DataTableFilterField>
      <DataTableFilterField label={t("budgets.filters.maxBudgetUsd")}>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min={0}
            step="0.01"
            value={maxBudget.min ?? ""}
            disabled={unlimitedOnly}
            onChange={(event) => set("max_budget", normalizeMaxBudget({ ...maxBudget, min: event.target.value }))}
            placeholder={t("budgets.filters.minPlaceholder")}
            aria-label={t("budgets.filters.minAria")}
            data-testid="budget-filter-max-budget-min"
          />
          <Input
            type="number"
            min={0}
            step="0.01"
            value={maxBudget.max ?? ""}
            disabled={unlimitedOnly}
            onChange={(event) => set("max_budget", normalizeMaxBudget({ ...maxBudget, max: event.target.value }))}
            placeholder={t("budgets.filters.maxPlaceholder")}
            aria-label={t("budgets.filters.maxAria")}
            data-testid="budget-filter-max-budget-max"
          />
        </div>
        <Label className="mt-1 font-normal">
          <Checkbox
            checked={unlimitedOnly}
            onCheckedChange={(checked) => set("max_budget", normalizeMaxBudget({ unlimitedOnly: checked === true }))}
            data-testid="budget-filter-max-budget-unlimited"
          />
          {t("budgets.filters.unlimitedOnly")}
        </Label>
      </DataTableFilterField>
      <DataTableFilterField label={t("budgets.col.created")}>
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={created.from ?? ""}
            onChange={(event) => set("created_at", normalizeCreatedAt({ ...created, from: event.target.value }))}
            aria-label={t("budgets.filters.createdFromAria")}
            data-testid="budget-filter-created-from"
          />
          <Input
            type="date"
            value={created.to ?? ""}
            onChange={(event) => set("created_at", normalizeCreatedAt({ ...created, to: event.target.value }))}
            aria-label={t("budgets.filters.createdToAria")}
            data-testid="budget-filter-created-to"
          />
        </div>
      </DataTableFilterField>
    </>
  );
}

const BudgetTable: React.FC<BudgetTableProps> = ({ list, canModify, onEditClick, onDeleteClick }) => {
  const { t } = useTranslation();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const columns = useMemo(
    () => getBudgetTableColumns({ canModify, t, onEditClick, onDeleteClick }),
    [canModify, t, onEditClick, onDeleteClick],
  );

  const filterLabels = useMemo<Record<string, string>>(
    () => ({
      budget_duration: t("budgets.col.reset"),
      max_budget: t("budgets.col.maxBudget"),
      created_at: t("budgets.col.created"),
    }),
    [t],
  );
  const formatValue = useMemo(() => formatFilterValue(t), [t]);

  const hasQuery = list.searchValue.trim() !== "" || list.columnFilters.length > 0;
  const emptyMessage =
    list.error === null ? <EmptyState hasQuery={hasQuery} t={t} /> : <ErrorState error={list.error} t={t} />;

  return (
    <DataTable
      data={list.rows}
      columns={columns}
      getRowId={(budget, index) => budget.budget_id || String(index)}
      defaultColumnVisibility={BUDGET_TABLE_HIDDEN_COLUMNS}
      fillHeight
      sortingMode="server"
      sorting={list.sorting}
      onSortingChange={list.onSortingChange}
      paginationMode="server"
      pagination={list.pagination}
      onPaginationChange={list.onPaginationChange}
      rowCount={list.rowCount}
      pageSizeOptions={PAGE_SIZE_OPTIONS}
      filterMode="server"
      columnFilters={list.columnFilters}
      onColumnFiltersChange={list.onColumnFiltersChange}
      isLoading={list.isLoading}
      loadingMessage={t("budgets.table.loading")}
      noDataMessage={emptyMessage}
      size="compact"
      toolbar={(table) => (
        <>
          <DataTableToolbar
            table={table}
            searchValue={list.searchValue}
            onSearchChange={list.onSearchChange}
            searchPlaceholder={t("budgets.table.searchPlaceholder")}
            onOpenFilters={() => setFiltersOpen(true)}
            onRefresh={list.refetch}
            isRefreshing={list.isFetching}
            filterLabels={filterLabels}
            formatFilterValue={formatValue}
          />
          <DataTableFilterDrawer
            table={table}
            open={filtersOpen}
            onOpenChange={setFiltersOpen}
            title={t("budgets.filters.title")}
            description={t("budgets.filters.description")}
          >
            {(draft) => <BudgetFilterFields {...draft} t={t} />}
          </DataTableFilterDrawer>
        </>
      )}
    />
  );
};

export default BudgetTable;
