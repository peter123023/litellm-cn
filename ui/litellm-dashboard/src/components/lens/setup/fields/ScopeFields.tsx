"use client";

import { useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import type { InvestigationInput } from "../investigationSchema";
import type { ScopeOptions } from "../useMatchingActivity";
import { useTranslation } from "@/i18n";

import { MetadataFilters } from "./MetadataFilters";

const selectClass = "h-9 w-full rounded-md border border-input bg-background px-3 text-sm";

export function ScopeFields({ names, agentsLoading, agentsError, retryAgents, attributes, keys }: ScopeOptions) {
  const { control, register, setValue } = useFormContext<InvestigationInput>();
  const { t } = useTranslation();
  const selection = useWatch({ control, name: "selection" });
  const filters = selection.filters ?? [];
  const hasOptionalScope = !!selection.team_id || !!selection.service;
  const showAdvancedByDefault = !!selection.filters.length || hasOptionalScope || selection.source !== "traces";
  const [advanced, setAdvanced] = useState(showAdvancedByDefault);
  const nameFieldName = selection.source === "requests" ? "selection.service" : "selection.agent_name";
  const selectedName = selection.source === "requests" ? selection.service : selection.agent_name;
  const nameLabel = selection.source === "requests" ? t("lens.setup.scope.modelGroup") : t("lens.setup.scope.agent");
  return (
    <>
      <label className="grid gap-2 text-sm font-medium">
        {nameLabel}
        <Controller
          control={control}
          name={nameFieldName}
          render={({ field }) => (
            <Combobox
              items={names}
              value={field.value || null}
              inputValue={field.value ?? ""}
              onInputValueChange={field.onChange}
              onValueChange={(name) => field.onChange(name ?? "")}
            >
              <ComboboxInput
                aria-label={nameLabel}
                placeholder={
                  selection.source === "requests"
                    ? t("lens.setup.scope.allModelGroups")
                    : t("lens.setup.scope.allAgents")
                }
                showClear={!!selectedName}
                className="w-full h-9"
              />
              <ComboboxContent>
                <ComboboxEmpty>
                  {agentsLoading ? t("lens.setup.scope.loadingAgents") : t("lens.setup.scope.noAgentMatches")}
                </ComboboxEmpty>
                <ComboboxList>
                  {(name: string) => (
                    <ComboboxItem key={name} value={name}>
                      {name}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          )}
        />
      </label>
      {selection.source !== "requests" && agentsError && (
        <p role="alert" className="text-sm text-destructive">
          {t("lens.setup.scope.loadAgentsFailed")}{" "}
          <button type="button" className="underline" onClick={retryAgents}>
            {t("common.retry")}
          </button>
        </p>
      )}
      <details open={advanced} onToggle={(event) => setAdvanced(event.currentTarget.open)} className="group">
        <summary className="cursor-pointer text-sm font-medium">
          {filters.length
            ? t("lens.setup.scope.advancedFiltersCount", { count: filters.length })
            : t("lens.setup.scope.advancedFilters")}
        </summary>
        <div className="mt-4 space-y-4">
          {selection.source !== "requests" && (
            <label className="grid gap-2 text-sm">
              {t("lens.setup.scope.application")}
              <Input {...register("selection.service")} placeholder={t("lens.setup.scope.allApplications")} />
            </label>
          )}
          <label className="grid gap-2 text-sm">
            {t("lens.setup.scope.activityType")}
            <select
              {...register("selection.source", {
                onChange: () => {
                  setValue("selection.service", "");
                  setValue("selection.agent_name", "");
                  setValue("selection.filters", []);
                },
              })}
              className={selectClass}
            >
              <option value="traces">{t("lens.setup.scope.sourceTraces")}</option>
              <option value="requests">{t("lens.setup.scope.sourceRequests")}</option>
              <option value="both">{t("lens.setup.scope.sourceBoth")}</option>
            </select>
          </label>
          <p className="text-xs leading-5 text-muted-foreground">{t("lens.setup.scope.metadataHint")}</p>
          <MetadataFilters attributes={attributes} keys={keys} />
          <label className="grid gap-2 text-sm">
            {t("lens.setup.scope.teamId")}
            <Input {...register("selection.team_id")} placeholder={t("lens.setup.scope.allTeams")} />
          </label>
        </div>
      </details>
    </>
  );
}
