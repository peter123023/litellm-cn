"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Info, Play, RefreshCw } from "lucide-react";

import { Team } from "@/components/key_team_helpers/key_list";
import { createSelectionColumn, DataTableSortHeader } from "@/components/shared/DataTable";
import { IdentityCell, StatusBadge, type StatusTone } from "@/components/shared/table_cells";
import { DEFAULT_LANGUAGE, translate, useTranslation, type Translate } from "@/i18n";
import { cn } from "@/lib/cva.config";

// Column factories are plain functions invoked inside useMemo, so they cannot use hooks.
// Callers that have a `t` should pass it; every other caller falls back to English.
const englishT: Translate = (key, params) => translate(DEFAULT_LANGUAGE, key, params);

export interface HealthStatus {
  status: string;
  lastCheck: string;
  lastSuccess?: string;
  loading: boolean;
  error?: string;
  fullError?: string;
  successResponse?: unknown;
}

export interface HealthCheckData {
  model_name: string;
  model_info: {
    id: string;
    created_at?: string;
    team_id?: string;
  };
  provider?: string;
  litellm_model_name?: string;
  health_status: string;
  last_check: string;
  last_success: string;
  health_loading: boolean;
  health_error?: string;
  health_full_error?: string;
}

const HEALTH_STATUS_TONES: Record<string, StatusTone> = {
  healthy: "success",
  unhealthy: "error",
  checking: "info",
  none: "neutral",
};

// healthy > checking > unknown > unhealthy, matching the legacy health table ordering.
const HEALTH_STATUS_ORDER: Record<string, number> = { healthy: 0, checking: 1, unknown: 2, unhealthy: 3 };

const NEVER_CHECKED = "Never checked";
const CHECK_IN_PROGRESS = "Check in progress...";
const NEVER_SUCCEEDED = "Never succeeded";
const NONE = "None";

function HealthStatusBadge({ status }: { status: string }) {
  const { t } = useTranslation();
  const tone = HEALTH_STATUS_TONES[status];
  if (!tone) {
    return <StatusBadge tone="neutral" label={t("healthCheck.unknown")} />;
  }
  const statusLabels: Record<string, string> = {
    healthy: t("healthCheck.statusHealthy"),
    unhealthy: t("healthCheck.statusUnhealthy"),
    checking: t("healthCheck.statusChecking"),
    none: t("healthCheck.statusNone"),
  };
  return <StatusBadge tone={tone} label={statusLabels[status] ?? status} />;
}

function DotPulse({ className }: { className: string }) {
  return (
    <div className="flex space-x-1">
      <div className={cn("animate-pulse rounded-full", className)} />
      <div className={cn("animate-pulse rounded-full", className)} style={{ animationDelay: "0.2s" }} />
      <div className={cn("animate-pulse rounded-full", className)} style={{ animationDelay: "0.4s" }} />
    </div>
  );
}

function DetailButton({
  label,
  onClick,
  className,
  testId,
}: {
  label: string;
  onClick: () => void;
  className: string;
  testId: string;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      data-testid={testId}
      onClick={onClick}
      className={cn("cursor-pointer rounded-sm p-1 transition-colors", className)}
    >
      <Info className="size-4" />
    </button>
  );
}

function runButtonLabel(isLoading: boolean, hasExistingStatus: boolean): string {
  if (isLoading) {
    return "Checking...";
  }
  if (hasExistingStatus) {
    return "Re-run Health Check";
  }
  return "Run Health Check";
}

function RunButtonIcon({ isLoading, hasExistingStatus }: { isLoading: boolean; hasExistingStatus: boolean }) {
  if (isLoading) {
    return <DotPulse className="size-1 bg-border" />;
  }
  if (hasExistingStatus) {
    return <RefreshCw className="size-4" />;
  }
  return <Play className="size-4" />;
}

function RunHealthCheckButton({
  model,
  onRunHealthCheck,
}: {
  model: HealthCheckData;
  onRunHealthCheck: (modelId: string) => void;
}) {
  const { t } = useTranslation();
  const isLoading = model.health_loading;
  const hasExistingStatus = Boolean(model.health_status) && model.health_status !== "none";
  const label = isLoading
    ? t("healthCheck.checking")
    : hasExistingStatus
      ? t("healthCheck.rerunCheck")
      : t("healthCheck.runCheck");

  return (
    <button
      type="button"
      data-testid="run-health-check-btn"
      title={label}
      aria-label={label}
      disabled={isLoading}
      onClick={() => onRunHealthCheck(model.model_info?.id ?? "")}
      className={cn(
        "rounded-md p-2 transition-colors",
        isLoading
          ? "cursor-not-allowed bg-muted text-muted-foreground"
          : "text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 dark:text-indigo-300 dark:hover:bg-indigo-950 dark:hover:text-indigo-200",
      )}
    >
      <RunButtonIcon isLoading={isLoading} hasExistingStatus={hasExistingStatus} />
    </button>
  );
}

