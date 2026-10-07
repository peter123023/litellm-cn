"use client";

import { useMemo, useState } from "react";

import { useInfiniteSpendLogEndUsers } from "@/app/(dashboard)/hooks/spendLogs/useSpendLogEndUsers";
import { useInfiniteSpendLogUsers } from "@/app/(dashboard)/hooks/spendLogs/useSpendLogUsers";
import { useInfiniteKeyAliases } from "@/app/(dashboard)/hooks/keys/useKeyAliases";
import { useInfiniteModelInfo } from "@/app/(dashboard)/hooks/models/useModels";
import { DataTableFilterField } from "@/components/shared/DataTable";
import { PaginatedSearchSelect } from "@/components/shared/PaginatedSearchSelect";
import { SearchSelect, type SearchSelectOption } from "@/components/shared/SearchSelect";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation, type Translate } from "@/i18n";

import type { Team } from "../key_team_helpers/key_list";
import { CREDENTIAL_LABEL_KEYS, ERROR_CODE_LABEL_KEYS, SPAN_TYPE_LABEL_KEYS } from "./constants";
import { LOG_FILTER_IDS, type LogsWindow } from "./log_filter_logic";

const ALL_VALUE = "all";

interface FilterItemKey {
  value: string;
  labelKey: string;
}

/** Options are rendered with `t` at call time, so only the keys live at module scope. */
const optionsFromKeys = (t: Translate, items: readonly FilterItemKey[]): SearchSelectOption[] =>
  items.map(({ value, labelKey }) => ({ value, label: t(labelKey) }));

const STATUS_FILTER_ITEM_KEYS: readonly FilterItemKey[] = [
  { value: ALL_VALUE, labelKey: "logs.request.allStatuses" },
  { value: "success", labelKey: "logs.request.statusSuccess" },
  { value: "failure", labelKey: "logs.request.statusFailure" },
];

const CACHE_FILTER_ITEM_KEYS: readonly FilterItemKey[] = [
  { value: ALL_VALUE, labelKey: "logs.request.allRequests" },
  { value: "hit", labelKey: "logs.request.cacheHit" },
  { value: "miss", labelKey: "logs.request.cacheMiss" },
];

const CREDENTIAL_FILTER_ITEM_KEYS: readonly FilterItemKey[] = [
  { value: ALL_VALUE, labelKey: "logs.request.allCredentials" },
  ...Object.entries(CREDENTIAL_LABEL_KEYS).map(([value, labelKey]) => ({ value, labelKey })),
];

const SPAN_TYPE_FILTER_ITEM_KEYS: readonly FilterItemKey[] = [
  { value: ALL_VALUE, labelKey: "logs.request.allTypes" },
  ...Object.entries(SPAN_TYPE_LABEL_KEYS).map(([value, labelKey]) => ({ value, labelKey })),
];

const ERROR_CODE_ITEM_KEYS: readonly FilterItemKey[] = Object.entries(ERROR_CODE_LABEL_KEYS).map(
  ([value, labelKey]) => ({ value, labelKey }),
);
const PAGE_SIZE = 50;

const SEARCH_INPUT_REASONS: ReadonlySet<string> = new Set(["input-change", "input-clear", "clear-press"]);

const asString = (value: unknown): string => (typeof value === "string" ? value : "");
const emptyToUndefined = (value: string): string | undefined => (value === "" ? undefined : value);

function TeamFilterField({
  value,
  onChange,
  teams,
}: {
  value: string;
  onChange: (value: string | undefined) => void;
  teams: Team[];
}) {
  const { t } = useTranslation();
  const options = useMemo<SearchSelectOption[]>(
    () =>
      teams.map((team) => ({
        label: team.team_alias || team.team_id,
        value: team.team_id,
        sublabel: team.team_id,
      })),
    [teams],
  );

  return (
    <DataTableFilterField label={t("logs.filter.teamId")}>
      <SearchSelect
        options={options}
        value={value}
        onValueChange={(next) => onChange(next ?? undefined)}
        placeholder={t("logs.request.teamPlaceholder")}
        emptyText={t("logs.request.noTeams")}
      />
    </DataTableFilterField>
  );
}

