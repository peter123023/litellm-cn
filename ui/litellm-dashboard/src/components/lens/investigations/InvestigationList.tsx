"use client";

import {
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
  type CellContext,
  type ColumnDef,
  type TableOptions,
} from "@tanstack/react-table";
import { createContext, useContext, type ReactNode } from "react";
import {
  ChevronRight,
  Circle,
  CircleCheck,
  CircleDashed,
  CircleDot,
  CircleSlash,
  CircleX,
  Pencil,
  Play,
} from "lucide-react";

import { useNow } from "@/hooks/useNow";
import { Inspector } from "@/components/shared/Inspector";
import { InspectorTable } from "@/components/shared/InspectorTable";
import { formatActivityTimestamp } from "@/utils/activityTimestamp";
import { cn } from "@/lib/cva.config";
import { agoLabel, scopeLabel } from "../model/format";

import { findingAgents, findingKey, openFindings, scheduleLabel } from "../model/inbox";
import { lensStatus } from "../model/status";
import { SearchBox } from "@/components/shared/search/SearchBox";
import { itemValues } from "@/components/shared/search/valueSource";
import { type Finding, type Lens } from "../model/types";
import { useListSearchRoute } from "../route";
import { FINDING_PANEL_WIDTH_KEY } from "../storage";
import { filterInvestigations, INVESTIGATION_INDEX, INVESTIGATION_QUERY } from "./investigationQuery";
import { useTranslation } from "@/i18n";

const PRIORITY_COLOR = { high: "text-destructive", medium: "text-warning", low: "text-muted-foreground" } as const;
const META = "truncate text-xs text-muted-foreground";
const ACTION =
  "inline-flex size-7 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground";
const INVESTIGATION_HEIGHT = 56;
const FINDING_HEIGHT = 48;

/** One row of the list: an investigation, or an open finding shown under the investigation that owns it. */
export type InvestigationRow =
  | { readonly kind: "investigation"; readonly lens: Lens }
  | { readonly kind: "finding"; readonly lens: Lens; readonly finding: Finding };

export const investigationRowKey = (row: InvestigationRow): string =>
  row.kind === "investigation" ? `investigation:${row.lens.id}` : `finding:${findingKey(row.lens, row.finding)}`;

const findingRows = (row: InvestigationRow): InvestigationRow[] | undefined =>
  row.kind === "investigation"
    ? openFindings(row.lens).map((finding) => ({ kind: "finding", lens: row.lens, finding }))
    : undefined;

interface ListContextValue {
  readonly now: number;
  readonly connected: boolean;
  readonly readOnly: boolean;
  readonly onEdit: (id: string) => void;
  readonly onRunNow: (id: string) => void;
}

const ListContext = createContext<ListContextValue | null>(null);

function useList(): ListContextValue {
  const value = useContext(ListContext);
  if (value === null) throw new Error("Investigation cells must be rendered inside InvestigationList");
  return value;
}

type Cell = CellContext<InvestigationRow, unknown>;

const ROW_LABEL = {
  investigation: "lens.investigations.panelInvestigationDetails",
  finding: "lens.investigations.findingPanelLabel",
} as const;

const columnHeader = (key: string) =>
  function Header() {
    const { t } = useTranslation();
    return t(key);
  };

function JobIcon({ lens }: { lens: Lens }) {
  const status = lens.jobs[0]?.status;
  const className = "size-4 shrink-0";
  if (status === "queued" || status === "running")
    return <CircleDashed aria-hidden="true" className={cn(className, "text-info")} />;
  if (status === "failed") return <CircleX aria-hidden="true" className={cn(className, "text-destructive")} />;
  if (status === "cancelled")
    return <CircleSlash aria-hidden="true" className={cn(className, "text-muted-foreground")} />;
  if (status === "completed") return <CircleCheck aria-hidden="true" className={cn(className, "text-success")} />;
  return <Circle aria-hidden="true" className={cn(className, "text-muted-foreground")} />;
}

function TwoLine({ meta, title, className }: { meta: ReactNode; title: ReactNode; className?: string }) {
  return (
    <span className="flex min-w-0 flex-col gap-0.5">
      <span className={META}>{meta}</span>
      <span className={cn("truncate text-sm text-foreground", className)}>{title}</span>
    </span>
  );
}

