"use client";

import { useState } from "react";
import { ExternalLink, GitPullRequest } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  dateRange,
  changeTerms,
  duration,
  money,
  number,
  recordedBranches,
  type Comparison,
  type ObservedPerson,
  type ObservedPull,
  type ObservedSnapshot,
  type Period,
} from "./observedData";
import { useTranslation } from "@/i18n";

export function PullList({
  pulls,
  provider,
  matchedOnly = false,
}: {
  matchedOnly?: boolean;
  pulls: ObservedPull[];
  provider: ObservedSnapshot["source_provider"];
}) {
  const { t } = useTranslation();
  const terms = changeTerms(provider, t);
  const emptyMessage = matchedOnly
    ? t("roi.pulls.emptyMatched")
    : t("roi.pulls.emptyPeriod", { term: terms.lower });
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(20);
  const filtered = pulls.filter((pull) =>
    `${pull.number} ${pull.title} ${pull.author} ${pull.repo} ${pull.source_repo} ${pull.source_branch}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return (
    <div className="space-y-3">
      <Input
        aria-label={t("roi.pulls.searchAria", { term: terms.lower })}
        placeholder={t("roi.pulls.searchPlaceholder", { term: terms.lower })}
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setLimit(20);
        }}
        className="max-w-sm"
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{terms.requests}</TableHead>
            <TableHead>{t("roi.pulls.author")}</TableHead>
            <TableHead className="text-right">{t("roi.pulls.openedToMerged")}</TableHead>
            <TableHead className="text-right">{t("roi.pulls.taggedSpend")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.slice(0, limit).map((pull) => (
            <TableRow key={pull.url}>
              <TableCell className="max-w-lg whitespace-normal py-3">
                <a
                  className="group flex items-start gap-2 hover:underline"
                  href={pull.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <GitPullRequest className="mt-0.5 size-4 shrink-0 text-violet-500" />
                  <span>
                    <span className="mr-2 text-muted-foreground">#{pull.number}</span>
                    {pull.title}
                    <span className="mt-1 block text-xs text-muted-foreground">{pull.repo}</span>
                  </span>
                  <ExternalLink className="mt-0.5 size-3 shrink-0 text-muted-foreground" />
                </a>
              </TableCell>
              <TableCell>
                <span className="text-xs">{pull.author || t("roi.pulls.deletedAuthor")}</span>
                {pull.agent && (
                  <Badge variant="secondary" className="ml-2">
                    {t("roi.pulls.agentBadge")}
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right tabular-nums">{duration(pull.merge_hours)}</TableCell>
              <TableCell
                className="text-right tabular-nums"
                title={
                  pull.branch_cost.status === "ambiguous"
                    ? t("roi.pulls.sharedBranchTitle")
                    : t("roi.pulls.taggedBranchSpendTitle")
                }
              >
                {money(pull.branch_cost.spend)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p className="text-xs text-muted-foreground">{t("roi.pulls.elapsedNote")}</p>
      {filtered.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          {query ? t("roi.pulls.emptySearch", { term: terms.lower }) : emptyMessage}
        </p>
      )}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{t("roi.pulls.counter", { shown: number(Math.min(limit, filtered.length)), total: number(filtered.length), term: terms.lower })}</span>
        {limit < filtered.length && (
          <Button variant="outline" size="sm" onClick={() => setLimit(limit + 40)}>
            {t("roi.pulls.showMore")}
          </Button>
        )}
      </div>
    </div>
  );
}

export function PersonDetails({
  person,
  snapshot,
  comparison,
  onClose,
  onEdit,
}: {
  person: ObservedPerson;
  snapshot: ObservedSnapshot;
  comparison: Comparison;
  onClose: () => void;
  onEdit?: () => void;
}) {
  const { t } = useTranslation();
  const terms = changeTerms(snapshot.source_provider, t);
  const [period, setPeriod] = useState<Period>("current");
  const current = person.periods.current;
  const baseline = person.periods[comparison];
  const urls = new Set(person.periods[period].pr_urls);
  const pulls = snapshot.pulls[period].filter((pull) => urls.has(pull.url));
  return (
    <Sheet
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent className="overflow-y-auto p-6 data-[side=right]:w-full data-[side=right]:sm:max-w-3xl">
        <SheetHeader className="p-0 pr-8">
          <SheetTitle className="text-xl">{person.name}</SheetTitle>
          <SheetDescription>{[person.email, person.logins.join(", ")].filter(Boolean).join(" · ")}</SheetDescription>
        </SheetHeader>
        {onEdit && (
          <Button variant="outline" className="w-fit" onClick={onEdit}>
            {t("roi.details.editLinkedAccounts")}
          </Button>
        )}
        <div className="mt-2 grid grid-cols-1 gap-y-4 divide-y rounded-lg border py-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div className="px-4">
            <p className="text-xs text-muted-foreground">{t("roi.details.mergedCount", { term: terms.plural })}</p>
            <p className="mt-2 text-2xl font-semibold">{number(current.merged_prs)}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {t("roi.details.inComparison", { count: number(baseline.merged_prs) })}
            </p>
          </div>
          <div className="px-4">
            <p className="text-xs text-muted-foreground">{t("roi.details.recordedSpend")}</p>
            <p className="mt-2 text-2xl font-semibold">
              {money(current.spend_observation === "no_records" ? null : current.gateway_recorded_spend)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{t("roi.details.gatewayOnly")}</p>
          </div>
          <div className="px-4">
            <p className="text-xs text-muted-foreground">{t("roi.details.spendPerChange", { term: terms.singular })}</p>
            <p className="mt-2 text-2xl font-semibold">{money(current.recorded_spend_per_attributed_pr)}</p>
            <p className="mt-1 text-xs text-muted-foreground">{t("roi.details.periodAverage")}</p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-medium">{t("roi.details.mergedCount", { term: terms.plural })}</h3>
          <div className="flex gap-1 rounded-lg bg-muted p-1">
            <Button size="sm" variant={period === "current" ? "outline" : "ghost"} onClick={() => setPeriod("current")}>
              {t("roi.period.current")}
            </Button>
            <Button
              size="sm"
              variant={period === comparison ? "outline" : "ghost"}
              onClick={() => setPeriod(comparison)}
            >
              {comparison === "previous" ? t("roi.period.previous") : t("roi.period.lastYear")}
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">{dateRange(snapshot.periods[period].window)} · UTC</p>
        <PullList key={period} pulls={pulls} provider={snapshot.source_provider} />
      </SheetContent>
    </Sheet>
  );
}

export function BranchSpend({ snapshot, matchedOnly = true }: { snapshot: ObservedSnapshot; matchedOnly?: boolean }) {
  const { t } = useTranslation();
  const rows = recordedBranches(snapshot, matchedOnly);
  return (
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("roi.branchSpend.repo")}</TableHead>
            <TableHead>{t("roi.branchSpend.branch")}</TableHead>
            <TableHead className="text-right">{t("roi.branchSpend.requests")}</TableHead>
            <TableHead className="text-right">{t("roi.branchSpend.taggedSpend")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={`${row.repo}/${row.branch}`}>
              <TableCell>{row.repo}</TableCell>
              <TableCell>{row.branch}</TableCell>
              <TableCell className="text-right">{number(row.requests)}</TableCell>
              <TableCell className="text-right">{money(row.spend)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {rows.length === 0 && (
        <p className="p-8 text-center text-sm text-muted-foreground">
          {matchedOnly ? t("roi.branchSpend.emptyMatched") : t("roi.branchSpend.empty")}
        </p>
      )}
    </div>
  );
}