function compareDatesDesc(rawA: string, rawB: string): number {
  const dateA = new Date(rawA).getTime();
  const dateB = new Date(rawB).getTime();
  if (isNaN(dateA) && isNaN(dateB)) {
    return 0;
  }
  if (isNaN(dateA)) {
    return 1;
  }
  if (isNaN(dateB)) {
    return -1;
  }
  return dateB - dateA;
}

/**
 * Ranks the sentinel strings the health table renders in place of a real timestamp.
 * `bottom` and `top` are checked in order, so an earlier sentinel outranks a later one
 * (e.g. "Never succeeded" sorts below "None").
 */
function compareSentinels(
  rawA: string,
  rawB: string,
  bottom: readonly string[],
  top: readonly string[],
): number | null {
  for (const sentinel of bottom) {
    if (rawA === sentinel && rawB === sentinel) {
      return 0;
    }
    if (rawA === sentinel) {
      return 1;
    }
    if (rawB === sentinel) {
      return -1;
    }
  }

  for (const sentinel of top) {
    if (rawA === sentinel && rawB === sentinel) {
      return 0;
    }
    if (rawA === sentinel) {
      return -1;
    }
    if (rawB === sentinel) {
      return 1;
    }
  }

  return null;
}

export interface HealthChecksTableColumnsDeps {
  modelHealthStatuses: Record<string, HealthStatus>;
  getDisplayModelName: (model: HealthCheckData) => string;
  onRunHealthCheck: (modelId: string) => void;
  onShowError: (modelName: string, cleanedError: string, fullError: string) => void;
  onShowSuccess: (modelName: string, response: unknown) => void;
  onSelectModel?: (modelId: string) => void;
  teams?: Team[] | null;
  t?: Translate;
}