function NameCell({ row }: Cell) {
  const { now } = useList();
  const { t } = useTranslation();
  const item = row.original;
  if (item.kind === "investigation")
    return (
      <span className="flex min-w-0 items-center gap-2">
        <InspectorTable.Indent
          row={row}
          toggleLabel={(expanded) =>
            t(expanded ? "lens.investigations.hideFindingsFor" : "lens.investigations.showFindingsFor", {
              name: item.lens.settings.name,
            })
          }
        />
        <JobIcon lens={item.lens} />
        <TwoLine
          meta={`${scopeLabel(item.lens.settings, t)} · ${scheduleLabel(item.lens, now, t)}`}
          title={item.lens.settings.name}
          className="font-semibold"
        />
      </span>
    );
  const priority = item.finding.priority ?? "medium";
  return (
    <span
      className="flex min-w-0 items-center gap-2"
      title={
        item.finding.suggestion
          ? t("lens.investigations.fixPrefix", { suggestion: item.finding.suggestion })
          : undefined
      }
    >
      <InspectorTable.Indent row={row} className="h-12" />
      <span aria-hidden="true" className="w-4 shrink-0" />
      <CircleDot aria-hidden="true" className={cn("size-4 shrink-0", PRIORITY_COLOR[priority])} />
      <TwoLine
        meta={`${t("lens.investigations.priorityLabel", { priority })} · ${findingAgents(item.lens, item.finding, t).join(", ")}`}
        title={item.finding.title}
      />
    </span>
  );
}

function StatusCell({ row: { original: item } }: Cell) {
  const { connected } = useList();
  const { t } = useTranslation();
  if (item.kind === "finding") {
    const runs = item.finding.occurrences.length;
    return (
      <span className="text-muted-foreground">
        {t(runs === 1 ? "lens.investigations.runCountOne" : "lens.investigations.runCountMany", { count: runs })}
      </span>
    );
  }
  const failed = item.lens.jobs[0]?.status === "failed";
  return (
    <span className={cn("block truncate", failed ? "text-destructive" : "text-muted-foreground")}>
      {lensStatus(item.lens, connected, t)}
    </span>
  );
}

function FindingCount({ row: { original: item } }: Cell) {
  const { t } = useTranslation();
  if (item.kind === "finding") return null;
  const count = openFindings(item.lens).length;
  if (count === 0) return null;
  return (
    <span
      title={t(count === 1 ? "lens.investigations.openFindingsCountOne" : "lens.investigations.openFindingsCountMany", {
        count,
      })}
      className="inline-flex min-w-5 justify-center rounded-full bg-muted px-1.5 font-mono text-xs tabular-nums text-foreground"
    >
      {count}
    </span>
  );
}

function ActivityCell({ row: { original: item } }: Cell) {
  const { now } = useList();
  const { t } = useTranslation();
  if (item.kind === "finding")
    return (
      <span title={formatActivityTimestamp(item.finding.last_seen)}>
        {agoLabel(Date.parse(item.finding.last_seen), now)}
      </span>
    );
  const latest = item.lens.jobs[0];
  return (
    <span title={latest ? formatActivityTimestamp(latest.created_at) : undefined}>
      {latest ? agoLabel(Date.parse(latest.created_at), now) : t("lens.investigations.neverRun")}
    </span>
  );
}

function ActionsCell({ row: { original: item } }: Cell) {
  const { readOnly, onEdit, onRunNow } = useList();
  const { t } = useTranslation();
  if (item.kind === "finding")
    return <ChevronRight aria-hidden="true" className="mr-2 ml-auto size-3.5 text-muted-foreground/60" />;
  if (readOnly) return null;
  const { id, settings } = item.lens;
  return (
    <span className="flex items-center justify-end gap-0.5">
      <button
        type="button"
        aria-label={t("lens.investigations.runNowFor", { name: settings.name })}
        title={t("lens.investigations.runNow")}
        onClick={(event) => {
          event.stopPropagation();
          onRunNow(id);
        }}
        className={ACTION}
      >
        <Play className="size-3.5" />
      </button>
      <button
        type="button"
        aria-label={t("lens.investigations.editFor", { name: settings.name })}
        title={t("common.edit")}
        onClick={(event) => {
          event.stopPropagation();
          onEdit(id);
        }}
        className={cn(ACTION, "text-muted-foreground/60 group-hover:text-muted-foreground")}
      >
        <Pencil className="size-3.5" />
      </button>
    </span>
  );
}

