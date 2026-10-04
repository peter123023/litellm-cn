"use client";

import { Controller, useFormContext, useWatch } from "react-hook-form";
import { SearchSelect } from "@/components/shared/SearchSelect";
import { analysisModelOptions, type ModelGate } from "./analysisModels";
import type { AnalysisModels } from "./useAnalysisModels";
import type { InvestigationInput } from "../investigationSchema";
import { useTranslation } from "@/i18n";

export interface AnalysisModelFieldProps {
  readonly models: AnalysisModels;
  readonly gate: ModelGate;
}

export function AnalysisModelField({ models, gate }: AnalysisModelFieldProps) {
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
            options={analysisModelOptions(models.models, models.modelDetails, t)}
            value={field.value ?? ""}
            onValueChange={(value) => field.onChange(value ?? "")}
            placeholder={models.modelsLoading ? t("lens.setup.model.loading") : t("lens.setup.model.choose")}
            disabled={models.modelsLoading}
            emptyText={t("lens.setup.model.none")}
          />
        )}
      />
      {models.modelsError && (
        <p role="alert" className="text-sm text-destructive">
          {t("lens.setup.model.loadFailed", { error: models.modelsError })}
        </p>
      )}
      {gate.unavailable && (
        <p role="alert" className="text-sm text-destructive">
          {t("lens.setup.model.unavailable", { model: model ?? "" })}
        </p>
      )}
      {gate.unsupported && (
        <p role="alert" className="text-sm text-destructive">
          {t("lens.setup.model.unsupported")}
        </p>
      )}
    </div>
  );
}
