"use client";

import React from "react";
import { ChevronDown, Download, GitBranch, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  peopleCsv,
  isMatchedPerson,
  effortNote,
  estimateLabel,
  formatMoney,
  formatNumber,
  branchCostLabel,
  highestCostPulls,
} from "./roiCalculatorData";
import type { ROIPerson, ROIPull, ROISummary } from "./roiCalculatorData";
import { useTranslation } from "@/i18n";

type PullSelection = { summary: ROISummary; onSelectPull: (pull: ROIPull) => void };

export function ROIOverview({
  summary,
  onSelectPull,
  onViewPeople,
  onViewBranches,
}: PullSelection & {
  onViewPeople: () => void;
  onViewBranches: () => void;
}) {
  const { t } = useTranslation();
  const metrics = summary.metrics;
  const branches = summary.branch_metrics;
  const topPulls = highestCostPulls(summary.pulls);
  return (
    <div className="space-y-8">
      <div className="@container overflow-hidden rounded-xl border">
        <dl aria-label={t("roi.views.overviewAria")} className="grid grid-cols-2 @min-[760px]:grid-cols-4">
          <MetricCard
            title={t("roi.card.gatewayCost")}
            value={formatMoney(metrics.total_spend)}
            description={t("roi.card.allGatewayUsage")}
            primary
          />
          <MetricCard
            title={t("roi.card.estimatedEffort")}
            value={t("roi.card.hoursValue", { hours: formatNumber(metrics.total_output_hours) })}
            description={t(
              summary.effort_basis === "without_ai" ? "roi.card.effortWithoutAi" : "roi.card.checkAssumptions",
            )}
          />
          <MetricCard
            title={t("roi.card.mergedChanges")}
            value={formatNumber(metrics.merged_prs)}
            description={t("roi.card.estimatedCount", { count: metrics.estimated_prs })}
          />
          <MetricCard
            title={t("roi.card.people")}
            value={formatNumber(metrics.people_with_prs)}
            description={t("roi.card.contributors")}
          />
        </dl>
      </div>
      <section aria-label={t("roi.views.coverageAria")} className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-base font-semibold">{t("roi.views.whereCostsMatched")}</h2>
          <p className="text-sm text-muted-foreground">{t("roi.views.whereCostsMatchedBody")}</p>
        </div>
        <div className="overflow-hidden rounded-xl border">
          <Table className="min-w-[600px]">
            <TableHeader className="bg-muted/40">
              <TableRow className="hover:bg-transparent">
                <TableHead className="px-4 text-xs">{t("roi.views.colView")}</TableHead>
                <TableHead className="px-4 text-right text-xs">{t("roi.views.colMatchedCost")}</TableHead>
                <TableHead className="px-4 text-right text-xs">{t("roi.views.colUnmatchedCost")}</TableHead>
                <TableHead className="px-4 text-right text-xs">{t("roi.views.colChangesMatched")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="px-4 py-3">
                  <Button variant="link" className="h-auto p-0" onClick={onViewPeople}>
                    {t("roi.card.people")}
                  </Button>
                </TableCell>
                <TableCell className="px-4 py-3 text-right font-medium tabular-nums">
                  {formatMoney(metrics.matched_spend)}
                </TableCell>
                <TableCell className="px-4 py-3 text-right text-muted-foreground tabular-nums">
                  {formatMoney(metrics.excluded_spend)}
                </TableCell>
                <TableCell className="px-4 py-3 text-right tabular-nums">
                  {metrics.matched_prs} / {metrics.merged_prs}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="px-4 py-3">
                  <Button variant="link" className="h-auto p-0" onClick={onViewBranches}>
                    Branches
                  </Button>
                </TableCell>
                <TableCell className="px-4 py-3 text-right font-medium tabular-nums">
                  {formatMoney(branches?.spend)}
                </TableCell>
                <TableCell className="px-4 py-3 text-right text-muted-foreground tabular-nums">
                  {formatMoney(branches?.unlinked_spend)}
                </TableCell>
                <TableCell className="px-4 py-3 text-right tabular-nums">
                  {branches?.matched_pulls ?? 0} / {metrics.merged_prs}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </section>
      <ROIPulls
        summary={summary}
        pulls={topPulls}
        onSelectPull={onSelectPull}
        compact
        onViewBranches={onViewBranches}
      />
    </div>
  );
}

export function ROIBranches({
  summary,
  onSelectPull,
  pulls,
  query,
  onQueryChange,
  matchedOnly,
}: PullSelection & {
  pulls: ROIPull[];
  query: string;
  matchedOnly: boolean;
  onQueryChange: (query: string) => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="space-y-8">
      <section aria-label={t("roi.views.branchAnalysisAria")} className="space-y-4">
        <div className="@container overflow-hidden rounded-xl border">
          <ROIMetrics summary={summary} branchMode />
          <ROIComparison summary={summary} branchMode />
        </div>
      </section>
      <ROIPulls
        summary={summary}
        pulls={pulls}
        query={query}
        matchedOnly={matchedOnly}
        onQueryChange={onQueryChange}
        onSelectPull={onSelectPull}
      />
    </div>
  );
}

function ROIPulls({
  summary,
  onSelectPull,
  pulls,
  query = "",
  onQueryChange,
  compact = false,
  matchedOnly = false,
  onViewBranches,
}: PullSelection & {
  pulls: ROIPull[];
  query?: string;
  onQueryChange?: (query: string) => void;
  compact?: boolean;
  matchedOnly?: boolean;
  onViewBranches?: () => void;
}) {
  const { t } = useTranslation();
  const isGitLab = summary.source_provider === "gitlab";
  const changeSingular = t(isGitLab ? "roi.term.mergeRequestLower" : "roi.term.pullRequestLower");
  const changePlural = t(isGitLab ? "roi.term.mergeRequestsLower" : "roi.term.pullRequestsLower");
  const [pagination, setPagination] = React.useState({ query, visibleCount: 10 });
  const visibleCount = pagination.query === query ? pagination.visibleCount : 10;
  const metrics = summary.metrics;
  const emptyMessage = compact
    ? t("roi.pulls.emptyCompact")
    : t(matchedOnly ? "roi.pulls.emptyPeriodMatched" : "roi.pulls.emptyPeriodAll", { term: changePlural });
  return (
    <section aria-label={t("roi.pulls.sectionAria", { term: changePlural })} className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-base font-semibold">
            {t(compact ? "roi.pulls.highestCost" : "roi.pulls.costsByBranch")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {compact
              ? t("roi.pulls.mergedRanked")
              : t("roi.pulls.countOf", { shown: pulls.length, total: metrics.merged_prs, term: changePlural })}
          </p>
        </div>
        {compact ? (
          <Button variant="outline" onClick={onViewBranches}>
            {t("roi.pulls.viewAllBranches")}
          </Button>
        ) : (
          <div className="relative w-full sm:w-64">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              aria-label={t("roi.pulls.search", { term: changePlural })}
              className="pl-9"
              placeholder={t("roi.pulls.search", { term: changePlural })}
              type="search"
              value={query}
              onChange={(event) => onQueryChange?.(event.target.value)}
            />
          </div>
        )}
      </div>
      <div className="overflow-hidden rounded-xl border">
        <Table className="min-w-[600px] table-fixed">
          <TableHeader className="bg-muted/40">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-3/5 px-4 text-xs text-muted-foreground">
                {t(isGitLab ? "roi.pulls.colMergeRequest" : "roi.pulls.colPullRequest")}
              </TableHead>
              <TableHead className="px-4 text-right text-xs text-muted-foreground">
                {t("roi.pulls.colAiCost")}
              </TableHead>
              <TableHead className="px-4 text-right text-xs text-muted-foreground">
                {t("roi.card.estimatedEffort")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pulls.slice(0, visibleCount).map((pull) => (
              <TableRow key={`${pull.repo}#${pull.number}`}>
                <TableCell className="whitespace-normal px-4 py-3">
                  <Button
                    aria-label={t("roi.pulls.openEstimateAria", {
                      repo: pull.repo,
                      term: changeSingular,
                      number: pull.number,
                    })}
                    className="h-auto w-full justify-start whitespace-normal p-0 text-left"
                    variant="link"
                    onClick={() => onSelectPull(pull)}
                  >
                    <span className="min-w-0 space-y-1">
                      <span className="block break-words font-medium leading-5">{pull.title}</span>
                      <span className="block break-all text-xs font-normal text-muted-foreground">
                        {pull.repo} #{pull.number} · {pull.login}
                      </span>
                      {!compact && pull.source_branch && (
                        <span className="flex items-start gap-1.5 text-xs font-normal text-muted-foreground">
                          <GitBranch aria-hidden="true" className="mt-0.5 size-3 shrink-0" />
                          <span className="break-all">{pull.source_branch}</span>
                        </span>
                      )}
                    </span>
                  </Button>
                </TableCell>
                <TableCell
                  className={`px-4 py-3 text-right tabular-nums ${pull.branch_cost?.status === "matched" ? "font-medium" : "whitespace-normal text-xs text-muted-foreground"}`}
                >
                  {branchCostLabel(pull, t)}
                </TableCell>
                <TableCell className="px-4 py-3 text-right tabular-nums">{estimateLabel(pull.estimate, t)}</TableCell>
              </TableRow>
            ))}
            {pulls.length === 0 && (
              <TableRow>
                <TableCell className="h-32 text-center text-muted-foreground" colSpan={3}>
                  {query ? t("roi.pulls.emptySearchRetry", { term: changePlural }) : emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {pulls.length > visibleCount && (
          <div className="flex items-center justify-between gap-4 border-t px-4 py-3">
            <p className="text-xs text-muted-foreground">
              {t("roi.pulls.showingOf", { shown: Math.min(visibleCount, pulls.length), total: pulls.length })}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPagination((current) => ({
                  query,
                  visibleCount: (current.query === query ? current.visibleCount : 10) + 25,
                }))
              }
            >
              {t("roi.pulls.loadMore", { term: changePlural })}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

function ROIMetrics({ summary, branchMode }: { summary: ROISummary; branchMode: boolean }) {
  const { t } = useTranslation();
  const branches = summary.branch_metrics;
  const metrics = summary.metrics;
  return (
    <dl aria-label={t("roi.views.spendEffortAria")} className="grid grid-cols-2 @min-[760px]:grid-cols-4">
      <MetricCard
        title={t("roi.card.costPerHour")}
        value={formatMoney(branchMode ? branches?.cost_per_hour : metrics.cost_per_hour)}
        description={t("roi.card.costPerHourDescription")}
        primary
      />
      <MetricCard
        title={t("roi.card.matchedCosts")}
        value={formatMoney(branchMode ? branches?.spend : metrics.matched_spend)}
        description={t(branchMode ? "roi.card.branchRequests" : "roi.card.gatewayAccounts")}
      />
      <MetricCard
        title={t("roi.card.estimatedEffort")}
        value={t("roi.card.hoursValue", { hours: formatNumber(branchMode ? branches?.hours : metrics.output_hours) })}
        description={t(
          summary.effort_basis === "without_ai" ? "roi.card.effortWithoutAi" : "roi.card.checkAssumptions",
        )}
      />
      <MetricCard
        title={t(branchMode ? "roi.card.branchCoverage" : "roi.card.emailCoverage")}
        value={`${branchMode ? branches?.matched_pulls ?? 0 : metrics.matched_prs} / ${metrics.merged_prs}`}
        description={t(branchMode ? "roi.card.changesWithRecordedCosts" : "roi.card.changesWithEmailMatches")}
      />
    </dl>
  );
}

function MetricCard({
  title,
  value,
  description,
  primary = false,
}: {
  title: string;
  value: string;
  description: string;
  primary?: boolean;
}) {
  return (
    <div className={`min-w-0 space-y-2 p-4 sm:p-5 ${primary ? "bg-muted/30" : ""}`}>
      <dt className="min-h-8 text-xs font-medium text-muted-foreground @min-[360px]:min-h-0">{title}</dt>
      <dd className="whitespace-nowrap text-xl font-semibold tracking-tight tabular-nums @min-[600px]:text-2xl">
        {value}
      </dd>
      <dd className="text-xs leading-5 text-muted-foreground">{description}</dd>
    </div>
  );
}

function ROIComparison({
  summary,
  branchMode,
  onViewPeople,
}: {
  summary: ROISummary;
  branchMode: boolean;
  onViewPeople?: () => void;
}) {
  const { t } = useTranslation();
  const branches = summary.branch_metrics;
  const metrics = summary.metrics;
  const unavailableRate = t(
    metrics.output_hours > 0 ? "roi.comparison.unavailableRepos" : "roi.comparison.matchToCalculate",
  );
  return (
    <div className="border-t">
      {!branchMode && metrics.cohort_people === 0 && onViewPeople && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-3">
          <p className="text-sm text-muted-foreground">{t("roi.comparison.matchPeopleCta")}</p>
          <Button variant="outline" size="sm" onClick={onViewPeople}>
            {t("roi.comparison.matchPeople")}
          </Button>
        </div>
      )}
      <details className="group">
        <summary className="flex cursor-pointer list-none flex-wrap items-center gap-x-3 gap-y-1 px-5 py-3 text-xs [&::-webkit-details-marker]:hidden">
          <span className="flex items-center gap-2 font-medium">
            <ChevronDown aria-hidden="true" className="size-3.5 shrink-0 transition-transform group-open:rotate-180" />
            {t("roi.comparison.howCalculated")}
          </span>
          <span className="text-muted-foreground sm:ml-auto">
            {formatMoney(branchMode ? branches?.unlinked_spend : metrics.excluded_spend)}{" "}
            {t(branchMode ? "roi.comparison.inUnmatched" : "roi.comparison.excludedFromCalc")}
          </span>
        </summary>
        <div className="space-y-3 border-t bg-muted/20 px-5 py-4 text-sm leading-6 text-muted-foreground">
          <p>{effortNote(summary.effort_basis, t)}</p>
          {branchMode ? (
            <>
              <p>{t("roi.comparison.branchRule1")}</p>
              <p>{t("roi.comparison.branchRule2")}</p>
              <p>{t("roi.comparison.branchRule3", { amount: formatMoney(branches?.total_tagged_spend) })}</p>
              {(summary.unlinked_branches?.length ?? 0) > 0 && (
                <div className="space-y-2 border-t pt-3">
                  <h3 className="font-medium text-foreground">{t("roi.comparison.unmatchedBranches")}</h3>
                  <ul className="divide-y">
                    {summary.unlinked_branches?.map((row) => (
                      <li
                        key={`${row.repo}:${row.branch}`}
                        className="flex items-start justify-between gap-4 py-2 text-xs"
                      >
                        <span className="min-w-0 break-all">
                          {row.repo}
                          <br />
                          {row.branch}
                        </span>
                        <span className="shrink-0 tabular-nums">{formatMoney(row.spend)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <>
              <p>
                {metrics.cost_per_hour != null
                  ? t("roi.comparison.peopleFormula", {
                      matched: formatMoney(metrics.matched_spend),
                      hours: formatNumber(metrics.output_hours),
                      perHour: formatMoney(metrics.cost_per_hour),
                    })
                  : unavailableRate}
              </p>
              <p>
                {t(
                  metrics.cohort_people === 1
                    ? "roi.comparison.includesPeopleOne"
                    : "roi.comparison.includesPeopleOther",
                  { count: metrics.cohort_people },
                )}
              </p>
              {onViewPeople && (
                <Button variant="link" className="h-auto p-0" onClick={onViewPeople}>
                  {t("roi.comparison.reviewMatches")}
                </Button>
              )}
            </>
          )}
        </div>
      </details>
    </div>
  );
}

export function ROIPeopleView({
  summary,
  identityMap,
  onMatch,
  readOnly = false,
  matchedOnly = true,
}: {
  summary: ROISummary;
  identityMap: Record<string, string>;
  onMatch: (person: ROIPerson, login: string) => void;
  readOnly?: boolean;
  matchedOnly?: boolean;
}) {
  const { t } = useTranslation();
  const people = matchedOnly ? summary.people.filter(isMatchedPerson) : summary.people;
  const exportCsv = () => {
    const url = URL.createObjectURL(new Blob([peopleCsv({ ...summary, people })], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "litellm-roi.csv";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <div className="space-y-6">
      <div className="@container overflow-hidden rounded-xl border">
        <ROIMetrics summary={summary} branchMode={false} />
        <ROIComparison summary={summary} branchMode={false} />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-base font-semibold">{t("roi.peopleView.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("roi.peopleView.description")}</p>
        </div>
        <Button variant="outline" onClick={exportCsv}>
          <Download />
          {t("roi.peopleView.exportCsv")}
        </Button>
      </div>
      <div className="overflow-hidden rounded-xl border">
        <Table className="min-w-[640px]">
          <TableHeader className="bg-muted/40">
            <TableRow className="hover:bg-transparent">
              <TableHead className="px-4 text-xs text-muted-foreground">{t("roi.peopleView.colPerson")}</TableHead>
              <TableHead className="px-4 text-right text-xs text-muted-foreground">
                {t("roi.pulls.colAiCost")}
              </TableHead>
              <TableHead className="px-4 text-right text-xs text-muted-foreground">
                {t("roi.card.estimatedEffort")}
              </TableHead>
              <TableHead className="px-4 text-right text-xs text-muted-foreground">
                {t("roi.peopleView.colCostPerHour")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {people.map((person) => (
              <TableRow key={person.id}>
                <TableCell className="px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {person.logins.length ? (
                      person.logins.map((login) =>
                        readOnly ? (
                          <span key={login}>{login}</span>
                        ) : (
                          <Button
                            key={login}
                            variant="link"
                            className="h-auto p-0"
                            onClick={() => onMatch(person, login)}
                          >
                            {login}
                          </Button>
                        ),
                      )
                    ) : (
                      <span>{t("roi.peopleView.unassignedSpend")}</span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {t(isMatchedPerson(person) ? "roi.peopleView.matched" : "roi.peopleView.unmatched")}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {person.email || t("roi.peopleView.noPublicEmail")}
                    {person.logins.some((login) => identityMap[login.toLowerCase()])
                      ? t("roi.peopleView.manualMatchSuffix")
                      : ""}
                  </p>
                </TableCell>
                <TableCell className="px-4 py-3 text-right tabular-nums">{formatMoney(person.spend)}</TableCell>
                <TableCell className="px-4 py-3 text-right tabular-nums">
                  {person.estimated_prs > 0 ? t("roi.card.hoursValue", { hours: formatNumber(person.hours) }) : "—"}
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t(person.prs === 1 ? "roi.peopleView.changeCountOne" : "roi.peopleView.changeCountOther", {
                      count: person.prs,
                    })}
                    {person.pending_prs > 0 ? t("roi.peopleView.pendingSuffix", { count: person.pending_prs }) : ""}
                  </p>
                </TableCell>
                <TableCell className="px-4 py-3 text-right tabular-nums">
                  {formatMoney(person.cost_per_hour)}
                  {!person.eligible && (
                    <p className="mt-1 text-xs text-muted-foreground">{t("roi.peopleView.notIncluded")}</p>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {people.length === 0 && (
              <TableRow>
                <TableCell className="h-32 text-center text-muted-foreground" colSpan={4}>
                  {t(matchedOnly ? "roi.peopleView.emptyMatched" : "roi.peopleView.empty")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <details className="group rounded-xl border">
        <summary className="flex cursor-pointer list-none items-center gap-2 px-5 py-3 text-xs font-medium [&::-webkit-details-marker]:hidden">
          <ChevronDown aria-hidden="true" className="size-3.5 transition-transform group-open:rotate-180" />
          {t("roi.peopleView.howMatchingWorks")}
        </summary>
        <div className="space-y-3 border-t px-5 py-4 text-sm leading-6 text-muted-foreground">
          <p>
            {t(
              summary.source_provider === "gitlab"
                ? "roi.peopleView.matchRuleGitLab"
                : "roi.peopleView.matchRuleGitHub",
            )}
          </p>
          <p>{t("roi.peopleView.costRule")}</p>
          <p>{effortNote(summary.effort_basis, t)}</p>
        </div>
      </details>
    </div>
  );
}
