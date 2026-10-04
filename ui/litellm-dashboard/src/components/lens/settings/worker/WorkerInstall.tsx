"use client";

import type { ComponentProps, ReactNode } from "react";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, Copy, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cva.config";
import type { WorkerCreated } from "../../model/types";
import { SettingsCard } from "../SettingsSection";
import { workerSetupCommand } from "./workerCommand";
import { useTranslation } from "@/i18n";

function useCopy() {
  return useMutation({ retry: false, mutationFn: (text: string) => navigator.clipboard.writeText(text) });
}

function InstallSteps({ address, created }: { address: string; created: WorkerCreated }) {
  const { t } = useTranslation();
  const command = workerSetupCommand(address, created.token, created.image);
  const copyCommand = useCopy();
  const copyToken = useCopy();
  return (
    <>
      <Button variant="default" className="w-full gap-2" onClick={() => copyCommand.mutate(command)}>
        {copyCommand.isSuccess ? <CheckCircle2 className="size-4" /> : <Copy className="size-4" />}
        {copyCommand.isSuccess ? t("lens.worker.copied") : t("lens.worker.copyDockerCommand")}
      </Button>
      <details className="text-sm">
        <summary className="cursor-pointer text-muted-foreground">{t("lens.worker.viewCommand")}</summary>
        <p className="mt-3 text-xs text-muted-foreground">{t("lens.worker.viewCommandHint")}</p>
        <pre
          aria-label={t("lens.worker.commandPreview")}
          className="mt-3 max-h-48 overflow-auto rounded-md bg-muted/40 p-3 text-xs leading-5"
        >
          {command}
        </pre>
      </details>
      <details className="text-sm">
        <summary className="cursor-pointer text-muted-foreground">{t("lens.worker.composeTitle")}</summary>
        <p className="mt-3 text-muted-foreground">{t("lens.worker.composeHint")}</p>
        <Button variant="outline" className="mt-3" onClick={() => copyToken.mutate(created.token)}>
          {copyToken.isSuccess ? t("lens.worker.tokenCopied") : t("lens.worker.copyWorkerToken")}
        </Button>
      </details>
      <div className="space-y-3 border-t pt-5">
        <div role="status" className="flex items-center gap-2.5 text-sm">
          <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" /> {t("lens.worker.waitingToConnect")}
        </div>
        <details className="pl-6.5 text-sm text-muted-foreground">
          <summary className="cursor-pointer">{t("lens.worker.notConnecting")}</summary>
          <p className="mt-2 break-words leading-6">{t("lens.worker.notConnectingHint", { address })}</p>
        </details>
      </div>
      {(copyCommand.isError || copyToken.isError) && (
        <p role="alert" className="text-sm text-destructive">
          {t("lens.worker.clipboardFailed")}
        </p>
      )}
    </>
  );
}

export type WorkerInstallProps = ComponentProps<"div"> & {
  address: string;
  created: WorkerCreated;
  connected: boolean;
  /** Rendered once the worker connects, in place of the install steps. */
  children: ReactNode;
};

export function WorkerInstall({ address, created, connected, children, className, ...props }: WorkerInstallProps) {
  const { t } = useTranslation();
  if (!connected)
    return (
      <SettingsCard {...props} data-slot="worker-install" className={cn("flex flex-col gap-5", className)}>
        <header className="space-y-1">
          <h3 className="text-base font-semibold">{t("lens.worker.runTitle")}</h3>
          <p className="text-sm text-muted-foreground">{t("lens.worker.installDescription")}</p>
        </header>
        <InstallSteps address={address} created={created} />
      </SettingsCard>
    );
  return (
    <SettingsCard
      {...props}
      data-slot="worker-install"
      className={cn("flex flex-col items-center gap-5 text-center", className)}
    >
      <header className="flex flex-col items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-full bg-success/10 text-success">
          <CheckCircle2 className="size-6" />
        </div>
        <h3 className="text-base font-semibold">{t("lens.worker.connectedTitle")}</h3>
        <p className="text-sm text-muted-foreground">{t("lens.worker.readyDescription")}</p>
      </header>
      {children}
    </SettingsCard>
  );
}
