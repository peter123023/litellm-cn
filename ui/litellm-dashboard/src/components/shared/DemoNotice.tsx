"use client";

import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n";

export function DemoNotice({ onExit }: { onExit?: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-info/20 bg-info/10 px-4 py-3">
      <p role="status" className="flex items-center gap-2 text-sm font-medium text-info">
        <Info aria-hidden="true" className="size-4 shrink-0" />
        {t("demoNotice.viewingDemoData")}
      </p>
      <Button variant="outline" size="sm" onClick={onExit}>
        {t("demoNotice.exitDemo")}
      </Button>
    </div>
  );
}