export const getHealthChecksTableColumns = ({
  modelHealthStatuses,
  getDisplayModelName,
  onRunHealthCheck,
  onShowError,
  onShowSuccess,
  onSelectModel,
  teams,
  t: tOverride,
}: HealthChecksTableColumnsDeps): ColumnDef<HealthCheckData>[] => {
  const t = tOverride ?? englishT;
  return [
    createSelectionColumn<HealthCheckData>({
      rowAriaLabel: (row) =>
        t("healthCheck.selectRow", { name: row.original.model_info?.id ?? row.original.model_name }),
    }),
    {
      id: "model_id",
      accessorFn: (row) => row.model_info?.id ?? "",
      meta: { title: t("healthCheck.colModelId") },
      header: ({ column }) => (
        <DataTableSortHeader column={column} title={t("healthCheck.colModelId")} variant="header-cycle" />
      ),
      size: 220,
      enableSorting: true,
      sortingFn: "alphanumeric",
      cell: ({ row }) => {
        const modelId = row.original.model_info?.id ?? "";
        return (
          <IdentityCell
            title={modelId}
            titleClassName="font-mono text-xs text-primary"
            onClick={onSelectModel ? () => onSelectModel(modelId) : undefined}
          />
        );
      },
    },
    {
      id: "model_name",
      accessorKey: "model_name",
      meta: { title: t("healthCheck.colModelName") },
      header: ({ column }) => (
        <DataTableSortHeader column={column} title={t("healthCheck.colModelName")} variant="header-cycle" />
      ),
      size: 200,
      enableSorting: true,
      sortingFn: "alphanumeric",
      cell: ({ row }) => {
        const displayName = getDisplayModelName(row.original) || row.original.model_name;
        return (
          <span className="block max-w-50 truncate text-sm font-medium" title={displayName}>
            {displayName}
          </span>
        );
      },
    },
    {
      id: "team_id",
      accessorFn: (row) => row.model_info?.team_id ?? "",
      meta: { title: t("healthCheck.colTeamAlias") },
      header: ({ column }) => (
        <DataTableSortHeader column={column} title={t("healthCheck.colTeamAlias")} variant="header-cycle" />
      ),
      size: 160,
      enableSorting: true,
      sortingFn: "alphanumeric",
      cell: ({ row }) => {
        const teamId = row.original.model_info?.team_id;
        if (!teamId) {
          return <span className="text-sm text-muted-foreground">-</span>;
        }
        const teamAlias = teams?.find((team) => team.team_id === teamId)?.team_alias || teamId;
        return (
          <span className="block max-w-40 truncate text-sm" title={teamAlias}>
            {teamAlias}
          </span>
        );
      },
    },
    {
      id: "health_status",
      accessorKey: "health_status",
      meta: { title: t("healthCheck.colHealthStatus"), skeleton: "badge" },
      header: ({ column }) => (
        <DataTableSortHeader column={column} title={t("healthCheck.colHealthStatus")} variant="header-cycle" />
      ),
      size: 170,
      enableSorting: true,
      sortingFn: (rowA, rowB) => {
        const statusA = (rowA.getValue("health_status") as string) || "unknown";
        const statusB = (rowB.getValue("health_status") as string) || "unknown";
        const orderA = HEALTH_STATUS_ORDER[statusA] ?? 4;
        const orderB = HEALTH_STATUS_ORDER[statusB] ?? 4;
        return orderA - orderB;
      },
      cell: ({ row }) => {
        const model = row.original;

        if (model.health_loading) {
          return (
            <div className="flex items-center space-x-2">
              <DotPulse className="size-2 bg-indigo-500" />
              <span className="text-sm text-muted-foreground">Checking...</span>
            </div>
          );
        }

        const modelId = model.model_info?.id ?? "";
        const displayName = getDisplayModelName(model) || model.model_name;
        const successResponse = modelHealthStatuses[modelId]?.successResponse;
        const hasSuccessResponse = model.health_status === "healthy" && successResponse !== undefined;

        return (
          <div className="flex items-center space-x-2">
            <HealthStatusBadge status={model.health_status} />
            {hasSuccessResponse && (
              <DetailButton
                label={t("healthCheck.viewResponse")}
                testId="view-health-success-btn"
                className="text-success hover:bg-success/10 "
                onClick={() => onShowSuccess(displayName, successResponse)}
              />
            )}
          </div>
        );
      },
    },
    {
      id: "health_error",
      accessorKey: "health_error",
      meta: { title: t("healthCheck.colErrorDetails") },
      header: t("healthCheck.colErrorDetails"),
      size: 240,
      enableSorting: false,
      cell: ({ row }) => {
        const model = row.original;
        const modelId = model.model_info?.id ?? "";
        const healthStatus = modelHealthStatuses[modelId];

        if (!healthStatus?.error) {
          return <span className="text-sm text-muted-foreground">{t("healthCheck.noErrors")}</span>;
        }

        const cleanedError = healthStatus.error;
        const fullError = healthStatus.fullError || healthStatus.error;
        const displayName = getDisplayModelName(model) || model.model_name;

        return (
          <div className="flex items-center space-x-2">
            <span className="block max-w-50 truncate text-sm text-destructive" title={cleanedError}>
              {cleanedError}
            </span>
            {fullError !== cleanedError && (
              <DetailButton
                label={t("healthCheck.viewFullError")}
                testId="view-health-error-btn"
                className="text-destructive hover:bg-destructive/10 "
                onClick={() => onShowError(displayName, cleanedError, fullError)}
              />
            )}
          </div>
        );
      },
    },
    {
      id: "last_check",
      accessorKey: "last_check",
      meta: { title: t("healthCheck.colLastCheck") },
      header: ({ column }) => (
        <DataTableSortHeader column={column} title={t("healthCheck.colLastCheck")} variant="header-cycle" />
      ),
      size: 170,
      enableSorting: true,
      sortingFn: (rowA, rowB) => {
        const rawA = (rowA.getValue("last_check") as string) || NEVER_CHECKED;
        const rawB = (rowB.getValue("last_check") as string) || NEVER_CHECKED;
        const sentinel = compareSentinels(rawA, rawB, [NEVER_CHECKED], [CHECK_IN_PROGRESS]);
        return sentinel ?? compareDatesDesc(rawA, rawB);
      },
      cell: ({ row }) => {
        const raw = row.original.last_check;
        const display = row.original.health_loading
          ? t("healthCheck.checkInProgress")
          : raw === NONE
            ? t("healthCheck.valueNone")
            : raw === NEVER_CHECKED
              ? t("healthCheck.neverChecked")
              : raw;
        return <span className="text-sm text-muted-foreground">{display}</span>;
      },
    },
    {
      id: "last_success",
      accessorKey: "last_success",
      meta: { title: t("healthCheck.colLastSuccess") },
      header: ({ column }) => (
        <DataTableSortHeader column={column} title={t("healthCheck.colLastSuccess")} variant="header-cycle" />
      ),
      size: 170,
      enableSorting: true,
      sortingFn: (rowA, rowB) => {
        const rawA = (rowA.getValue("last_success") as string) || NEVER_SUCCEEDED;
        const rawB = (rowB.getValue("last_success") as string) || NEVER_SUCCEEDED;
        const sentinel = compareSentinels(rawA, rawB, [NEVER_SUCCEEDED, NONE], []);
        return sentinel ?? compareDatesDesc(rawA, rawB);
      },
      cell: ({ row }) => {
        const modelId = row.original.model_info?.id ?? "";
        const raw = modelHealthStatuses[modelId]?.lastSuccess || NONE;
        const display =
          raw === NONE ? t("healthCheck.valueNone") : raw === NEVER_SUCCEEDED ? t("healthCheck.neverSucceeded") : raw;
        return <span className="text-sm text-muted-foreground">{display}</span>;
      },
    },
    {
      id: "actions",
      meta: { title: t("common.actions"), className: "text-right", headerClassName: "text-right" },
      header: () => <span className="sr-only">{t("common.actions")}</span>,
      size: 80,
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <RunHealthCheckButton model={row.original} onRunHealthCheck={onRunHealthCheck} />
        </div>
      ),
    },
  ];
};
