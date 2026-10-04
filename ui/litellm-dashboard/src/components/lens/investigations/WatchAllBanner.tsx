"use client";

import { z } from "zod";
import { useTranslation } from "@/i18n";
import { useLensUpdate } from "../data/mutations";
import type { Lens } from "../model/types";

const watchAllResult = z.object({
  skipped: z.array(z.object({ id: z.string(), name: z.string(), reason: z.string() })),
});

export interface WatchAllBannerProps {
  readonly lenses: readonly Lens[];
}

export function WatchAllBanner({ lenses }: WatchAllBannerProps) {
  const { t } = useTranslation();
  const watchAll = useLensUpdate();
  const paused = lenses.filter((lens) => !lens.settings.enabled).length;
  if (paused === 0) return null;
  const result = watchAllResult.safeParse(watchAll.data);
  const skipped = result.success ? result.data.skipped : [];
  if (skipped.length >= paused)
    return (
      <span
        role="status"
        className="text-xs text-muted-foreground"
        title={skipped.map((s) => `${s.name}: ${s.reason}`).join("\n")}
      >
        {t("lens.investigations.pausedCount", { count: paused })} ·{" "}
        {t(
          skipped.length === 1 ? "lens.investigations.needsFixOne" : "lens.investigations.needsFixMany",
          skipped.length === 1 ? { name: skipped[0].name } : { count: skipped.length },
        )}
      </span>
    );
  return (
    <span role="status" className="text-xs text-muted-foreground">
      {t("lens.investigations.pausedCount", { count: paused })} ·{" "}
      {watchAll.error && <span className="text-destructive">{watchAll.error.message} · </span>}
      <button
        type="button"
        disabled={watchAll.isPending}
        onClick={() => watchAll.mutate((api) => api.watchAll())}
        className="font-medium text-foreground underline-offset-2 hover:underline disabled:opacity-50"
      >
        {t("lens.investigations.turnAllOn")}
      </button>
    </span>
  );
}
