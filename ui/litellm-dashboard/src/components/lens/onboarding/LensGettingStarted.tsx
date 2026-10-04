"use client";

import { useRef } from "react";
import { Check, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n";
import type { LensReadiness } from "../hooks/useLensReadiness";
import { LensIntroduction } from "./LensIntroduction";
import { OnboardingSetup } from "./OnboardingSetup";

export interface LensGettingStartedProps {
  readonly state: LensReadiness;
  readonly onStart: () => void;
  readonly onExit: (to: "traces" | "investigations") => void;
  readonly onDemo?: () => void;
}

export function LensGettingStarted({ state, onStart, onExit, onDemo }: LensGettingStartedProps) {
  const setupRef = useRef<HTMLElement>(null);
  const { t } = useTranslation();
  const exitTo = state.tracesReady ? "traces" : "investigations";
  const start = () => {
    onStart();
    setupRef.current?.scrollIntoView({ block: "start" });
    setupRef.current?.focus({ preventScroll: true });
  };
  return (
    <div className="w-full space-y-6">
      <LensIntroduction onStart={start} onDemo={onDemo} />
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_280px] xl:gap-8">
        <OnboardingSetup
          ref={setupRef}
          tabIndex={-1}
          state={state}
          onFocusCapture={onStart}
          action={
            (state.activityReady || state.hasInvestigations) && (
              <Button variant="outline" size="sm" onClick={() => onExit(exitTo)}>
                {exitTo === "traces"
                  ? t("lens.investigations.welcomeViewTraces")
                  : t("lens.onboarding.viewInvestigations")}
              </Button>
            )
          }
        />
        <Prerequisites />
      </div>
    </div>
  );
}

function Prerequisites() {
  const { t } = useTranslation();
  const items: readonly { readonly id: string; readonly title: string; readonly detail: string }[] = [
    {
      id: "gateway",
      title: t("lens.onboarding.flow.gateway"),
      detail: t("lens.onboarding.prereq.gatewayDetail"),
    },
    { id: "storage", title: t("lens.onboarding.prereq.storage"), detail: t("lens.onboarding.prereq.storageDetail") },
    { id: "server", title: t("lens.onboarding.prereq.server"), detail: t("lens.onboarding.prereq.serverDetail") },
    { id: "model", title: t("lens.onboarding.prereq.model"), detail: t("lens.onboarding.prereq.modelDetail") },
  ];
  return (
    <aside className="rounded-2xl border bg-card p-6" aria-labelledby="lens-prerequisites">
      <h2 id="lens-prerequisites" className="text-base font-semibold">
        {t("lens.onboarding.prereq.title")}
      </h2>
      <ul className="mt-5 space-y-5 text-sm">
        {items.map((item) => (
          <li key={item.id} className="flex gap-3">
            <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="mt-1 leading-5 text-muted-foreground">{item.detail}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-5 flex gap-2 border-t pt-5 text-xs leading-5 text-muted-foreground">
        <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
        <p>{t("lens.onboarding.prereq.privacy")}</p>
      </div>
    </aside>
  );
}
