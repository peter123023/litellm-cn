"use client";

import { KeyRound } from "lucide-react";

import { useTranslation } from "@/i18n";
import { Button } from "@/components/ui/button";

interface HashicorpVaultEmptyPlaceholderProps {
  onAdd: () => void;
}

export default function HashicorpVaultEmptyPlaceholder({ onAdd }: HashicorpVaultEmptyPlaceholderProps) {
  const { t } = useTranslation();

  return (
    <div className="flex w-full flex-col items-center rounded-lg border border-dashed border-border bg-card p-12 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
        <KeyRound className="size-6 text-muted-foreground" />
      </div>
      <h4 className="text-base font-semibold text-foreground">{t("adminSettings.hashicorpVault.empty.title")}</h4>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        {t("adminSettings.hashicorpVault.empty.body")}
      </p>
      <Button size="lg" onClick={onAdd} className="mt-4">
        {t("adminSettings.hashicorpVault.empty.action")}
      </Button>
    </div>
  );
}
