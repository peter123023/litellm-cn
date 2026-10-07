"use client";

import type { ColumnFiltersState, OnChangeFn, PaginationState, SortingState } from "@tanstack/react-table";
import { ScrollText } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

import { useUserEmailLookup } from "@/app/(dashboard)/hooks/users/useUsers";
import { DataTable, DataTableFilterDrawer, DataTableToolbar } from "@/components/shared/DataTable";
import { useTranslation, type Translate } from "@/i18n";

import type { Team } from "../key_team_helpers/key_list";
import type { LogEntry } from "./columns";
import { CREDENTIAL_LABEL_KEYS, SPAN_TYPE_LABEL_KEYS, labelFromKeys } from "./constants";
import { LOG_FILTER_IDS, logFilterLabels, type LogsWindow } from "./log_filter_logic";
import { RequestLogsFilters } from "./RequestLogsFilters";
import { getRequestLogsTableColumns } from "./RequestLogsTableColumns";

interface RequestLogsTableProps {
  data: LogEntry[];
  rowCount: number;
  isLoading: boolean;
  isRefreshing: boolean;
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  columnFilters: ColumnFiltersState;
  onColumnFiltersChange: OnChangeFn<ColumnFiltersState>;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
  onRowClick: (log: LogEntry) => void;
  onKeyHashClick: (keyHash: string) => void;
  onSessionClick: (log: LogEntry) => void;
  teams: Team[];
  logsWindow: LogsWindow;
  toolbarChildren?: ReactNode;
}

const filterValueFormatter =
  (t: Translate) =>
  (columnId: string, value: unknown): string => {
    if (columnId === LOG_FILTER_IDS.SPAN_TYPE) {
      return labelFromKeys(t, SPAN_TYPE_LABEL_KEYS, String(value));
    }
    if (columnId === LOG_FILTER_IDS.CREDENTIAL) {
      return labelFromKeys(t, CREDENTIAL_LABEL_KEYS, String(value));
    }
    return Array.isArray(value) ? value.join(", ") : String(value);
  };

function RequestLogsEmptyState({ filtered, t }: { filtered: boolean; t: Translate }) {
  return (
    <div className="flex flex-col items-center gap-1 py-6">
      <div className="mb-1 flex size-10 items-center justify-center rounded-lg bg-muted">
        <ScrollText className="size-5 text-muted-foreground" />
      </div>
      <div className="text-sm font-medium text-foreground">
        {filtered ? t("logs.request.emptyFilteredTitle") : t("logs.request.emptyTitle")}
      </div>
      <div className="max-w-xs text-center text-sm text-muted-foreground">
        {filtered ? t("logs.request.emptyFilteredDesc") : t("logs.request.emptyDesc")}
      </div>
    </div>
  );
}

export function RequestLogsTable({
  data,
  rowCount,
  isLoading,
  isRefreshing,
  pagination,
  onPaginationChange,
  sorting,
  onSortingChange,
  columnFilters,
  onColumnFiltersChange,
  searchValue,
  onSearchChange,
  onRefresh,
  onRowClick,
  onKeyHashClick,
  onSessionClick,
  teams,
  logsWindow,
  toolbarChildren,
}: RequestLogsTableProps) {
  const { t } = useTranslation();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const userIds = useMemo(() => data.flatMap((log) => (log.user ? [log.user] : [])), [data]);
  const { data: emailByUserId } = useUserEmailLookup(userIds);

  const columns = useMemo(() => {
    const resolveUserEmail = (userId: string) => emailByUserId?.[userId];
    return getRequestLogsTableColumns({ onKeyHashClick, onSessionClick, resolveUserEmail, t });
  }, [onKeyHashClick, onSessionClick, emailByUserId, t]);

  const isFiltered = columnFilters.length > 0 || searchValue !== "";

  return (
    <DataTable
      data={data}
      columns={columns}
      getRowId={(row) => row.request_id}
      fillHeight
      sortingMode="server"
      sorting={sorting}
      onSortingChange={onSortingChange}
      paginationMode="server"
      pagination={pagination}
      onPaginationChange={onPaginationChange}
      rowCount={rowCount}
      filterMode="server"
      columnFilters={columnFilters}
      onColumnFiltersChange={onColumnFiltersChange}
      isLoading={isLoading}
      loadingMessage={t("logs.request.loading")}
      noDataMessage={<RequestLogsEmptyState filtered={isFiltered} t={t} />}
      size="compact"
      onRowClick={onRowClick}
      toolbar={(table) => (
        <>
          <DataTableToolbar
            table={table}
            searchValue={searchValue}
            onSearchChange={onSearchChange}
            searchPlaceholder={t("logs.request.searchPlaceholder")}
            onRefresh={onRefresh}
            isRefreshing={isRefreshing}
            onOpenFilters={() => setFiltersOpen(true)}
            filterLabels={logFilterLabels(t)}
            formatFilterValue={filterValueFormatter(t)}
            showViewOptions={false}
          >
            {toolbarChildren}
          </DataTableToolbar>
          <DataTableFilterDrawer
            table={table}
            open={filtersOpen}
            onOpenChange={setFiltersOpen}
            title={t("logs.request.filterDrawerTitle")}
            description={t("logs.request.filterDrawerDescription")}
          >
            {({ get, set }) => <RequestLogsFilters get={get} set={set} teams={teams} logsWindow={logsWindow} />}
          </DataTableFilterDrawer>
        </>
      )}
    />
  );
}