function KeyAliasFilterField({
  value,
  onChange,
  teamId,
}: {
  value: string;
  onChange: (value: string | undefined) => void;
  teamId: string;
}) {
  const [search, setSearch] = useState("");
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteKeyAliases(
    PAGE_SIZE,
    emptyToUndefined(search),
    emptyToUndefined(teamId),
  );
  const { t } = useTranslation();

  const options = useMemo<SearchSelectOption[]>(() => {
    const seen = new Set<string>();
    return (data?.pages ?? []).flatMap((page) =>
      page.aliases.flatMap((alias) => {
        if (!alias || seen.has(alias)) return [];
        seen.add(alias);
        return [{ label: alias, value: alias }];
      }),
    );
  }, [data]);

  return (
    <DataTableFilterField label={t("logs.filter.keyAlias")}>
      <PaginatedSearchSelect
        options={options}
        value={value}
        onValueChange={(next) => onChange(next ?? undefined)}
        onSearchChange={setSearch}
        onLoadMore={() => void fetchNextPage()}
        hasNextPage={hasNextPage}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        placeholder={t("logs.request.keyAliasPlaceholder")}
        emptyText={t("logs.request.noKeyAliases")}
      />
    </DataTableFilterField>
  );
}

function ModelFilterField({ value, onChange }: { value: string; onChange: (value: string | undefined) => void }) {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteModelInfo(
    PAGE_SIZE,
    emptyToUndefined(search),
  );

  const options = useMemo<SearchSelectOption[]>(() => {
    const seen = new Set<string>();
    return (data?.pages ?? []).flatMap((page) =>
      page.data.flatMap((model) => {
        const modelId = model.model_info?.id ?? "";
        const modelName = model.model_name ?? "";
        if (!modelId || seen.has(modelId)) return [];
        seen.add(modelId);
        return [
          {
            label: modelName || modelId,
            value: modelId,
            sublabel: t("logs.request.modelIdSublabel", { id: modelId }),
          },
        ];
      }),
    );
  }, [data, t]);

  return (
    <DataTableFilterField label={t("logs.filter.model")}>
      <PaginatedSearchSelect
        options={options}
        value={value}
        onValueChange={(next) => onChange(next ?? undefined)}
        onSearchChange={setSearch}
        onLoadMore={() => void fetchNextPage()}
        hasNextPage={hasNextPage}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        placeholder={t("logs.request.modelPlaceholder")}
        emptyText={t("logs.request.noModels")}
      />
    </DataTableFilterField>
  );
}

function UserIdFilterField({
  value,
  onChange,
  logsWindow,
}: {
  value: string;
  onChange: (value: string | undefined) => void;
  logsWindow: LogsWindow;
}) {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteSpendLogUsers(
    logsWindow,
    PAGE_SIZE,
    emptyToUndefined(search),
  );

  const options = useMemo<SearchSelectOption[]>(() => {
    const seen = new Set<string>();
    return (data?.pages ?? []).flatMap((page) =>
      page.data.flatMap((userId) => {
        if (!userId || seen.has(userId)) return [];
        seen.add(userId);
        return [{ label: userId, value: userId }];
      }),
    );
  }, [data]);

  return (
    <DataTableFilterField label={t("logs.filter.userId")}>
      <PaginatedSearchSelect
        options={options}
        value={value}
        onValueChange={(next) => onChange(next ?? undefined)}
        onSearchChange={setSearch}
        onLoadMore={() => void fetchNextPage()}
        hasNextPage={hasNextPage}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        placeholder={t("logs.request.internalUserPlaceholder")}
        emptyText={t("logs.request.noUsers")}
      />
    </DataTableFilterField>
  );
}

function EndUserFilterField({
  value,
  onChange,
  logsWindow,
}: {
  value: string;
  onChange: (value: string | undefined) => void;
  logsWindow: LogsWindow;
}) {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteSpendLogEndUsers(
    logsWindow,
    PAGE_SIZE,
    emptyToUndefined(search),
  );

  const options = useMemo<SearchSelectOption[]>(() => {
    const seen = new Set<string>();
    return (data?.pages ?? []).flatMap((page) =>
      page.data.flatMap((endUser) => {
        if (!endUser || seen.has(endUser)) return [];
        seen.add(endUser);
        return [{ label: endUser, value: endUser }];
      }),
    );
  }, [data]);

  return (
    <DataTableFilterField label={t("logs.filter.endUser")}>
      <PaginatedSearchSelect
        options={options}
        value={value}
        onValueChange={(next) => onChange(next ?? undefined)}
        onSearchChange={setSearch}
        onLoadMore={() => void fetchNextPage()}
        hasNextPage={hasNextPage}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        placeholder={t("logs.request.endUserPlaceholder")}
        emptyText={t("logs.request.noEndUsers")}
      />
    </DataTableFilterField>
  );
}

