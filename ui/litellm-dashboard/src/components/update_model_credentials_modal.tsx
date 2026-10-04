import { TriangleAlert } from "lucide-react";
import { useMemo, useState } from "react";
import { z } from "zod";
import { modelPatchUpdateCall } from "./networking";
import { toast } from "@/lib/toast";
import { FieldGroup } from "@/components/ui/field";
import { FormField } from "@/components/shared/form/FormField";
import { Alert, AlertTitle } from "@/components/shared/Alert";
import { PasswordInput } from "@/components/shared/PasswordInput";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UiLoadingSpinner } from "@/components/ui/ui-loading-spinner";
import { useTranslation, type Translate } from "@/i18n";
import { useZodForm } from "@/lib/forms/useZodForm";

const buildUpdateCredentialsSchema = (t: Translate) =>
  z.object({
    api_key: z.string().min(1, t("updateApiKey.enterNewKey")),
  });

type UpdateCredentialsValues = z.infer<ReturnType<typeof buildUpdateCredentialsSchema>>;

const EMPTY_VALUES: UpdateCredentialsValues = { api_key: "" };

interface UpdateModelCredentialsModalProps {
  open: boolean;
  onCancel: () => void;
  accessToken: string;
  modelId: string;
  onUpdated: () => void;
}

export default function UpdateModelCredentialsModal({
  open,
  onCancel,
  accessToken,
  modelId,
  onUpdated,
}: UpdateModelCredentialsModalProps) {
  const { t } = useTranslation();
  const updateCredentialsSchema = useMemo(() => buildUpdateCredentialsSchema(t), [t]);
  const form = useZodForm(updateCredentialsSchema, { defaultValues: EMPTY_VALUES });
  const [isSaving, setIsSaving] = useState(false);

  const close = () => {
    form.reset(EMPTY_VALUES);
    onCancel();
  };

  const handleSubmit = async (values: UpdateCredentialsValues) => {
    const apiKey = values.api_key?.trim();
    if (!apiKey) {
      toast.fromError(t("updateApiKey.enterNewKey"));
      return;
    }
    setIsSaving(true);
    try {
      await modelPatchUpdateCall(
        accessToken,
        { litellm_params: { api_key: apiKey }, model_info: { id: modelId } },
        modelId,
      );
      toast.success(t("updateApiKey.updated"));
      form.reset(EMPTY_VALUES);
      onUpdated();
      onCancel();
    } catch (error) {
      console.error("Error updating API key:", error);
      toast.fromError(t("updateApiKey.updateFailed"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && close()}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>{t("updateApiKey.title")}</DialogTitle>
        </DialogHeader>
        <span className="block mb-4 text-sm text-muted-foreground">{t("updateApiKey.description")}</span>
        <Alert variant="warning" className="mb-4">
          <TriangleAlert />
          <AlertTitle>{t("updateApiKey.warning")}</AlertTitle>
        </Alert>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <FieldGroup>
            <FormField control={form.control} name="api_key" label={t("updateApiKey.newKeyLabel")}>
              {({ ref, ...field }) => (
                <PasswordInput
                  {...field}
                  ref={ref}
                  placeholder={t("updateApiKey.newKeyPlaceholder")}
                  autoComplete="new-password"
                />
              )}
            </FormField>
          </FieldGroup>
          <div className="flex justify-end items-center mt-4 gap-2.5">
            <Button type="button" variant="outline" onClick={close}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <UiLoadingSpinner className="size-4" />}
              {t("updateApiKey.title")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