const COLUMNS: ColumnDef<InvestigationRow>[] = [
  {
    id: "name",
    header: columnHeader("lens.investigations.columnInvestigation"),
    cell: NameCell,
    meta: { className: "pl-2 pr-0" },
  },
  {
    id: "status",
    size: 180,
    header: columnHeader("common.status"),
    cell: StatusCell,
    meta: { className: "text-right text-xs" },
  },
  {
    id: "findings",
    size: 72,
    header: columnHeader("lens.investigations.columnOpenFindings"),
    cell: FindingCount,
    meta: { className: "text-right" },
  },
  {
    id: "activity",
    size: 120,
    header: columnHeader("lens.investigations.columnLastActivity"),
    cell: ActivityCell,
    meta: { className: "text-right text-xs text-muted-foreground" },
  },
  {
    id: "actions",
    size: 76,
    header: columnHeader("common.actions"),
    cell: ActionsCell,
    meta: { className: "pl-0 pr-3" },
  },
];

export interface InvestigationListProps {
  readonly lenses: readonly Lens[];
  readonly connected: boolean;
  readonly readOnly?: boolean;
  readonly selected: InvestigationRow | null;
  readonly onSelect: (row: InvestigationRow | null) => void;
  readonly onEdit: (id: string) => void;
  readonly onRunNow: (id: string) => void;
  readonly actions?: ReactNode;
  /** Body of the side panel for the selected row. */
  readonly children: (row: InvestigationRow) => ReactNode;
}

/** Investigations with their open findings; any row opens in the side panel and J/K walk the visible rows. */
export function InvestigationList({
  lenses,
  connected,
  readOnly = false,
  selected,
  onSelect,
  onEdit,
  onRunNow,
  actions,
  children,
}: InvestigationListProps) {
  const [search, setSearch] = useListSearchRoute();
  const { t } = useTranslation();
  const now = useNow(15000);
  const shown = filterInvestigations([...lenses], search);
  const tableOptions: TableOptions<InvestigationRow> = {
    data: shown.map((lens): InvestigationRow => ({ kind: "investigation", lens })),
    columns: COLUMNS,
    getRowId: investigationRowKey,
    getSubRows: findingRows,
    initialState: { expanded: true },
    autoResetAll: false,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  };
  const table = useReactTable(tableOptions);
  const rows = table.getRowModel().rows.map((row) => row.original);
  const noun = selected?.kind ?? "investigation";
  return (
    <Inspector.Root
      items={rows}
      itemKey={investigationRowKey}
      selected={selected}
      onSelectedChange={onSelect}
      noun={noun}
      storageKey={FINDING_PANEL_WIDTH_KEY}
    >
      <div className="flex min-h-[420px] flex-1 flex-col overflow-hidden bg-card">
        <div className="flex min-h-11 shrink-0 flex-wrap items-center gap-2 border-b border-border bg-card p-2">
          <SearchBox.Root
            language={INVESTIGATION_QUERY}
            values={itemValues(INVESTIGATION_INDEX, lenses)}
            value={search}
            onValueChange={setSearch}
            label={t("lens.investigations.searchLabel")}
          >
            <SearchBox.Input className="rounded-lg" placeholder={t("lens.investigations.searchPlaceholder")} />
            <SearchBox.Suggestions />
          </SearchBox.Root>
          {actions && <div className="ml-auto flex items-center gap-2">{actions}</div>}
        </div>
        <ListContext.Provider value={{ now, connected, readOnly, onEdit, onRunNow }}>
          <InspectorTable.Root table={table}>
            <InspectorTable.Grid aria-label={t("lens.investigations.regionLabel")} className="min-w-[720px]">
              <InspectorTable.Header hidden />
              <InspectorTable.Body<InvestigationRow>
                rowHeight={(row) => (row.depth ? FINDING_HEIGHT : INVESTIGATION_HEIGHT)}
              >
                {(row) => (
                  <InspectorTable.Row
                    row={row}
                    item={row.original}
                    tabIndex={0}
                    aria-label={
                      row.original.kind === "finding" ? row.original.finding.title : row.original.lens.settings.name
                    }
                    className={row.depth ? "h-12" : "group h-14"}
                  />
                )}
              </InspectorTable.Body>
            </InspectorTable.Grid>
            {!shown.length && (
              <div className="py-16 text-center text-xs text-muted-foreground">
                {t("lens.investigations.noMatches")}
              </div>
            )}
          </InspectorTable.Root>
        </ListContext.Provider>
      </div>
      <Inspector.Panel label={t(ROW_LABEL[noun])} testId="investigation-panel">
        {children}
      </Inspector.Panel>
    </Inspector.Root>
  );
}