function ErrorCodeFilterField({ value, onChange }: { value: string; onChange: (value: string | undefined) => void }) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");

  const errorCodeOptions = useMemo(() => optionsFromKeys(t, ERROR_CODE_ITEM_KEYS), [t]);

  const options = useMemo<SearchSelectOption[]>(() => {
    const trimmed = query.trim();
    const lowered = trimmed.toLowerCase();
    const matches = errorCodeOptions.filter((option) => option.label.toLowerCase().includes(lowered));
    const isKnownCode = errorCodeOptions.some(
      (option) => option.value === trimmed || option.label.toLowerCase() === lowered,
    );
    if (trimmed === "" || isKnownCode) return matches;
    return [...matches, { label: t("logs.request.customErrorCode", { code: trimmed }), value: trimmed }];
  }, [query, errorCodeOptions, t]);

  const selected = useMemo<SearchSelectOption | null>(() => {
    if (value === "") return null;
    return errorCodeOptions.find((option) => option.value === value) ?? { label: value, value };
  }, [value, errorCodeOptions]);

  const items = useMemo<SearchSelectOption[]>(() => {
    if (selected === null) return options;
    if (options.some((option) => option.value === selected.value)) return options;
    return [selected, ...options];
  }, [options, selected]);

  return (
    <DataTableFilterField label={t("logs.filter.errorCode")}>
      <Combobox
        items={items}
        value={selected}
        onValueChange={(item: SearchSelectOption | null) => onChange(emptyToUndefined(item?.value ?? ""))}
        onInputValueChange={(next, eventDetails) => setQuery(SEARCH_INPUT_REASONS.has(eventDetails.reason) ? next : "")}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) setQuery("");
        }}
        isItemEqualToValue={(a: SearchSelectOption, b: SearchSelectOption) => a.value === b.value}
        itemToStringLabel={(item: SearchSelectOption) => item.label}
        filter={null}
      >
        <ComboboxInput
          onFocus={(event) => event.currentTarget.select()}
          placeholder={t("logs.request.errorCodePlaceholder")}
          showClear={value !== ""}
          className="w-full"
        />
        <ComboboxContent>
          <ComboboxEmpty>{t("logs.request.noErrorCodes")}</ComboboxEmpty>
          <ComboboxList data-testid="error-code-filter-list">
            {(item: SearchSelectOption) => (
              <ComboboxItem key={item.value} value={item}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </DataTableFilterField>
  );
}

interface RequestLogsFiltersProps {
  get: (columnId: string) => unknown;
  set: (columnId: string, value: unknown) => void;
  teams: Team[];
  logsWindow: LogsWindow;
}

