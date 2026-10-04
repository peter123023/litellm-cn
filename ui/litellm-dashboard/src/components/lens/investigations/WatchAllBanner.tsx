"use client";

import type { Lens } from "../model/types";
import { useTranslation } from "@/i18n";

export function WatchAllBanner({
  lenses,
  busy,
  onWatchAll,
  skipped = [],
}: {
  lenses: readonly Lens[];
  busy: boolean;
  onWatchAll: () => void;
  skipped?: readonly { id: string; name: string; reason: string }[];
}) {
  const { t } = useTranslation();
  const paused = lenses.filter((lens) => !lens.settings.enabled).length;
  if (paused === 0) return null;
  if (skipped.length >= paused)
    return (
      <span
        role="status"
        className="text-xs text-muted-foreground"
        title={skipped.map((s) => `${s.name}: ${s.reason}`).join("\n")}
      >
        {t("lens.investigations.pausedCount", { count: paused })}{" "}
        {t(
          skipped.length === 1 ? "lens.investigations.needsFixOne" : "lens.investigations.needsFixMany",
          skipped.length === 1 ? { name: skipped[0].name } : { count: skipped.length },
        )}
      </span>
    );
  return (
    <span role="status" className="text-xs text-muted-foreground">
      {t("lens.investigations.pausedCount", { count: paused })}{" "}
      <button
        type="button"
        disabled={busy}
        onClick={onWatchAll}
        className="font-medium text-foreground underline-offset-2 hover:underline disabled:opacity-50"
      >
        {t("lens.investigations.turnAllOn")}
      </button>
    </span>
  );
}
