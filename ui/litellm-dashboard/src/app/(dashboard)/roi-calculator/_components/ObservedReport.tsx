"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, CalendarDays, ChevronDown, ChevronRight, Link2, Search, Users } from "lucide-react";
import { Page, PageTabsList, PageTabsTrigger } from "@/components/shared/Page";
import { PageHeader, PageHeaderTitle } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ObservedAccounts from "./ObservedAccounts";
import { MatchedPeopleToggle } from "./MatchedPeopleToggle";
import { BranchSpend, PersonDetails, PullList } from "./ObservedDetails";
import {
  change,
  dateRange,
  changeTerms,
  duration,
  money,
  number,
  visiblePeople,
  reportPeople,
  filterObservedPulls,
  weeklyMerges,
  type Comparison,
  type ReportPerson,
  type ObservedSnapshot,
  type PeopleSort,
} from "./observedData";
import { useTranslation } from "@/i18n";

function Delta({
  current,
  baseline,
  neutral = false,
}: {
  current: number | null;
  baseline: number | null;
  neutral?: boolean;
}) {
  const { t } = useTranslation();
  const delta = current === null || baseline === null ? null : change(current, baseline);
  if (delta === null) return <span className="text-xs text-muted-foreground">{t("roi.report.noBaseline")}</span>;
  const Icon = delta >= 0 ? ArrowUp : ArrowDown;
  const magnitude = `${number(Math.abs(delta))}%`;
  return (
    <span
      aria-label={t(delta >= 0 ? "roi.report.increaseAria" : "roi.report.decreaseAria", { value: magnitude })}
      className={`inline-flex items-center gap-1 text-xs tabular-nums ${neutral ? "text-muted-foreground" : "text-foreground"}`}
    >
      <Icon className="size-3" />
      {magnitude}
    </span>
  );
}