export function RequestLogsFilters({ get, set, teams, logsWindow }: RequestLogsFiltersProps) {
  const { t } = useTranslation();
  const valueOf = (id: string): string => asString(get(id));
  const setter = (id: string) => (next: string | undefined) => set(id, next);

  const spanTypeOptions = useMemo(() => optionsFromKeys(t, SPAN_TYPE_FILTER_ITEM_KEYS), [t]);
  const statusOptions = useMemo(() => optionsFromKeys(t, STATUS_FILTER_ITEM_KEYS), [t]);
  const cacheOptions = useMemo(() => optionsFromKeys(t, CACHE_FILTER_ITEM_KEYS), [t]);
  const credentialOptions = useMemo(() => optionsFromKeys(t, CREDENTIAL_FILTER_ITEM_KEYS), [t]);

  return (
    <>
      <TeamFilterField
        value={valueOf(LOG_FILTER_IDS.TEAM_ID)}
        onChange={setter(LOG_FILTER_IDS.TEAM_ID)}
        teams={teams}
      />

      <DataTableFilterField label={t("logs.filter.spanType")}>
        <Select
          items={spanTypeOptions}
          value={valueOf(LOG_FILTER_IDS.SPAN_TYPE) === "" ? ALL_VALUE : valueOf(LOG_FILTER_IDS.SPAN_TYPE)}
          onValueChange={(next) =>
            set(LOG_FILTER_IDS.SPAN_TYPE, next === null || next === ALL_VALUE ? undefined : next)
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t("logs.request.allTypes")} />
          </SelectTrigger>
          <SelectContent>
            {spanTypeOptions.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </DataTableFilterField>

      <DataTableFilterField label={t("logs.filter.status")}>
        <Select
          items={statusOptions}
          value={valueOf(LOG_FILTER_IDS.STATUS) === "" ? ALL_VALUE : valueOf(LOG_FILTER_IDS.STATUS)}
          onValueChange={(next) => set(LOG_FILTER_IDS.STATUS, next === null || next === ALL_VALUE ? undefined : next)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t("logs.request.allStatuses")} />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </DataTableFilterField>

      <DataTableFilterField label={t("logs.filter.cache")}>
        <Select
          items={cacheOptions}
          value={valueOf(LOG_FILTER_IDS.CACHE_STATUS) === "" ? ALL_VALUE : valueOf(LOG_FILTER_IDS.CACHE_STATUS)}
          onValueChange={(next) =>
            set(LOG_FILTER_IDS.CACHE_STATUS, next === null || next === ALL_VALUE ? undefined : next)
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t("logs.request.allRequests")} />
          </SelectTrigger>
          <SelectContent>
            {cacheOptions.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </DataTableFilterField>

      <DataTableFilterField label={t("logs.filter.credential")}>
        <Select
          items={credentialOptions}
          value={valueOf(LOG_FILTER_IDS.CREDENTIAL) === "" ? ALL_VALUE : valueOf(LOG_FILTER_IDS.CREDENTIAL)}
          onValueChange={(next) =>
            set(LOG_FILTER_IDS.CREDENTIAL, next === null || next === ALL_VALUE ? undefined : next)
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t("logs.request.allCredentials")} />
          </SelectTrigger>
          <SelectContent>
            {credentialOptions.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </DataTableFilterField>

      <KeyAliasFilterField
        value={valueOf(LOG_FILTER_IDS.KEY_ALIAS)}
        onChange={setter(LOG_FILTER_IDS.KEY_ALIAS)}
        teamId={valueOf(LOG_FILTER_IDS.TEAM_ID)}
      />

      <UserIdFilterField
        value={valueOf(LOG_FILTER_IDS.USER_ID)}
        onChange={setter(LOG_FILTER_IDS.USER_ID)}
        logsWindow={logsWindow}
      />

      <EndUserFilterField
        value={valueOf(LOG_FILTER_IDS.END_USER)}
        onChange={setter(LOG_FILTER_IDS.END_USER)}
        logsWindow={logsWindow}
      />

      <ErrorCodeFilterField value={valueOf(LOG_FILTER_IDS.ERROR_CODE)} onChange={setter(LOG_FILTER_IDS.ERROR_CODE)} />

      <DataTableFilterField label={t("logs.filter.errorMessage")}>
        <Input
          value={valueOf(LOG_FILTER_IDS.ERROR_MESSAGE)}
          onChange={(event) => set(LOG_FILTER_IDS.ERROR_MESSAGE, emptyToUndefined(event.target.value))}
          placeholder={t("logs.request.errorMessagePlaceholder")}
        />
      </DataTableFilterField>

      <DataTableFilterField label={t("logs.filter.keyHash")}>
        <Input
          value={valueOf(LOG_FILTER_IDS.KEY_HASH)}
          onChange={(event) => set(LOG_FILTER_IDS.KEY_HASH, emptyToUndefined(event.target.value))}
          placeholder={t("logs.request.keyHashPlaceholder")}
        />
      </DataTableFilterField>

      <DataTableFilterField label={t("logs.filter.sessionId")}>
        <Input
          value={valueOf(LOG_FILTER_IDS.SESSION_ID)}
          onChange={(event) => set(LOG_FILTER_IDS.SESSION_ID, emptyToUndefined(event.target.value))}
          placeholder={t("logs.request.sessionIdPlaceholder")}
        />
      </DataTableFilterField>

      <ModelFilterField value={valueOf(LOG_FILTER_IDS.MODEL_ID)} onChange={setter(LOG_FILTER_IDS.MODEL_ID)} />

      <DataTableFilterField label={t("logs.filter.publicModelOrSearchTool")}>
        <Input
          value={valueOf(LOG_FILTER_IDS.PUBLIC_MODEL_OR_SEARCH_TOOL)}
          onChange={(event) => set(LOG_FILTER_IDS.PUBLIC_MODEL_OR_SEARCH_TOOL, emptyToUndefined(event.target.value))}
          placeholder={t("logs.request.publicModelPlaceholder")}
        />
      </DataTableFilterField>
    </>
  );
}
