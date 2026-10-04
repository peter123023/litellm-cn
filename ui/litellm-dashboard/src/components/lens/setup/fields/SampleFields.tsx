"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";

import { DurationInput } from "@/components/shared/DurationInput";
import { useTranslation } from "@/i18n";
import type { InvestigationInput } from "../investigationSchema";

export function SampleFields() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<InvestigationInput>();
  const { t } = useTranslation();
  return (
    <>
      <Controller
        control={control}
        name="selection.lookback_hours"
        render={({ field }) => (
          <DurationInput
            label={t("lens.setup.sample.reviewLast")}
            value={field.value ?? 24}
            base="hours"
            onChange={field.onChange}
          />
        )}
      />
      {errors.selection?.lookback_hours?.message && (
        <p role="alert" className="text-sm text-destructive">
          {errors.selection.lookback_hours.message}
        </p>
      )}
      <label className="grid gap-2 text-sm">
        {t("lens.setup.sample.percent")}
        <Input
          {...register("selection.sample_percent", { valueAsNumber: true })}
          type="number"
          min="0.01"
          max="100"
          step="any"
        />
        {errors.selection?.sample_percent?.message && (
          <p role="alert" className="text-sm text-destructive">
            {errors.selection.sample_percent.message}
          </p>
        )}
      </label>
    </>
  );
}
