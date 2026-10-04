"use client";

import { Controller, useFormContext, useWatch } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { AnalysisKeyPicker } from "./AnalysisKeyPicker";

import { AnalysisAccessFields } from "./AnalysisAccessFields";
import { useTranslation } from "@/i18n";
import type { WorkerFormInput } from "./workerSchema";

export function WorkerForm({ editingWorker }: { editingWorker: string | null }) {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<WorkerFormInput>();
  const { t } = useTranslation();
  const useExisting = useWatch({ control, name: "useExisting" });
  return (
    <div className="min-w-0 space-y-5">
      {useExisting ? <AnalysisKeyPicker /> : <AnalysisAccessFields />}
      <details className="text-sm" open={editingWorker ? true : undefined}>
        <summary className="cursor-pointer font-medium">{t("lens.setup.advancedOptions")}</summary>
        <div className="mt-4 space-y-5">
          <label className="flex items-center justify-between gap-4">
            {t("lens.worker.useExistingKey")}
            <Controller
              control={control}
              name="useExisting"
              render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
            />
          </label>
          {!editingWorker && (
            <div className="space-y-2">
              <label htmlFor="worker-proxy-address" className="block text-sm font-medium">
                {t("lens.worker.proxyUrl")}
              </label>
              <Input id="worker-proxy-address" {...register("address")} />
              <p className="text-xs text-muted-foreground">{t("lens.worker.proxyUrlHint")}</p>
              {errors.address?.message && <p className="text-sm text-destructive">{errors.address.message}</p>}
            </div>
          )}
        </div>
      </details>
    </div>
  );
}
