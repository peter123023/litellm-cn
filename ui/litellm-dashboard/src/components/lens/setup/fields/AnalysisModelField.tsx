"use client";

import { Controller, useFormContext, useWatch } from "react-hook-form";
import { SearchSelect } from "@/components/shared/SearchSelect";
import { analysisModelOptions, type AnalysisModelInfo } from "./analysisModels";
import { useTranslation } from "@/i18n";
import type { InvestigationInput } from "../investigationSchema";

export function AnalysisModelField({
  models,
  modelDetails,
  modelsLoading,
  modelsError,
  unavailable,
  unsupported,
}: {
  models: string[];
  modelDetails: AnalysisModelInfo[];
  modelsLoading: boolean;
  modelsError?: string;
  unavailable: boolean;
  unsupported: boolean;
}) {
  const { control } = useFormContext<InvestigationInput>();
  const { t } = useTranslation();
  const model = useWatch({ control, name: "selectedModel" });
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{t("lens.setup.model.label")}</p>
      <Controller
        control={control}
        name="selectedModel"
        render={({ field }) => (
          <SearchSelect
            aria-label={t("lens.setup.model.label")}
            options={analysisModelOptions(models, modelDetails, t)}
            value={field.value ?? ""}
            onValueChange={(value) => field.onChange(value ?? "")}
            placeholder={modelsLoading ? t("lens.setup.model.loading") : t("lens.setup.model.choose")}
            disabled={modelsLoading}
            emptyText={t("lens.setup.model.none")}
          />
        )}
      />
      {modelsError && (
        <p role="alert" className="text-sm text-destructive">
          {t("lens.setup.model.loadFailed", { error: modelsError })}
        </p>
      )}
      {unavailable && (
        <p role="alert" className="text-sm text-destructive">
          {t("lens.setup.model.unavailable", { model: model ?? "" })}
        </p>
      )}
      {unsupported && (
        <p role="alert" className="text-sm text-destructive">
          {t("lens.setup.model.unsupported")}
        </p>
      )}
    </div>
  );
}
