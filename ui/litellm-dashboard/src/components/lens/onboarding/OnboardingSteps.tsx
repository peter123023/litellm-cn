"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TracingSetupFields } from "@/components/view_logs/TraceView/TracingSetupCard";
import { cn } from "@/lib/cva.config";
import { useTranslation, type Translate } from "@/i18n";
import { useLensAccessToken } from "../data/LensServices";
import type { LensReadiness } from "../hooks/useLensReadiness";
import { initialSetupStep } from "../model/readiness";
import { StepIndicator, type StepState } from "../ui/StepIndicator";
import { useOnboarding } from "./OnboardingContext";

type StepProps = { state: LensReadiness; goTo: (step: number) => void };

function useLocked() {
  const { readOnly, canInvestigate } = useOnboarding();
  return readOnly || !canInvestigate;
}

function StorageStep({ state, goTo }: StepProps) {
  const { readOnly, openTrace } = useOnboarding();
  const { t } = useTranslation();
  const accessToken = useLensAccessToken();
  if (!state.tracingEnabled)
    return (
      <>
        <TracingSetupFields
          detail={t("lens.settings.tracing.notEnabled")}
          accessToken={accessToken}
          onOpenTrace={openTrace}
          onCheck={state.refresh}
          checking={state.checking}
          readOnly={readOnly}
        />
        <ActivityContinuation state={state} />
      </>
    );
  return (
    <div className="space-y-4">
      <p role="status" className="text-sm text-success">
        {t("lens.onboarding.storage.connected")}
      </p>
      <Button onClick={() => goTo(1)}>
        {t("lens.onboarding.storage.continueToAgent")} <ArrowRight aria-hidden="true" className="size-4" />
      </Button>
      <ActivityContinuation state={state} />
    </div>
  );
}

function continuationLabel(state: LensReadiness, t: Translate): string {
  if (state.connected) return t("lens.onboarding.continuation.toInvestigation");
  return state.tracesReady ? t("lens.onboarding.continuation.toWorker") : t("lens.onboarding.continuation.withLogs");
}

function ActivityContinuation({ state }: { state: LensReadiness }) {
  const { connect, create } = useOnboarding();
  const { t } = useTranslation();
  const locked = useLocked();
  if (!state.activityReady) return null;
  return (
    <div className="mt-4">
      <Button onClick={state.connected ? create : connect} disabled={locked}>
        {continuationLabel(state, t)}
        <ArrowRight aria-hidden="true" className="size-4" />
      </Button>
      {state.requestsReady && !state.tracesReady && (
        <p className="mt-2 text-xs text-muted-foreground">{t("lens.onboarding.continuation.logsHint")}</p>
      )}
    </div>
  );
}

function AgentStep({ state }: StepProps) {
  const { readOnly, canMintTracingKey, openTrace } = useOnboarding();
  const { t } = useTranslation();
  const accessToken = useLensAccessToken();
  if (!state.tracingEnabled)
    return (
      <>
        <p className="text-sm text-muted-foreground">{t("lens.onboarding.agent.connectStorageFirst")}</p>
        <ActivityContinuation state={state} />
      </>
    );
  return (
    <>
      <div hidden={state.tracesReady}>
        <TracingSetupFields
          detail={null}
          accessToken={accessToken}
          onOpenTrace={(value) => {
            state.refresh();
            openTrace(value);
          }}
          onCheck={state.refresh}
          checking={state.checking}
          readOnly={readOnly}
          canMintTracingKey={canMintTracingKey}
        />
      </div>
      {state.tracesReady && (
        <p role="status" className="text-sm text-success">
          {t("lens.onboarding.agent.firstTraceReady")}
        </p>
      )}
      <ActivityContinuation state={state} />
    </>
  );
}

function WorkerStep({ state }: StepProps) {
  const { connect, create } = useOnboarding();
  const { t } = useTranslation();
  const locked = useLocked();
  return (
    <div className="space-y-4">
      <p role="status" className="text-sm text-muted-foreground">
        {state.connected ? t("lens.onboarding.worker.connectedBody") : t("lens.onboarding.worker.explainer")}
      </p>
      {!state.activityReady && (
        <p className="text-sm text-muted-foreground">{t("lens.onboarding.worker.recordActivityFirst")}</p>
      )}
      <Button onClick={state.connected ? create : connect} disabled={!state.activityReady || locked}>
        {state.connected ? t("lens.onboarding.continuation.toInvestigation") : t("lens.onboarding.worker.connect")}
        <ArrowRight aria-hidden="true" className="size-4" />
      </Button>
    </div>
  );
}

