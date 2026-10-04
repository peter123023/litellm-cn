import { useState } from "react";
import { ArrowRight, ArrowUpRight, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cva.config";
import { useTranslation } from "@/i18n";
import styles from "./LensIntroduction.module.css";
import { GatewayFlow } from "./GatewayFlow";

const traceSteps = [
  { name: "research_agent", start: 0, duration: 14.2, failed: false },
  { name: "plan", start: 0, duration: 1.7, failed: false },
  { name: "search_docs", start: 1.7, duration: 3.1, failed: false },
  { name: "run_benchmark", start: 4.8, duration: 1.3, failed: true },
  { name: "search_docs", start: 6.1, duration: 3.6, failed: false },
  { name: "answer", start: 9.7, duration: 4.5, failed: false },
];

type EvidenceProps = { highlighted: boolean; onHighlight: () => void };

function TraceExample({ highlighted, onHighlight }: EvidenceProps) {
  const { t } = useTranslation();
  return (
    <section
      aria-labelledby="lens-sample-trace"
      className={cn(styles.sampleCard, "min-w-0 rounded-xl border bg-card p-4")}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <h3 id="lens-sample-trace" className="font-semibold">
          {t("lens.onboarding.sample.tracing")}
        </h3>
        <p className="text-xs text-muted-foreground">{t("lens.onboarding.sample.traceMeta")}</p>
      </div>
      <ol
        className="mt-3 space-y-1.5 text-xs leading-5 sm:text-sm"
        aria-label={t("lens.onboarding.sample.timelineLabel")}
      >
        {traceSteps.map((item, index) => {
          const linked = item.failed || item.name === "answer";
          const rowClass =
            "grid w-full grid-cols-[minmax(0,1fr)_minmax(48px,1fr)_2.5rem] items-center gap-2 text-left sm:gap-3";
          const content = (
            <>
              <span className={cn("flex min-w-0 items-center gap-1", index > 0 && "pl-2")}>
                {index === 0 ? (
                  <ChevronDown aria-hidden="true" className="size-3 shrink-0" />
                ) : (
                  <ChevronRight aria-hidden="true" className="size-3 shrink-0" />
                )}
                <span className="truncate" title={item.name}>
                  {item.name}
                </span>
                {item.failed && <span className="sr-only">{t("lens.onboarding.sample.failed")}</span>}
              </span>
              <span aria-hidden="true" className="relative h-2.5 overflow-hidden rounded-sm bg-muted/70">
                <span
                  className={cn(
                    "absolute inset-y-0 rounded-sm",
                    linked && styles.evidenceBar,
                    item.failed ? "bg-rose-400" : "bg-indigo-600 dark:bg-indigo-400",
                  )}
                  style={{ left: `${(item.start / 14.2) * 100}%`, width: `${(item.duration / 14.2) * 100}%` }}
                />
              </span>
              <span className="text-right tabular-nums text-muted-foreground">{item.duration}s</span>
            </>
          );
          return (
            <li key={`${item.name}-${item.start}`}>
              {linked ? (
                <button
                  type="button"
                  className={cn(rowClass, styles.evidenceLink)}
                  data-evidence-link=""
                  aria-label={t(
                    item.failed ? "lens.onboarding.sample.highlightFailed" : "lens.onboarding.sample.highlight",
                    { name: item.name, duration: item.duration },
                  )}
                  aria-controls="lens-linked-finding"
                  aria-pressed={highlighted}
                  onClick={onHighlight}
                >
                  {content}
                </button>
              ) : (
                <div className={rowClass}>{content}</div>
              )}
            </li>
          );
        })}
      </ol>
      <div className="mt-3 grid gap-3 border-t pt-3 sm:grid-cols-2">
        <div id="lens-benchmark-output" className={cn(styles.evidenceOutput, "rounded-lg bg-muted/60 p-2.5")}>
          <p className="text-xs text-muted-foreground">{t("lens.onboarding.sample.benchmarkOutput")}</p>
          <p className="mt-1.5 text-sm leading-4.5">{t("lens.onboarding.sample.benchmarkError")}</p>
        </div>
        <div id="lens-answer-output" className={cn(styles.evidenceOutput, "rounded-lg bg-muted/60 p-2.5")}>
          <p className="text-xs text-muted-foreground">{t("lens.onboarding.sample.answerOutput")}</p>
          <p className="mt-1.5 text-sm leading-4.5">“{t("lens.onboarding.sample.answer")}”</p>
        </div>
      </div>
    </section>
  );
}

function FindingExamples({ highlighted, onHighlight }: EvidenceProps) {
  const { t } = useTranslation();
  return (
    <section
      aria-labelledby="lens-sample-findings"
      className={cn(styles.sampleCard, "min-w-0 rounded-xl border bg-card p-4")}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <h3 id="lens-sample-findings" className="font-semibold">
          {t("lens.onboarding.findings.heading")}
        </h3>
        <p className="text-xs text-muted-foreground">{t("lens.onboarding.findings.sampleRuns")}</p>
      </div>
      <div className="mt-3 divide-y border-t">
        <article id="lens-linked-finding" className={cn(styles.evidenceFinding, "py-3")}>
          <h4 className="text-sm font-semibold">
            <button
              type="button"
              className={cn(styles.evidenceLink, "flex w-full items-start gap-2 text-left")}
              data-evidence-link=""
              aria-controls="lens-benchmark-output lens-answer-output"
              aria-pressed={highlighted}
              onClick={onHighlight}
            >
              <span aria-hidden="true" className="mt-1.5 size-2 shrink-0 rounded-full bg-rose-500" />
              {t("lens.onboarding.findings.first")}
            </button>
          </h4>
          <div className="ml-4 mt-1.5 space-y-1.5 text-sm leading-4.5">
            <p className="text-muted-foreground">{t("lens.onboarding.findings.firstBody")}</p>
            <blockquote className="border-l-2 pl-3 italic">“{t("lens.onboarding.findings.quote")}”</blockquote>
            <p>
              <span className="text-muted-foreground">{t("lens.onboarding.findings.nextStep")}</span>
              {t("lens.onboarding.findings.nextStepBody")}
            </p>
            <p className="text-xs text-muted-foreground">{t("lens.onboarding.findings.firstMeta")}</p>
          </div>
        </article>
        <article className="pt-3">
          <h4 className="flex items-start gap-2 text-sm font-semibold">
            <span aria-hidden="true" className="mt-1.5 size-2 shrink-0 rounded-full bg-amber-500" />
            {t("lens.onboarding.findings.second")}
          </h4>
          <div className="ml-4 mt-1.5 space-y-1.5 text-sm leading-4.5 text-muted-foreground">
            <p>{t("lens.onboarding.findings.secondBody")}</p>
            <p className="text-xs">{t("lens.onboarding.findings.secondMeta")}</p>
          </div>
        </article>
      </div>
    </section>
  );
}

export function LensIntroduction({ onStart, onDemo }: { onStart: () => void; onDemo?: () => void }) {
  const [highlighted, setHighlighted] = useState(false);
  const { t } = useTranslation();
  const toggleEvidence = () => setHighlighted((current) => !current);
  return (
    <section
      aria-labelledby="lens-introduction"
      className="rounded-2xl border bg-card p-5 sm:px-6 sm:py-5 xl:px-7 xl:py-6"
    >
      <h2 id="lens-introduction" className="text-2xl leading-tight font-semibold tracking-tight sm:text-3xl">
        {t("lens.onboarding.intro.heading")}
      </h2>
      <p className="mt-3 max-w-[780px] text-sm leading-6 text-muted-foreground">{t("lens.onboarding.intro.body")}</p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {onDemo && (
          <Button className="rounded-lg px-4" onClick={onDemo}>
            {t("lens.onboarding.intro.exploreDemo")} <ArrowRight aria-hidden="true" className="size-4" />
          </Button>
        )}
        <Button variant={onDemo ? "outline" : "default"} className="rounded-lg px-4" onClick={onStart}>
          {t("lens.onboarding.intro.setup")}
        </Button>
        <a
          href="https://docs.litellm.ai/docs/proxy/lens"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 px-3 text-sm font-medium text-muted-foreground underline-offset-4 hover:underline"
        >
          {t("lens.settings.docs")} <ArrowUpRight aria-hidden="true" className="size-4" />
        </a>
      </div>
      <GatewayFlow />
      <div
        className={cn(styles.examples, "mt-4 grid items-stretch gap-3 md:grid-cols-2")}
        data-evidence-active={highlighted}
      >
        <TraceExample highlighted={highlighted} onHighlight={toggleEvidence} />
        <FindingExamples highlighted={highlighted} onHighlight={toggleEvidence} />
      </div>
    </section>
  );
}