function Metric({
  label,
  value,
  detail,
  current,
  baseline,
}: {
  label: string;
  value: string;
  detail: string;
  current?: number | null;
  baseline?: number | null;
}) {
  return (
    <div className="min-w-0 bg-background px-4 py-3">
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">{label}</div>
      <div className="mt-1 flex flex-wrap items-baseline gap-2">
        <span className="text-2xl font-semibold tracking-tight tabular-nums">{value}</span>
        {current !== undefined && baseline !== undefined && <Delta current={current} baseline={baseline} />}
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}

function ShippingTrend({ snapshot, comparison }: { snapshot: ObservedSnapshot; comparison: Comparison }) {
  const { t } = useTranslation();
  const terms = changeTerms(snapshot.source_provider, t);
  const current = weeklyMerges(snapshot, "current");
  const baseline = weeklyMerges(snapshot, comparison);
  const max = Math.max(1, ...current, ...baseline);
  return (
    <div className="rounded-xl border p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-medium">{t("roi.trend.title")}</h2>
        <div className="flex gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-sm bg-blue-500" />
            {t("roi.period.currentPeriod")}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-sm bg-slate-300 dark:bg-slate-600" />
            {comparison === "previous" ? t("roi.period.previous") : t("roi.period.lastYear")}
          </span>
        </div>
      </div>
      <div
        className="mt-5 grid gap-2"
        style={{ gridTemplateColumns: `repeat(${current.length}, minmax(0, 1fr))` }}
        role="img"
        aria-label={t("roi.trend.ariaLabel", {
          term: terms.plural,
          current: current.join(", "),
          comparison: baseline.join(", "),
        })}
      >
        {current.map((value, week) => (
          <div key={week} className="min-w-0">
            <div className="flex h-28 items-end justify-center gap-2 border-b border-border/60">
              <div
                className="group relative w-10 rounded-t bg-slate-200 dark:bg-slate-700"
                style={{ height: `${Math.max(2, (baseline[week] / max) * 85)}%` }}
              >
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground">
                  {baseline[week]}
                </span>
              </div>
              <div
                className="relative w-10 rounded-t bg-blue-500/90"
                style={{ height: `${Math.max(2, (value / max) * 85)}%` }}
              >
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-medium">{value}</span>
              </div>
            </div>
            <p className="mt-2 text-center text-[11px] text-muted-foreground">{t("roi.trend.week", { week: week + 1 })}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PeopleTable({
  rows,
  provider,
  matchedOnly,
  comparison,
  onSelect,
}: {
  rows: ReportPerson[];
  provider: ObservedSnapshot["source_provider"];
  matchedOnly: boolean;
  comparison: Comparison;
  onSelect: (person: ReportPerson) => void;
}) {
  const { t } = useTranslation();
  const terms = changeTerms(provider, t);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<PeopleSort>("merged");
  const people = visiblePeople(rows, query, sort);
  const sortLabels = {
    merged: t("roi.people.sortMerged", { term: terms.plural }),
    spend: t("roi.people.sortSpend"),
    cost: t("roi.people.sortCost", { term: terms.singular }),
    name: t("common.name"),
  };
  const emptyMessage = matchedOnly ? t("roi.people.emptyMatched") : t("roi.people.empty");
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-72">
          <Search className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
          <Input
            aria-label={t("roi.people.searchAria")}
            placeholder={t("roi.people.searchPlaceholder")}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            {t(people.length === 1 ? "roi.people.engineerCountOne" : "roi.people.engineerCountOther", {
              count: people.length,
            })}
          </span>
          <Select
            value={sort}
            onValueChange={(value) => {
              if (value) setSort(value);
            }}
            items={[
              { value: "merged", label: sortLabels.merged },
              { value: "spend", label: sortLabels.spend },
              { value: "cost", label: sortLabels.cost },
              { value: "name", label: sortLabels.name },
            ]}
          >
            <SelectTrigger aria-label={t("roi.people.sortBy")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="merged">{sortLabels.merged}</SelectItem>
              <SelectItem value="spend">{sortLabels.spend}</SelectItem>
              <SelectItem value="cost">{sortLabels.cost}</SelectItem>
              <SelectItem value="name">{sortLabels.name}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="pl-5">{t("roi.people.colEngineer")}</TableHead>
              <TableHead className="text-right">{t("roi.people.colMerged", { term: terms.plural })}</TableHead>
              <TableHead>{t("roi.people.colAuthoredAgent")}</TableHead>
              <TableHead className="text-right">
                {comparison === "previous" ? t("roi.period.vsPrevious") : t("roi.period.vsLastYear")}
              </TableHead>
              <TableHead className="text-right">{t("roi.people.colMedianMerge")}</TableHead>
              <TableHead className="text-right">{t("roi.people.colRecordedSpend")}</TableHead>
              <TableHead className="text-right">{t("roi.people.colSpendPer", { term: terms.singular })}</TableHead>
              <TableHead>
                <span className="sr-only">{t("common.details")}</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {people.map((person) => {
              const current = person.periods.current;
              const baseline = person.periods[comparison];
              return (
                <TableRow key={person.id}>
                  <TableCell className="py-3 pl-5">
                    <button
                      className="flex items-center gap-3 rounded text-left hover:underline"
                      onClick={() => onSelect(person)}
                    >
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                        {person.name.slice(0, 2).toUpperCase()}
                      </span>
                      <span>
                        <span className="block font-medium">{person.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {person.email || t("roi.people.notLinked", { host: person.host })}
                        </span>
                      </span>
                    </button>
                  </TableCell>
                  <TableCell className="text-right font-medium tabular-nums">{number(current.merged_prs)}</TableCell>
                  <TableCell>
                    <div className="flex w-28 items-center gap-2">
                      <div className="flex h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                        <span
                          className="bg-blue-500"
                          style={{
                            width: `${current.merged_prs ? (current.direct_authored / current.merged_prs) * 100 : 0}%`,
                          }}
                        />
                        <span
                          className="bg-violet-400"
                          style={{
                            width: `${current.merged_prs ? (current.declared_agent_owned / current.merged_prs) * 100 : 0}%`,
                          }}
                        />
                      </div>
                      <span className="text-[11px] text-muted-foreground">
                        {current.direct_authored}/{current.declared_agent_owned}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Delta current={current.merged_prs} baseline={baseline.merged_prs} neutral />
                    <span className="ml-2 text-xs text-muted-foreground">({baseline.merged_prs})</span>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{duration(current.median_merge_hours)}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {money(current.spend_observation === "no_records" ? null : current.gateway_recorded_spend)}
                  </TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    {money(current.recorded_spend_per_attributed_pr)}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="icon-xs"
                      variant="ghost"
                      aria-label={t("roi.people.viewAria", { name: person.name, term: terms.lower })}
                      onClick={() => onSelect(person)}
                    >
                      <ChevronRight />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {people.length === 0 && (
          <div className="p-10 text-center text-sm text-muted-foreground">
            {query ? t("roi.people.emptySearch", { query }) : emptyMessage}
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        <span className="mr-3 inline-flex items-center gap-1.5">
          <span className="size-2 rounded-sm bg-blue-500" />
          {t("roi.people.legendAuthored")}
        </span>
        <span className="mr-3 inline-flex items-center gap-1.5">
          <span className="size-2 rounded-sm bg-violet-400" />
          {t("roi.people.legendAgent")}
        </span>
        {t("roi.people.legendNote", { singular: terms.singular, plural: terms.plural })}
      </p>
    </div>
  );
}
function Quality({ snapshot, comparison }: { snapshot: ObservedSnapshot; comparison: Comparison }) {
  const { t } = useTranslation();
  const terms = changeTerms(snapshot.source_provider, t);
  const current = snapshot.periods.current;
  const baseline = snapshot.periods[comparison];
  const rows = [
    {
      label: t("roi.quality.bugIssues"),
      current: current.new_bug_labeled_issues,
      baseline: baseline.new_bug_labeled_issues,
      detail: t("roi.quality.bugIssuesDetail"),
    },
    {
      label: t("roi.quality.regressionIssues"),
      current: current.new_regression_labeled_issues,
      baseline: baseline.new_regression_labeled_issues,
      detail: t("roi.quality.regressionIssuesDetail"),
    },
    {
      label: t("roi.quality.revertTitled", { term: terms.plural }),
      current: current.explicitly_titled_revert_prs,
      baseline: baseline.explicitly_titled_revert_prs,
      detail: t("roi.quality.revertTitledDetail", { term: terms.plural }),
    },
  ];
  return (
    <div className="space-y-4">
      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-5">{t("roi.quality.colSignal")}</TableHead>
              <TableHead className="text-right">{t("roi.quality.colCurrent")}</TableHead>
              <TableHead className="text-right">{t("roi.quality.colComparison")}</TableHead>
              <TableHead className="pr-5 text-right">{t("roi.quality.colChange")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.label}>
                <TableCell className="py-5 pl-5">
                  <p className="font-medium">{row.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{row.detail}</p>
                </TableCell>
                <TableCell className="text-right font-medium">{number(row.current)}</TableCell>
                <TableCell className="text-right text-muted-foreground">{number(row.baseline)}</TableCell>
                <TableCell className="pr-5 text-right">
                  <Delta current={row.current} baseline={row.baseline} neutral />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <p className="max-w-3xl text-xs leading-relaxed text-muted-foreground">{t("roi.quality.disclaimer")}</p>
    </div>
  );
}

function costPerChange(period: ObservedSnapshot["periods"]["current"]) {
  if (period.spend_observation !== "records_present" || period.matched_internal_prs === 0) return null;
  return period.matched_users_recorded_spend / period.matched_internal_prs;
}

export default function ObservedReport({
  snapshot,
  accessToken,
  readOnly,
  onRefresh,
  onConnect,
  actions,
  notice,
  syncing,
  onPeriod,
}: {
  snapshot: ObservedSnapshot;
  accessToken: string;
  readOnly: boolean;
  onRefresh: () => void;
  onConnect: () => void;
  actions: React.ReactNode;
  notice?: React.ReactNode;
  syncing: boolean;
  onPeriod?: (days: number) => void;
}) {
  const { t } = useTranslation();
  const [comparison, setComparison] = useState<Comparison>("previous");
  const [activeTab, setActiveTab] = useState(
    snapshot.people.length && snapshot.periods.current.merged_prs > 0 ? "people" : "pulls",
  );
  const [accountEmail, setAccountEmail] = useState<string | null>(null);
  const [matchedOnly, setMatchedOnly] = useState(true);
  const people = useMemo(() => reportPeople(snapshot, matchedOnly), [snapshot, matchedOnly]);
  const pulls = useMemo(() => filterObservedPulls(snapshot, "current", matchedOnly), [snapshot, matchedOnly]);
  const [personId, setPersonId] = useState<string | null>(null);
  const person = people.find((entry) => entry.id === personId) ?? null;
  const terms = changeTerms(snapshot.source_provider, t);
  const current = snapshot.periods.current;
  const baseline = snapshot.periods[comparison];
  const days = Math.round((Date.parse(current.window.end) - Date.parse(current.window.start)) / 86400000) + 1;
  const rangeOptions = [...new Set([7, 28, 90, days])].sort((a, b) => a - b);
  const cost = costPerChange(current);
  const baselineCost = costPerChange(baseline);
  return (
    <Page className="mx-auto max-w-[1500px] gap-3 pb-10 sm:pt-4">
      <PageHeader className="flex flex-wrap items-center justify-between gap-3">
        <PageHeaderTitle className="text-xl">{t("roi.title")}</PageHeaderTitle>
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          {actions}
          {!readOnly && (
            <Button size="sm" variant="outline" onClick={onConnect}>
              <Link2 />
              {t("roi.connections")}
            </Button>
          )}
        </div>
      </PageHeader>
      {notice}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Popover>
          <PopoverTrigger
            render={
              <Button size="sm" variant="outline" className="self-start">
                {t(
                  snapshot.repos.length === 1
                    ? "roi.report.repositoryCountOne"
                    : "roi.report.repositoryCountOther",
                  { count: snapshot.repos.length },
                )}
                <ChevronDown className="size-3.5" />
              </Button>
            }
          />
          <PopoverContent align="start" className="w-80 max-w-[calc(100vw-2rem)] gap-2 p-3">
            <PopoverTitle>{t("roi.report.repositories")}</PopoverTitle>
            <ul className="max-h-64 space-y-2 overflow-y-auto text-xs break-words">
              {snapshot.repos.map((repo) => (
                <li key={repo}>{repo}</li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={String(days)}
            disabled={!onPeriod || syncing}
            onValueChange={(value) => {
              if (value && Number(value) !== days) onPeriod?.(Number(value));
            }}
            items={rangeOptions.map((value) => ({ value: String(value), label: t("roi.period.lastDays", { days: value }) }))}
          >
            <SelectTrigger size="sm" aria-label={t("roi.period.reporting")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {rangeOptions.map((value) => (
                <SelectItem key={value} value={String(value)}>
                  {t("roi.period.lastDays", { days: value })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="flex h-8 items-center gap-2 text-xs text-muted-foreground">
            <CalendarDays className="size-3.5 text-muted-foreground" />
            {dateRange(current.window)}
          </span>
          <Select
            value={comparison}
            onValueChange={(value) => {
              if (value) setComparison(value);
            }}
            items={[
              { value: "previous", label: t("roi.period.vsPreviousPeriod") },
              { value: "last_year", label: t("roi.period.vsSamePeriodLastYear") },
            ]}
          >
            <SelectTrigger size="sm" aria-label={t("roi.period.comparison")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="previous">{t("roi.period.vsPreviousPeriod")}</SelectItem>
              <SelectItem value="last_year">{t("roi.period.vsSamePeriodLastYear")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border lg:grid-cols-4">
        <Metric
          label={t("roi.people.colMerged", { term: terms.plural })}
          value={number(current.merged_prs)}
          current={current.merged_prs}
          baseline={baseline.merged_prs}
          detail={t("roi.metric.inComparison", { count: number(baseline.merged_prs) })}
        />
        <Metric
          label={t("roi.metric.medianMergeTime")}
          value={current.merged_prs === 0 ? t("roi.metric.noMerges") : duration(current.median_merge_hours)}
          current={current.median_merge_hours ?? undefined}
          baseline={baseline.median_merge_hours ?? undefined}
          detail={t("roi.metric.durationInComparison", { duration: duration(baseline.median_merge_hours) })}
        />
        <Metric
          label={t("roi.metric.newBugs")}
          value={number(current.new_bug_labeled_issues)}
          current={current.new_bug_labeled_issues}
          baseline={baseline.new_bug_labeled_issues}
          detail={t("roi.metric.newBugsDetail", { count: number(baseline.new_bug_labeled_issues) })}
        />
        <Metric
          label={t("roi.metric.spendPerMatched", { term: terms.singular })}
          value={money(cost)}
          detail={
            baselineCost === null
              ? t("roi.metric.noGatewayRecords")
              : t("roi.metric.spendDetail", { amount: money(baselineCost) })
          }
        />
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="gap-3">
        <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2 border-b">
          <PageTabsList className="min-w-0 flex-1 basis-full gap-4 border-0 xl:basis-auto">
            <PageTabsTrigger value="people">
              {t("roi.report.tabPeople")} <span className="ml-1.5 text-muted-foreground">{people.length}</span>
            </PageTabsTrigger>
            <PageTabsTrigger value="pulls">{terms.requests}</PageTabsTrigger>
            <PageTabsTrigger value="quality">{t("roi.report.tabQuality")}</PageTabsTrigger>
            <PageTabsTrigger value="branches">{t("roi.report.tabBranchSpend")}</PageTabsTrigger>
          </PageTabsList>
          {activeTab !== "quality" && <MatchedPeopleToggle checked={matchedOnly} onChange={setMatchedOnly} />}
          {!readOnly && (
            <Button
              size="sm"
              variant="outline"
              aria-label={t("roi.accounts.link")}
              title={t("roi.accounts.link")}
              onClick={() => setAccountEmail("")}
            >
              <Users />
              <span className="hidden sm:inline">{t("roi.accounts.link")}</span>
            </Button>
          )}
        </div>
        <TabsContent value="people">
          <PeopleTable
            rows={people}
            provider={snapshot.source_provider}
            matchedOnly={matchedOnly}
            comparison={comparison}
            onSelect={(selected) => setPersonId(selected.id)}
          />
        </TabsContent>
        <TabsContent value="pulls" className="space-y-5">
          {current.merged_prs > 0 || baseline.merged_prs > 0 ? (
            <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
              <ShippingTrend snapshot={snapshot} comparison={comparison} />
              <div className="flex flex-col justify-between rounded-xl border p-5">
                <div>
                  <h2 className="text-sm font-medium">{t("roi.report.behindNumbers")}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {t("roi.report.agentAuthored", {
                      count: number(current.agent_authored),
                      total: number(current.merged_prs),
                      term: terms.plural,
                    })}
                  </p>
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                    {t("roi.report.humanMedianLabel")}{" "}
                    <span className="font-medium text-foreground">
                      {duration(current.human_summary.median_merge_hours)}
                    </span>
                    {t("roi.report.comparedWith", { duration: duration(baseline.human_summary.median_merge_hours) })}
                  </p>
                </div>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t pt-4">
                  <span className="text-xs text-muted-foreground">
                    {t("roi.report.agentNoRequester", {
                      count: number(current.agents_without_requester),
                      term: terms.plural,
                    })}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border p-8 text-center">
              <h2 className="text-base font-medium">{t("roi.report.noMergedYet")}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{t("roi.report.noMergedYetBody")}</p>
            </div>
          )}

          <p className="mb-4 text-xs text-muted-foreground">
            {matchedOnly ? t("roi.report.pullsMatchedNote") : t("roi.report.pullsAllNote", { term: terms.plural })}
          </p>
          <PullList pulls={pulls} provider={snapshot.source_provider} matchedOnly={matchedOnly} />
        </TabsContent>
        <TabsContent value="quality">
          <Quality snapshot={snapshot} comparison={comparison} />
        </TabsContent>
        <TabsContent value="branches">
          <BranchSpend snapshot={snapshot} matchedOnly={matchedOnly} />
        </TabsContent>
      </Tabs>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3 text-xs text-muted-foreground">
        <span className="w-full">
          {t("roi.report.footerMatched", {
            count: number(current.matched_internal_prs),
            term: terms.plural,
            people: snapshot.people.length,
            agentCount: number(current.agents_without_requester),
          })}
        </span>
        <span>{t("roi.report.footerComparing", { range: dateRange(baseline.window) })}</span>
        <span>{t("roi.report.footerSpend")}</span>
      </div>
      {accountEmail !== null && (
        <ObservedAccounts
          accessToken={accessToken}
          people={snapshot.people}
          initialEmail={accountEmail}
          onClose={() => setAccountEmail(null)}
          onSaved={onRefresh}
        />
      )}
      {person && (
        <PersonDetails
          key={person.id}
          person={person}
          snapshot={snapshot}
          comparison={comparison}
          onClose={() => setPersonId(null)}
          onEdit={
            readOnly || !person.matched
              ? undefined
              : () => {
                  setAccountEmail(person.email);
                  setPersonId(null);
                }
          }
        />
      )}
    </Page>
  );
}