function InvestigationStep({ state }: StepProps) {
  const { create } = useOnboarding();
  const { t } = useTranslation();
  const locked = useLocked();
  return (
    <div className="space-y-4">
      <p className="text-sm leading-6 text-muted-foreground">{t("lens.onboarding.investigation.body")}</p>
      {!state.ready && (
        <p className="text-sm text-muted-foreground">{t("lens.onboarding.investigation.requirements")}</p>
      )}
      <Button onClick={create} disabled={!state.ready || locked}>
        {t("lens.investigations.newInvestigation")} <ArrowRight aria-hidden="true" className="size-4" />
      </Button>
    </div>
  );
}

interface StepDefinition {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly complete: (state: LensReadiness) => boolean;
  readonly Content: (props: StepProps) => ReactNode;
}

function stepsFor(t: Translate): readonly StepDefinition[] {
  return [
    {
      id: "storage",
      title: t("lens.onboarding.step.storage.title"),
      description: t("lens.onboarding.step.storage.description"),
      complete: (state) => state.tracingEnabled,
      Content: StorageStep,
    },
    {
      id: "agent",
      title: t("lens.onboarding.step.agent.title"),
      description: t("lens.onboarding.step.agent.description"),
      complete: (state) => state.tracesReady,
      Content: AgentStep,
    },
    {
      id: "worker",
      title: t("lens.onboarding.step.worker.title"),
      description: t("lens.onboarding.step.worker.description"),
      complete: (state) => state.connected,
      Content: WorkerStep,
    },
    {
      id: "investigation",
      title: t("lens.onboarding.step.investigation.title"),
      description: t("lens.onboarding.step.investigation.description"),
      complete: (state) => state.hasInvestigations,
      Content: InvestigationStep,
    },
  ];
}

function stepState(complete: boolean, open: boolean): StepState {
  if (complete) return "complete";
  return open ? "current" : "upcoming";
}

export function OnboardingSteps({ state, className }: { state: LensReadiness; className?: string }) {
  const id = useId();
  const listRef = useRef<HTMLOListElement>(null);
  const { t } = useTranslation();
  const [step, setStep] = useState(() => initialSetupStep(state));
  const goTo = (index: number) => {
    setStep(index);
    listRef.current?.querySelector<HTMLButtonElement>(`[aria-controls="${id}-${index}"]`)?.focus();
  };
  return (
    <ol
      ref={listRef}
      data-slot="onboarding-steps"
      className={cn("divide-y overflow-hidden rounded-2xl border bg-card", className)}
    >
      {stepsFor(t).map(({ id: stepId, title, description, complete, Content }, index) => {
        const open = step === index;
        return (
          <li key={stepId}>
            <h3>
              <button
                type="button"
                id={`${id}-trigger-${index}`}
                aria-expanded={open}
                aria-controls={`${id}-${index}`}
                onClick={() => setStep(index)}
                className="group flex w-full items-start gap-4 p-5 text-left outline-none hover:bg-muted/30 focus-visible:bg-muted/50 sm:p-6"
              >
                <StepIndicator index={index} state={stepState(complete(state), open)} />
                <span className="min-w-0 flex-1">
                  <span
                    className={cn(
                      "block text-sm font-medium sm:text-base",
                      !open && "text-muted-foreground group-hover:text-foreground",
                    )}
                  >
                    {title}
                  </span>
                  <span className="mt-1 block text-sm leading-6 font-normal text-muted-foreground">{description}</span>
                </span>
                <ChevronDown
                  aria-hidden="true"
                  className={cn("mt-1 size-4 shrink-0 text-muted-foreground", open && "rotate-180")}
                />
              </button>
            </h3>
            <div
              id={`${id}-${index}`}
              role="region"
              aria-labelledby={`${id}-trigger-${index}`}
              hidden={!open}
              className="px-5 pb-6 sm:pr-6 sm:pb-7 sm:pl-17"
            >
              <Content state={state} goTo={goTo} />
            </div>
          </li>
        );
      })}
    </ol>
  );
}
