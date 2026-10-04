"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { WatchPicker } from "../WatchPicker";

import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { useTranslation } from "@/i18n";
import type { InvestigationInput } from "../investigationSchema";

export function ExpectationsFields() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<InvestigationInput>();
  const { t } = useTranslation();
  const { fields, append, remove } = useFieldArray({ control, name: "questions", keyName: "fieldId" });
  return (
    <div className="space-y-5">
      <label className="grid gap-2 text-sm font-medium">
        {t("lens.setup.expectations.behaviorQuestion")}
        <Textarea {...register("context")} rows={4} placeholder={t("lens.setup.expectations.behaviorPlaceholder")} />
      </label>
      {errors.context?.message && (
        <p role="alert" className="text-sm text-destructive">
          {errors.context.message}
        </p>
      )}
      <Controller
        control={control}
        name="watching"
        render={({ field }) => (
          <WatchPicker
            selected={new Set(field.value)}
            onChange={(values) => field.onChange([...values])}
            onAddCustom={() => append({ id: crypto.randomUUID(), instruction: "", enabled: true })}
          />
        )}
      />
      <fieldset className="space-y-2">
        <legend className="sr-only">{t("lens.setup.expectations.customChecks")}</legend>
        {fields.map((check, index) => (
          <div key={check.fieldId} className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <Textarea
                aria-label={t("lens.setup.expectations.checkLabel", { index: index + 1 })}
                {...register(`questions.${index}.instruction`)}
                rows={2}
                placeholder={t("lens.setup.expectations.checkPlaceholder")}
              />
              {errors.questions?.[index]?.instruction?.message && (
                <p role="alert" className="mt-1 text-sm text-destructive">
                  {errors.questions[index].instruction.message}
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              aria-label={t("lens.setup.expectations.removeCheck", { index: index + 1 })}
              onClick={() => remove(index)}
            >
              <X className="size-4" />
            </Button>
          </div>
        ))}
      </fieldset>
    </div>
  );
}
