"use client";

import { ColumnFiltersState, OnChangeFn, PaginationState } from "@tanstack/react-table";
import { ScrollText } from "lucide-react";
import { useMemo, useState } from "react";

import {
  DataTable,
  DataTableFilterDrawer,
  DataTableFilterField,
  DataTableToolbar,
} from "@/components/shared/DataTable";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation, type Translate } from "@/i18n";

import {
  AUDIT_ACTION_LABEL_KEYS,
  AUDIT_TABLE_NAME_LABEL_KEYS,
  AuditLogEntry,
  getAuditLogsTableColumns,
} from "./AuditLogsTableColumns";

interface AuditLogsTableProps {
  data: AuditLogEntry[];
  rowCount: number;
  isLoading: boolean;
  isRefreshing: boolean;
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
  columnFilters: ColumnFiltersState;
  onColumnFiltersChange: OnChangeFn<ColumnFiltersState>;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onRefresh: () => void;
  onViewLog: (log: AuditLogEntry) => void;
}

const ALL_VALUE = "all";

const ACTION_ITEM_KEYS: readonly { labelKey: string; value: string }[] = [
  { labelKey: "logs.audit.action.created", value: "created" },
  { labelKey: "logs.audit.action.updated", value: "updated" },
  { labelKey: "logs.audit.action.deleted", value: "deleted" },
  { labelKey: "logs.audit.action.rotated", value: "rotated" },
  { labelKey: "logs.audit.action.kill_switch_fired", value: "kill_switch_fired" },
];

const TABLE_ITEM_KEYS: readonly { labelKey: string; value: string }[] = [
  { labelKey: "logs.audit.table.keys", value: "LiteLLM_VerificationToken" },
  { labelKey: "logs.audit.table.teams", value: "LiteLLM_TeamTable" },
  { labelKey: "logs.audit.table.users", value: "LiteLLM_UserTable" },
  { labelKey: "logs.audit.table.organizations", value: "LiteLLM_OrganizationTable" },
  { labelKey: "logs.audit.table.models", value: "LiteLLM_ProxyModelTable" },
  { labelKey: "logs.audit.table.agents", value: "LiteLLM_AgentsTable" },
];

const selectItems = (t: Translate, items: readonly { labelKey: string; value: string }[]) =>
  items.map(({ labelKey, value }) => ({ label: t(labelKey), value }));

const FILTER_LABEL_KEYS: Record<string, string> = {
  object_id: "logs.audit.filter.objectId",
  changed_by: "logs.audit.filter.changedBy",
  team_id: "logs.audit.filter.teamId",
  key_hash: "logs.audit.filter.keyHash",
  action: "logs.audit.filter.action",
  table_name: "logs.audit.filter.table",
};

const auditFilterLabels = (t: Translate): Record<string, string> =>
  Object.fromEntries(Object.entries(FILTER_LABEL_KEYS).map(([id, key]) => [id, t(key)]));

const filterValueFormatter =
  (t: Translate) =>
  (columnId: string, value: unknown): string => {
    const raw = String(value);
    if (columnId === "action") {
      return AUDIT_ACTION_LABEL_KEYS[raw] ? t(AUDIT_ACTION_LABEL_KEYS[raw]) : raw;
    }
    if (columnId === "table_name") {
      return AUDIT_TABLE_NAME_LABEL_KEYS[raw] ? t(AUDIT_TABLE_NAME_LABEL_KEYS[raw]) : raw;
    }
    return raw;
  };

function AuditLogsEmptyState({ filtered, t }: { filtered: boolean; t: Translate }) {
  return (
    <div className="flex flex-col items-center gap-1 py-6">
      <div className="mb-1 flex size-10 items-center justify-center rounded-lg bg-muted">
        <ScrollText className="size-5 text-muted-foreground" />
      </div>
      <div className="text-sm font-medium text-foreground">
        {filtered ? t("logs.audit.emptyFilteredTitle") : t("logs.audit.emptyTitle")}
      </div>
      <div className="max-w-xs text-center text-sm text-muted-foreground">
        {filtered ? t("logs.audit.emptyFilteredDesc") : t("logs.audit.emptyDesc")}
      </div>
    </div>
  );
}

