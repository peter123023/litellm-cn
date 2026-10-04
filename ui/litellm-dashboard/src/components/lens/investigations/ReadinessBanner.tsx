"use client";

import type { ComponentProps } from "react";
import { uiHref } from "@/utils/uiHref";
import { cn } from "@/lib/cva.config";
import { useTranslation } from "@/i18n";

export type ReadinessBannerProps = ComponentProps<"div"> & { activityReady: boolean };

export function ReadinessBanner({ activityReady, className, ...props }: ReadinessBannerProps) {
  const { t } = useTranslation();
  return (
    <div
      {...props}
      data-slot="readiness-banner"
      role="status"
      className={cn("flex flex-wrap items-center gap-2 border-y py-3 text-sm text-muted-foreground", className)}
    >
      {t(activityReady ? "lens.investigations.readinessConnectWorker" : "lens.investigations.readinessNotReady")}
      {!activityReady && (
        <a className="font-medium underline" href={uiHref("lens/?tab=traces")}>
          {t("lens.investigations.checkTraces")}
        </a>
      )}
    </div>
  );
}
