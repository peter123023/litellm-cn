import React from "react";
import { Control, UseFormReturn } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CircleHelp } from "lucide-react";
import { useTranslation } from "@/i18n";
import { FormField } from "@/components/shared/form/FormField";
import { toast } from "@/lib/toast";
import AgentSelector from "../agent_management/AgentSelector";
import RateLimitTypeFormItem from "../common_components/RateLimitTypeFormItem";
import NumericalInput from "../shared/numerical_input";
import SkillSelector from "../skills/SkillSelector";
import { moveTagsOutOfMetadataJson, type MovedMetadataTags } from "./keyEditFieldNormalizers";
import { AgentsAndGroups, KeyEditFormValues } from "./keyEditFormValues";

export const labelWithHint = (label: React.ReactNode, hint: string): React.ReactNode => (
  <>
    {label}
    <Tooltip>
      <TooltipTrigger render={<CircleHelp className="size-3.5 shrink-0 cursor-help text-muted-foreground" />} />
      <TooltipContent className="max-w-xs">{hint}</TooltipContent>
    </Tooltip>
  </>
);

const KEY_TYPE_OPTIONS = [
  { value: "default", labelKey: "keyEdit.keyType.fullAccess", hintKey: "keyEdit.keyType.fullAccessHint" },
  { value: "llm_api", labelKey: "keyEdit.keyType.aiApis", hintKey: "keyEdit.keyType.aiApisHint" },
  { value: "management", labelKey: "keyEdit.keyType.management", hintKey: "keyEdit.keyType.managementHint" },
];

export const KeyTypeSelect = ({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
}) => {
  const { t } = useTranslation();
  return (
    <Select
      items={Object.fromEntries(KEY_TYPE_OPTIONS.map((option) => [option.value, t(option.labelKey)]))}
      value={value}
      onValueChange={(next: string | null) => next != null && onChange(next)}
    >
      <SelectTrigger id={id} className="w-full">
        <SelectValue placeholder={t("keyEdit.keyType.placeholder")} />
      </SelectTrigger>
      <SelectContent>
        {KEY_TYPE_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            <div className="py-1">
              <div className="font-medium">{t(option.labelKey)}</div>
              <div className="mt-0.5 text-[11px] text-muted-foreground">{t(option.hintKey)}</div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export const KeyRateLimitFields = ({ control }: { control: Control<KeyEditFormValues> }) => {
  const { t } = useTranslation();
  return (
    <>
      <FormField control={control} name="tpm_limit" label={t("keyEdit.tpmLimit")}>
        {({ ref: _ref, ...field }) => <NumericalInput {...field} value={field.value ?? ""} min={0} />}
      </FormField>

      <FormField control={control} name="tpm_limit_type">
        {({ value, onChange, id }) => (
          <RateLimitTypeFormItem
            id={id}
            type="tpm"
            name="tpm_limit_type"
            showDetailedDescriptions={false}
            value={value as string | null}
            onChange={onChange}
          />
        )}
      </FormField>

      <FormField control={control} name="rpm_limit" label={t("keyEdit.rpmLimit")}>
        {({ ref: _ref, ...field }) => <NumericalInput {...field} value={field.value ?? ""} min={0} />}
      </FormField>

      <FormField control={control} name="rpm_limit_type">
        {({ value, onChange, id }) => (
          <RateLimitTypeFormItem
            id={id}
            type="rpm"
            name="rpm_limit_type"
            showDetailedDescriptions={false}
            value={value as string | null}
            onChange={onChange}
          />
        )}
      </FormField>

      <FormField control={control} name="tpd_limit" label={labelWithHint(t("keyEdit.tpdLimit"), t("keyEdit.tpdHint"))}>
        {({ ref: _ref, ...field }) => <NumericalInput {...field} value={field.value ?? ""} min={0} />}
      </FormField>
    </>
  );
};

export const KeyAgentAndSkillFields = ({
  control,
  accessToken,
}: {
  control: Control<KeyEditFormValues>;
  accessToken: string;
}) => {
  const { t } = useTranslation();
  return (
    <>
      <FormField control={control} name="agents_and_groups" label={t("keyEdit.agentsAccessGroups")}>
        {({ value, onChange }) => (
          <AgentSelector
            onChange={onChange}
            value={value as AgentsAndGroups | undefined}
            accessToken={accessToken}
            placeholder={t("keyEdit.agentsPlaceholder")}
          />
        )}
      </FormField>

      <FormField control={control} name="skills" label={labelWithHint(t("keyEdit.skills"), t("keyEdit.skillsHint"))}>
        {({ value, onChange }) => (
          <SkillSelector onChange={onChange} value={value as string[] | undefined} accessToken={accessToken} />
        )}
      </FormField>
    </>
  );
};

type KeyEditForm = Pick<
  UseFormReturn<KeyEditFormValues, unknown, KeyEditFormValues>,
  "control" | "getValues" | "setValue"
>;

export const moveMetadataTagsToTagsField = (form: KeyEditForm): MovedMetadataTags | null => {
  const moved = moveTagsOutOfMetadataJson(form.getValues("metadata"), form.getValues("tags"));
  if (moved === null) return null;
  form.setValue("metadata", moved.metadata, { shouldDirty: true });
  form.setValue("tags", moved.tags, { shouldDirty: true });
  return moved;
};

export const KeyMetadataField = ({ form }: { form: KeyEditForm }) => {
  const { t } = useTranslation();
  return (
    <FormField
      control={form.control}
      name="metadata"
      label={t("keyEdit.metadata")}
      description={t("keyEdit.metadataDescription")}
    >
      {(field) => (
        <Textarea
          {...field}
          value={(field.value as string | undefined) ?? ""}
          rows={10}
          onBlur={() => {
            field.onBlur();
            const moved = moveMetadataTagsToTagsField(form);
            if (moved !== null && moved.movedTags.length > 0) {
              toast.info(t("keyEdit.movedTagsToast", { tags: moved.movedTags.join(", ") }));
            }
          }}
        />
      )}
    </FormField>
  );
};

export const KeyBudgetNumberField = ({
  control,
  name,
  label,
  placeholder,
}: {
  control: Control<KeyEditFormValues>;
  name: "max_budget" | "soft_budget";
  label: string;
  placeholder: string;
}) => (
  <FormField control={control} name={name} label={label}>
    {({ ref: _ref, ...field }) => (
      <NumericalInput
        {...field}
        value={field.value ?? ""}
        step={0.01}
        style={{ width: "100%" }}
        placeholder={placeholder}
      />
    )}
  </FormField>
);