export function AuditLogsTable({
  data,
  rowCount,
  isLoading,
  isRefreshing,
  pagination,
  onPaginationChange,
  columnFilters,
  onColumnFiltersChange,
  searchValue,
  onSearchChange,
  onRefresh,
  onViewLog,
}: AuditLogsTableProps) {
  const { t } = useTranslation();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const actionFilterItems = useMemo(
    () => [{ label: t("logs.audit.allActions"), value: ALL_VALUE }, ...selectItems(t, ACTION_ITEM_KEYS)],
    [t],
  );
  const tableFilterItems = useMemo(
    () => [{ label: t("logs.audit.allTables"), value: ALL_VALUE }, ...selectItems(t, TABLE_ITEM_KEYS)],
    [t],
  );
  const columns = useMemo(() => getAuditLogsTableColumns({ onViewLog, t }), [onViewLog, t]);
  const hasActiveSearch = Boolean(searchValue?.trim());

  return (
    <DataTable
      fillHeight
      data={data}
      columns={columns}
      getRowId={(row) => row.id}
      paginationMode="server"
      pagination={pagination}
      onPaginationChange={onPaginationChange}
      rowCount={rowCount}
      filterMode="server"
      columnFilters={columnFilters}
      onColumnFiltersChange={onColumnFiltersChange}
      isLoading={isLoading}
      loadingMessage={t("logs.audit.loading")}
      noDataMessage={<AuditLogsEmptyState filtered={columnFilters.length > 0 || hasActiveSearch} t={t} />}
      size="compact"
      toolbar={(table) => (
        <>
          <DataTableToolbar
            table={table}
            searchValue={searchValue}
            onSearchChange={onSearchChange}
            searchPlaceholder={t("logs.audit.searchPlaceholder")}
            onRefresh={onRefresh}
            isRefreshing={isRefreshing}
            onOpenFilters={() => setFiltersOpen(true)}
            filterLabels={auditFilterLabels(t)}
            formatFilterValue={filterValueFormatter(t)}
            showViewOptions={false}
          />
          <DataTableFilterDrawer
            table={table}
            open={filtersOpen}
            onOpenChange={setFiltersOpen}
            title={t("logs.audit.filterDrawerTitle")}
            description={t("logs.audit.filterDrawerDescription")}
          >
            {({ get, set }) => (
              <>
                <DataTableFilterField label={t("logs.audit.filter.objectId")}>
                  <Input
                    value={(get("object_id") as string) ?? ""}
                    onChange={(event) => set("object_id", event.target.value)}
                    placeholder={t("logs.audit.objectIdPlaceholder")}
                  />
                </DataTableFilterField>
                <DataTableFilterField label={t("logs.audit.filter.changedBy")}>
                  <Input
                    value={(get("changed_by") as string) ?? ""}
                    onChange={(event) => set("changed_by", event.target.value)}
                    placeholder={t("logs.audit.userIdPlaceholder")}
                  />
                </DataTableFilterField>
                <DataTableFilterField label={t("logs.audit.filter.teamId")}>
                  <Input
                    value={(get("team_id") as string) ?? ""}
                    onChange={(event) => set("team_id", event.target.value)}
                    placeholder={t("logs.audit.teamIdPlaceholder")}
                  />
                </DataTableFilterField>
                <DataTableFilterField label={t("logs.audit.filter.keyHash")}>
                  <Input
                    value={(get("key_hash") as string) ?? ""}
                    onChange={(event) => set("key_hash", event.target.value)}
                    placeholder={t("logs.audit.keyHashPlaceholder")}
                  />
                </DataTableFilterField>
                <DataTableFilterField label={t("logs.audit.filter.action")}>
                  <Select
                    items={actionFilterItems}
                    value={(get("action") as string) ?? ALL_VALUE}
                    onValueChange={(value) => set("action", value === ALL_VALUE ? undefined : value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("logs.audit.allActions")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ALL_VALUE}>{t("logs.audit.allActions")}</SelectItem>
                      {selectItems(t, ACTION_ITEM_KEYS).map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </DataTableFilterField>
                <DataTableFilterField label={t("logs.audit.filter.table")}>
                  <Select
                    items={tableFilterItems}
                    value={(get("table_name") as string) ?? ALL_VALUE}
                    onValueChange={(value) => set("table_name", value === ALL_VALUE ? undefined : value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("logs.audit.allTables")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ALL_VALUE}>{t("logs.audit.allTables")}</SelectItem>
                      {selectItems(t, TABLE_ITEM_KEYS).map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </DataTableFilterField>
              </>
            )}
          </DataTableFilterDrawer>
        </>
      )}
    />
  );
}
