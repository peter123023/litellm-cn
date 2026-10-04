import { DEFAULT_LANGUAGE, translate, type Translate } from "@/i18n";
import type { components } from "@/lib/http/schema";

const DEFAULT_T: Translate = (key, params) => translate(DEFAULT_LANGUAGE, key, params);

export type ROISummary = components["schemas"]["ROISummaryResponse"];
export type ROIPull = components["schemas"]["ROIPullResponse"];
export type ROIPerson = components["schemas"]["ROIPersonResponse"];
export type ROIEstimate = components["schemas"]["ROIEstimateResponse"];
export type ROISyncStatus = components["schemas"]["ROISyncStatus"];
export type ROISettings = components["schemas"]["ROISettingsResponse"];
export type ROISettingsUpdate = components["schemas"]["ROISettingsUpdate"];
export type ROIRepository = components["schemas"]["ROIRepository"];
export type ROIRepositoriesResponse = components["schemas"]["ROIRepositoriesResponse"];
export type ROIReportResponse = components["schemas"]["ROIReportResponse"];
export type ROIIdentityMapUpdate = components["schemas"]["ROIIdentityMapUpdate"];
export type ROIIdentityMapResponse = components["schemas"]["ROIIdentityMapResponse"];

const SYNCED_AT_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "UTC",
  timeZoneName: "short",
};

export const formatMoney = (value: number | null | undefined): string => {
  if (value == null) return "—";
  if (value > 0 && value < 0.000001) return "<$0.000001";
  const options: Intl.NumberFormatOptions = {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: Math.abs(value) > 0 && Math.abs(value) < 0.01 ? 6 : 2,
  };
  return new Intl.NumberFormat("en-US", options).format(value);
};

export const formatNumber = (value: number | null | undefined): string =>
  value == null ? "—" : new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(value);

export const formatSyncedAt = (value: string): string => {
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) return value;
  return new Intl.DateTimeFormat("en-US", SYNCED_AT_FORMAT_OPTIONS).format(timestamp);
};

export const effortNote = (basis: string | null | undefined, t: Translate = DEFAULT_T): string =>
  basis === "without_ai" ? t("roi.estimator.effortNoteWithoutAi") : t("roi.estimator.effortNoteUnknownBasis");

export const coverageLabel = (
  summary: {
    metrics: Pick<ROISummary["metrics"], "matched_prs" | "merged_prs">;
    source_provider?: string;
  },
  t: Translate = DEFAULT_T,
): string =>
  t("roi.coverage.matchedOfTotal", { matched: summary.metrics.matched_prs, total: summary.metrics.merged_prs });

export const estimateLabel = (estimate: ROIEstimate, t: Translate = DEFAULT_T): string => {
  if (estimate.status === "estimated") return t("roi.estimator.hoursValue", { hours: formatNumber(estimate.hours) });
  if (estimate.status === "error") return t("roi.estimator.estimateFailed");
  return t("roi.estimator.needsReview");
};

const matchedMethods = new Set(["manual", "commit email", "profile email"]);
export const isMatchedPerson = (person: ROIPerson) =>
  Boolean(person.email) && (person.spend !== null || person.match_methods.some((method) => matchedMethods.has(method)));
export const isMatchedPull = (pull: ROIPull) => Boolean(pull.email) && matchedMethods.has(pull.match_method);

export const filterPulls = (pulls: ROIPull[], query: string, matchedOnly = false): ROIPull[] => {
  const normalized = query.trim().toLocaleLowerCase();
  const visible = matchedOnly ? pulls.filter(isMatchedPull) : pulls;
  if (!normalized) return visible;
  return visible.filter((pull) =>
    `${pull.title} ${pull.repo} ${pull.number} ${pull.login} ${pull.source_branch ?? ""}`
      .toLocaleLowerCase()
      .includes(normalized),
  );
};

export const highestCostPulls = (pulls: ROIPull[]): ROIPull[] =>
  pulls
    .filter((pull) => pull.branch_cost?.status === "matched")
    .sort((left, right) => (right.branch_cost?.spend ?? 0) - (left.branch_cost?.spend ?? 0))
    .slice(0, 5);

export const peopleCsv = (summary: Pick<ROISummary, "people" | "start" | "end" | "effort_basis">): string => {
  const escape = (value: unknown): string => {
    const text = value == null ? "" : String(value);
    const safe = /^[=+@\-\t\r]/.test(text) ? `'${text}` : text;
    return `"${safe.replaceAll('"', '""')}"`;
  };
  const rows = summary.people.map((person) => [
    person.email,
    person.logins.join(";"),
    person.spend,
    person.hours,
    person.prs,
    person.pending_prs,
    person.eligible,
    person.cost_per_hour,
    summary.start,
    summary.end,
    summary.effort_basis ?? "unspecified",
  ]);
  return [
    [
      "email",
      "source_logins",
      "gateway_spend_usd",
      "estimated_hours",
      "merged_prs",
      "pending_estimates",
      "in_matched_cohort",
      "cost_per_estimated_hour",
      "start_utc",
      "end_utc",
      "effort_basis",
    ],
    ...rows,
  ]
    .map((row) => row.map(escape).join(","))
    .join("\r\n");
};

export const branchCostLabel = (pull: ROIPull, t: Translate = DEFAULT_T): string => {
  if (!pull.branch_cost || pull.branch_cost.status === "unavailable") return t("roi.branchCost.syncToCalculate");
  if (pull.branch_cost.status === "ambiguous") return t("roi.branchCost.ambiguousBranch");
  if (pull.branch_cost.status === "unattributed") return t("roi.branchCost.noTaggedRequests");
  return formatMoney(pull.branch_cost.spend);
};

export const estimatorModelOptions = (
  settings: Pick<ROISettings, "available_models" | "estimator_models">,
  t: Translate = DEFAULT_T,
) => {
  const details = new Map(settings.estimator_models?.map((model) => [model.model_name, model]));
  const isLuna = (name: string) => /(?:^|\/)gpt-6-luna(?:-\d{4}-\d{2}-\d{2})?$/i.test(name);
  return settings.available_models
    .map((name) => {
      const models = details.get(name)?.provider_models ?? [];
      const recommended = models.length > 0 && models.every(isLuna);
      const label = [...new Set(models.map((model) => (isLuna(model) ? "GPT-6 Luna" : model)))].join(", ") || name;
      return {
        value: name,
        label,
        sublabel: [
          recommended ? t("roi.settings.recommendedModel") : "",
          label !== name ? t("roi.settings.gatewayModelName", { name }) : "",
        ]
          .filter(Boolean)
          .join(" · "),
        recommended,
      };
    })
    .sort(
      (left, right) => Number(right.recommended) - Number(left.recommended) || left.label.localeCompare(right.label),
    );
};
