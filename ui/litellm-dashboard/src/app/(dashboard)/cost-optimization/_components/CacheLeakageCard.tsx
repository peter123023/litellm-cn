"use client";

import React, { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Info } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatNumberWithCommas } from "@/utils/dataUtils";
import {
  CacheLeakageDimension,
  CacheLeakageRow,
  computeCacheLeakage,
  leakageRowsFromKeyRows,
  netSavingsPerCachedToken,
  pct,
  usd,
} from "./costOptimizationUtils";
import { DailyActivityRange } from "./useDailyActivityRange";
import { useCacheLeakageKeys } from "./useCacheLeakageKeys";
import { useTranslation, type Translate } from "@/i18n";

interface CacheLeakageCardProps {
  activity: DailyActivityRange;
}

type SortColumn = "uncachedPromptTokens" | "cacheHitRatio" | "potentialSavings";
interface SortState {
  column: SortColumn;
  dir: "asc" | "desc";
}

const NATURAL_DIR: Record<SortColumn, "asc" | "desc"> = {
  uncachedPromptTokens: "desc",
  cacheHitRatio: "asc",
  potentialSavings: "desc",
};

const compareRows = (a: CacheLeakageRow, b: CacheLeakageRow, sort: SortState): number => {
  const av = a[sort.column];
  const bv = b[sort.column];
  if (av == null && bv == null) return 0;
  if (av == null) return 1;
  if (bv == null) return -1;
  return sort.dir === "asc" ? av - bv : bv - av;
};

const InfoTooltip = ({ info }: { info: string }) => (
  <Tooltip>
    <TooltipTrigger render={<span className="inline-flex" aria-label={info} />}>
      <Info className="h-3 w-3 text-muted-foreground" />
    </TooltipTrigger>
    <TooltipContent className="max-w-xs">{info}</TooltipContent>
  </Tooltip>
);

const SortableHead = ({
  column,
  label,
  info,
  sort,
  onSort,
  t,
}: {
  column: SortColumn;
  label: string;
  info: string;
  sort: SortState;
  onSort: (column: SortColumn) => void;
  t: Translate;
}) => {
  const active = sort.column === column;
  const ActiveArrow = sort.dir === "asc" ? ArrowUp : ArrowDown;
  const Arrow = active ? ActiveArrow : ArrowUpDown;
  return (
    <TableHead className="text-right">
      <span className="inline-flex items-center justify-end gap-1">
        <button
          type="button"
          onClick={() => onSort(column)}
          aria-label={t("costOptimization.leakage.sortBy", { label })}
          className="inline-flex items-center gap-1 font-medium hover:text-foreground"
        >
          {label}
          <Arrow className={`h-3 w-3 ${active ? "text-foreground" : "text-muted-foreground"}`} />
        </button>
        <InfoTooltip info={info} />
      </span>
    </TableHead>
  );
};

const CacheLeakageCard: React.FC<CacheLeakageCardProps> = ({ activity }) => {
  const { t } = useTranslation();
  const { results, loading } = activity;
  const [dimension, setDimension] = useState<CacheLeakageDimension>("key");
  const [sort, setSort] = useState<SortState>({ column: "potentialSavings", dir: "desc" });
  const leakageRate = useMemo(() => netSavingsPerCachedToken(results), [results]);
  const keyLeakage = useCacheLeakageKeys(activity, dimension === "key");
  const unsortedRows = useMemo(
    () =>
      dimension === "key"
        ? leakageRowsFromKeyRows(keyLeakage.rows, leakageRate)
        : computeCacheLeakage(results, "model").rows,
    [dimension, keyLeakage.rows, leakageRate, results],
  );
  const rows = useMemo(() => [...unsortedRows].sort((a, b) => compareRows(a, b, sort)), [unsortedRows, sort]);
  const rowsLoading = dimension === "key" ? keyLeakage.loading : loading;

  const onSort = (column: SortColumn) =>
    setSort((prev) =>
      prev.column === column
        ? { column, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { column, dir: NATURAL_DIR[column] },
    );

  const byModel = dimension === "model";
  const subject = byModel ? t("costOptimization.leakage.subjectModels") : t("costOptimization.leakage.subjectKeys");
  const firstColumn = byModel ? t("costOptimization.leakage.col.model") : t("costOptimization.leakage.col.key");
  const emptyMessage =
    dimension === "key" && keyLeakage.failed
      ? t("costOptimization.leakage.loadKeyUsageFailed")
      : t("costOptimization.leakage.noUsage", {
          noun: byModel ? t("costOptimization.leakage.nounModel") : t("costOptimization.leakage.nounKey"),
        });

  return (
    <TooltipProvider delay={300}>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <CardTitle>
                {byModel ? t("costOptimization.leakage.titleByModel") : t("costOptimization.leakage.titleByKey")}
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {t("costOptimization.leakage.body", { subject })}
              </p>
            </div>
          </div>
          <Tabs value={dimension} onValueChange={(value) => setDimension(value === "model" ? "model" : "key")}>
            <TabsList>
              <TabsTrigger value="key">{t("costOptimization.leakage.tab.byKey")}</TabsTrigger>
              <TabsTrigger value="model">{t("costOptimization.leakage.tab.byModel")}</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {rows.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {rowsLoading ? t("common.loading") : emptyMessage}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{firstColumn}</TableHead>
                  <SortableHead
                    column="uncachedPromptTokens"
                    label={t("costOptimization.leakage.col.uncachedInputTokens")}
                    info={t("costOptimization.leakage.infoUncachedInputTokens")}
                    sort={sort}
                    onSort={onSort}
                    t={t}
                  />
                  <SortableHead
                    column="cacheHitRatio"
                    label={t("costOptimization.leakage.col.cacheHitRate")}
                    info={t("costOptimization.leakage.infoCacheHitRate")}
                    sort={sort}
                    onSort={onSort}
                    t={t}
                  />
                  <SortableHead
                    column="potentialSavings"
                    label={t("costOptimization.leakage.col.potentialSavings")}
                    info={t("costOptimization.leakage.infoPotentialSavings")}
                    sort={sort}
                    onSort={onSort}
                    t={t}
                  />
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">
                      {row.label}
                      {row.sublabel && <span className="ml-1 text-xs text-muted-foreground">({row.sublabel})</span>}
                    </TableCell>
                    <TableCell className="text-right">{formatNumberWithCommas(row.uncachedPromptTokens)}</TableCell>
                    <TableCell className="text-right">{pct(row.cacheHitRatio)}</TableCell>
                    <TableCell className="text-right">
                      {row.potentialSavings == null ? "—" : usd(row.potentialSavings)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default CacheLeakageCard;
