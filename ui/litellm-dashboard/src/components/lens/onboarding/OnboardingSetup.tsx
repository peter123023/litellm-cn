"use client";

import { useId, type ComponentProps, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cva.config";
import { useTranslation } from "@/i18n";
import type { LensReadiness } from "../hooks/useLensReadiness";
import { useOnboarding } from "./OnboardingContext";
import { OnboardingSteps } from "./OnboardingSteps";

export type OnboardingSetupProps = Omit<ComponentProps<"section">, "children"> & {
  state: LensReadiness;
  action?: ReactNode;
};

export function OnboardingSetup({ state, action, className, ...props }: OnboardingSetupProps) {
  const { readOnly, canInvestigate } = useOnboarding();
  const { t } = useTranslation();
  const titleId = useId();
  return (
    <section
      data-slot="onboarding-setup"
      aria-labelledby={titleId}
      className={cn("min-w-0 scroll-mt-4 outline-none", className)}
      {...props}
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id={titleId} className="text-2xl font-semibold tracking-tight">
            {t("lens.onboarding.setup.title")}
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{t("lens.onboarding.setup.subtitle")}</p>
        </div>
        {action}
      </div>
      <OnboardingSteps state={state} />
      {state.error && (
        <div role="alert" className="mt-4 flex flex-wrap items-center gap-3 text-sm text-destructive">
          <p>{t("lens.onboarding.setup.checkFailed", { error: state.error })}</p>
          <Button variant="outline" size="sm" onClick={state.refresh} disabled={state.checking}>
            {t("common.retry")}
          </Button>
        </div>
      )}
      {(readOnly || !canInvestigate) && (
        <p className="mt-4 text-sm text-muted-foreground">{t("lens.onboarding.setup.adminOnly")}</p>
      )}
    </section>
  );
}
