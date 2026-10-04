"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

import { Inspector } from "@/components/shared/Inspector";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/i18n";

import { evidenceTarget } from "../model/findings";
import { runTime } from "../model/format";
import { findingAgents, findingKey, type OwnedFinding, sampledExecutions } from "../model/inbox";
import type { Finding, Sample } from "../model/types";
import { EvidenceView } from "./Evidence";
import { IssueBrief } from "./IssueBrief";
import { type EvidenceRef, useEvidenceRoute } from "../route";

export const ownedFindingKey = (owned: OwnedFinding): string => findingKey(owned.lens, owned.finding);

export interface FindingDetailsProps {
  readonly finding: Finding;
  readonly agents?: readonly string[];
  readonly sampledRuns: Sample["executions"];
  readonly readOnly: boolean;
  readonly busy: boolean;
  readonly onOpenEvidence: (evidence: EvidenceRef) => void;
  readonly onReview: (status: Finding["status"], reason: string) => void;
}

export function FindingDetails({
  finding,
  agents = [],
  sampledRuns,
  readOnly,
  busy,
  onOpenEvidence,
  onReview,
}: FindingDetailsProps) {
  const [reason, setReason] = useState(finding.reason ?? "");
  const { t } = useTranslation();
  const occurrences = finding.occurrences?.length ?? 0;
  const evidenceGroups = [...new Set(finding.evidence.map((e) => e.execution_id))].map((id) => ({
    id,
    run: sampledRuns.find((r) => r.id === id),
    quotes: finding.evidence.filter((e) => e.execution_id === id),
  }));
  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <header className="flex flex-col gap-1.5 border-b px-4 py-4">
        <h2 className="text-xl leading-snug font-semibold">{finding.title}</h2>
        <p className="text-sm text-muted-foreground">
          {agents.length > 0 && <span className="font-medium text-foreground">{agents.join(", ")} · </span>}
          {finding.kind === "issue"
            ? t("lens.investigations.priorityLabel", { priority: finding.priority })
            : t("lens.investigations.pattern")}{" "}
          ·{" "}
          {occurrences === 1
            ? t("lens.investigations.linkedRunCountOne", { count: occurrences })
            : t("lens.investigations.linkedRunCountMany", { count: occurrences })}
        </p>
      </header>
      <div className="space-y-6 p-4">
        {finding.brief ? (
          <IssueBrief title={finding.title} brief={finding.brief} />
        ) : (
          <>
            <div>
              <p className="mb-2 text-sm font-medium">{t("lens.investigations.whatHappened")}</p>
              <p className="text-sm leading-6 whitespace-pre-wrap">{finding.description}</p>
            </div>
            {finding.suggestion && (
              <div className="border-y py-4">
                <p className="text-sm font-medium">{t("lens.investigations.whatToDoNext")}</p>
                <p className="mt-2 text-sm leading-6">{finding.suggestion}</p>
              </div>
            )}
          </>
        )}
        {finding.limitation && (
          <details className="text-sm">
            <summary className="cursor-pointer font-medium">{t("lens.investigations.evidenceLimits")}</summary>
            <p className="mt-3 leading-6 text-muted-foreground">{finding.limitation}</p>
          </details>
        )}
        <div>
          <p className="text-sm font-medium">{t("lens.investigations.evidenceByRun")}</p>
          <p className="mt-1 mb-3 text-xs text-muted-foreground">{t("lens.investigations.evidenceByRunBody")}</p>
          <div className="space-y-2">
            {evidenceGroups.map((group) => (
              <details key={group.id} className="rounded-lg border p-3">
                <summary className="cursor-pointer text-sm font-medium">
                  {group.run?.name ?? evidenceTarget(group.id)?.id.slice(0, 12) ?? t("lens.common.recordedRun")}
                  <span className="ml-2 text-xs font-normal text-muted-foreground">
                    {group.quotes.length === 1
                      ? t("lens.investigations.quoteCountOne", { count: group.quotes.length })
                      : t("lens.investigations.quoteCountMany", { count: group.quotes.length })}
                    {group.run ? ` · ${runTime(group.run.start_time)}` : ""}
                  </span>
                </summary>
                <div className="mt-3 space-y-3">
                  {group.quotes.map((e, i) => (
                    <div key={`${e.span_id}-${i}`} className="rounded-md bg-muted/40 p-3">
                      {e.role === "counterexample" && (
                        <p className="mb-1 text-xs font-medium text-muted-foreground">
                          {t("lens.investigations.counterexample")}
                        </p>
                      )}
                      <blockquote className="text-xs leading-5 whitespace-pre-wrap break-words">{e.quote}</blockquote>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2"
                        onClick={() => onOpenEvidence({ id: e.execution_id, span: e.span_id })}
                      >
                        {evidenceTarget(e.execution_id)?.source === "traces"
                          ? t("lens.investigations.openOriginalStep")
                          : t("lens.investigations.openRequest")}
                        <ArrowUpRight className="size-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </div>
        {!readOnly && (
          <div className="space-y-3 border-t pt-4">
            <label className="grid gap-2 text-sm">
              {t("lens.investigations.rememberPrompt")}
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={t("lens.investigations.rememberPlaceholder")}
              />
            </label>
            <p className="text-xs text-muted-foreground">{t("lens.investigations.rememberHint")}</p>
            <div className="flex flex-wrap gap-2">
              {finding.kind === "issue" && (
                <Button
                  disabled={busy}
                  onClick={() => onReview(finding.status === "resolved" ? "open" : "resolved", reason)}
                >
                  {finding.status === "resolved"
                    ? t("lens.investigations.reopen")
                    : t("lens.investigations.markResolved")}
                </Button>
              )}
              <Button disabled={busy} variant="outline" onClick={() => onReview("dismissed", reason)}>
                {t("lens.investigations.thisIsExpected")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export interface FindingPanelProps {
  readonly readOnly: boolean;
  readonly busy: boolean;
  /** Runs to name evidence by; defaults to every run the owning investigation has sampled. */
  readonly sampledRuns?: Sample["executions"];
  readonly onReview: (owned: OwnedFinding, status: Finding["status"], reason: string) => void;
}

/**
 * A finding in the side panel. Opening a quote's original step or request stacks it over the finding, which
 * stays mounted so a feedback draft survives the round trip.
 */
export function FindingPanelBody({
  owned,
  readOnly,
  busy,
  sampledRuns,
  onReview,
}: FindingPanelProps & { readonly owned: OwnedFinding }) {
  const { evidence, setEvidence } = useEvidenceRoute();
  const { t } = useTranslation();
  return (
    <>
      <div hidden={evidence !== null} className={evidence ? undefined : "flex min-h-0 flex-1 flex-col"}>
        <FindingDetails
          key={ownedFindingKey(owned)}
          finding={owned.finding}
          agents={findingAgents(owned.lens, owned.finding)}
          sampledRuns={sampledRuns ?? sampledExecutions(owned.lens)}
          readOnly={readOnly}
          busy={busy}
          onOpenEvidence={setEvidence}
          onReview={(status, reason) => onReview(owned, status, reason)}
        />
      </div>
      {evidence && (
        <EvidenceView
          lensId={owned.lens.id}
          evidence={evidence}
          backLabel={t("lens.investigations.backToFinding")}
          onBack={() => setEvidence(null)}
        />
      )}
    </>
  );
}

/** The side panel for whichever finding the surrounding Inspector has open. */
export function FindingPanel(props: FindingPanelProps) {
  const { t } = useTranslation();
  return (
    <Inspector.Panel label={t("lens.investigations.findingPanelLabel")} testId="finding-panel">
      {(owned: OwnedFinding) => <FindingPanelBody {...props} owned={owned} />}
    </Inspector.Panel>
  );
}
