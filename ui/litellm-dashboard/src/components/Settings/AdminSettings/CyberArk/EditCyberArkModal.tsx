"use client";

import { useCyberArkConfig } from "@/app/(dashboard)/hooks/configOverrides/useCyberArkConfig";
import { useUpdateCyberArkConfig } from "@/app/(dashboard)/hooks/configOverrides/useUpdateCyberArkConfig";
import useAuthorized from "@/app/(dashboard)/hooks/useAuthorized";
import { toast } from "@/lib/toast";
import React, { useMemo } from "react";
import { z } from "zod";
import { useTranslation, type Translate } from "@/i18n";
import { FieldGroup } from "@/components/ui/field";
import { FormField } from "@/components/shared/form/FormField";
import { PasswordInput } from "@/components/shared/PasswordInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UiLoadingSpinner } from "@/components/ui/ui-loading-spinner";
import { Separator } from "@/components/ui/separator";
import { useZodForm } from "@/lib/forms/useZodForm";
import { getFieldLabels, SENSITIVE_FIELDS } from "./constants";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface CyberArkFieldGroup {
  titleKey: string;
  subtitleKey?: string;
  fields: string[];
}

const FIELD_GROUPS: CyberArkFieldGroup[] = [
  {
    titleKey: "adminSettings.secretManager.groups.connection",
    fields: ["cyberark_api_base", "cyberark_account", "cyberark_username"],
  },
  {
    titleKey: "adminSettings.cyberArk.groups.apiKeyAuth",
    subtitleKey: "adminSettings.cyberArk.groups.apiKeyAuthSubtitle",
    fields: ["cyberark_api_key"],
  },
  {
    titleKey: "adminSettings.cyberArk.groups.certAuth",
    subtitleKey: "adminSettings.cyberArk.groups.certAuthSubtitle",
    fields: ["client_cert", "client_key"],
  },
  {
    titleKey: "adminSettings.cyberArk.groups.advanced",
    subtitleKey: "adminSettings.cyberArk.groups.advancedSubtitle",
    fields: ["ssl_verify", "refresh_interval"],
  },
];

type CyberArkFormValues = Record<string, string>;

const buildSchema = (fields: readonly string[], t: Translate): z.ZodType<CyberArkFormValues, CyberArkFormValues> =>
  z.object(
    Object.fromEntries(
      fields.map((name) => [
        name,
        name === "cyberark_api_base"
          ? z.string().refine((value) => value.length === 0 || /^https?:\/\/.+/.test(value), {
              message: t("adminSettings.secretManager.validation.urlScheme"),
            })
          : z.string(),
      ]),
    ),
  ) as unknown as z.ZodType<CyberArkFormValues, CyberArkFormValues>;

interface EditCyberArkModalProps {
  isVisible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const EditCyberArkModal: React.FC<EditCyberArkModalProps> = ({ isVisible, onCancel, onSuccess }) => {
  const { t } = useTranslation();
  const { accessToken } = useAuthorized();
  const { data } = useCyberArkConfig();
  const { mutate, isPending } = useUpdateCyberArkConfig(accessToken);

  const properties: Record<string, { description?: string }> = useMemo(
    () => data?.field_schema?.properties ?? {},
    [data],
  );
  const rawValues: Record<string, unknown> = useMemo(() => data?.values ?? {}, [data]);

  const visibleFields = useMemo(
    () => FIELD_GROUPS.flatMap((group) => group.fields).filter((name) => properties[name] !== undefined),
    [properties],
  );

  const seededValues = useMemo(
    () =>
      Object.fromEntries(
        visibleFields.map((name) => [name, SENSITIVE_FIELDS.has(name) ? "" : ((rawValues[name] ?? "") as string)]),
      ),
    [visibleFields, rawValues],
  );

  const schema = useMemo(() => buildSchema(visibleFields, t), [visibleFields, t]);
  const form = useZodForm(schema, { values: seededValues });

  const handleSubmit = (formValues: CyberArkFormValues) => {
    const config: Record<string, string> = Object.fromEntries(
      Object.entries(formValues).flatMap(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") return [[key, value]];
        if (!SENSITIVE_FIELDS.has(key)) return [[key, ""]];
        return [];
      }),
    );

    mutate(config, {
      onSuccess: () => {
        toast.success(t("adminSettings.cyberArk.update.success"));
        onSuccess();
      },
      onError: (err) => {
        toast.fromError(err);
      },
    });
  };

  const handleCancel = () => {
    form.reset(seededValues);
    onCancel();
  };

  const fieldLabels = getFieldLabels(t);

  const renderField = (fieldName: string) => {
    const fieldSchema = properties[fieldName];
    if (!fieldSchema) return null;

    const isSensitive = SENSITIVE_FIELDS.has(fieldName);
    const existingValue = rawValues[fieldName];
    const hasExistingValue = isSensitive && existingValue != null && existingValue !== "";
    const placeholder = hasExistingValue
      ? t("adminSettings.secretManager.placeholder.keepExisting", { value: String(existingValue) })
      : fieldSchema?.description;

    return (
      <FormField key={fieldName} control={form.control} name={fieldName} label={fieldLabels[fieldName] ?? fieldName}>
        {({ ref, ...field }) =>
          isSensitive ? (
            <PasswordInput ref={ref} placeholder={placeholder} {...field} />
          ) : (
            <Input ref={ref} placeholder={fieldSchema?.description} {...field} />
          )
        }
      </FormField>
    );
  };

  return (
    <Dialog open={isVisible} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{t("adminSettings.cyberArk.editModal.title")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          {FIELD_GROUPS.map((group, index) => (
            <div key={group.titleKey}>
              {index > 0 && <Separator className="my-6" />}
              <h5 className="mb-1 text-base font-semibold text-foreground">{t(group.titleKey)}</h5>
              {group.subtitleKey && <p className="mb-4 text-sm text-muted-foreground">{t(group.subtitleKey)}</p>}
              <FieldGroup>{group.fields.map(renderField)}</FieldGroup>
            </div>
          ))}
        </form>
        <DialogFooter>
          <div className="flex items-center justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isPending}>
              {t("common.cancel")}
            </Button>
            <Button type="button" disabled={isPending} onClick={() => void form.handleSubmit(handleSubmit)()}>
              {isPending && <UiLoadingSpinner className="size-4 mr-1" />}
              {isPending ? t("adminSettings.secretManager.saving") : t("common.save")}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditCyberArkModal;
