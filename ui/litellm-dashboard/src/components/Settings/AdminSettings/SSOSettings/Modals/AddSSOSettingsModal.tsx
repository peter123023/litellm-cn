"use client";

import { toast } from "@/lib/toast";
import { parseErrorMessage } from "@/components/shared/errorUtils";
import React from "react";
import BaseSSOSettingsForm, {
  emptySSOSettingsFormValues,
  submitMountedSSOValues,
  useSSOSettingsForm,
  type SSOSettingsFormValues,
} from "./BaseSSOSettingsForm";
import { useTranslation } from "@/i18n";
import { Button } from "@/components/ui/button";
import { UiLoadingSpinner } from "@/components/ui/ui-loading-spinner";
import { useEditSSOSettings } from "@/app/(dashboard)/hooks/sso/useEditSSOSettings";
import { processSSOSettingsPayload } from "../utils";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface AddSSOSettingsModalProps {
  isVisible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const AddSSOSettingsModal: React.FC<AddSSOSettingsModalProps> = ({ isVisible, onCancel, onSuccess }) => {
  const { t } = useTranslation();
  const form = useSSOSettingsForm("sso-settings");
  const { mutateAsync, isPending } = useEditSSOSettings();

  const handleFormSubmit = async (formValues: SSOSettingsFormValues) => {
    const payload = processSSOSettingsPayload(formValues);

    await mutateAsync(payload, {
      onSuccess: () => {
        toast.success(t("adminSettings.sso.modals.add.success"));
        onSuccess();
      },
      onError: (error) => {
        toast.fromError(t("adminSettings.sso.modals.save.failure", { message: parseErrorMessage(error) }));
      },
    });
  };

  const handleCancel = () => {
    form.reset(emptySSOSettingsFormValues);
    onCancel();
  };

  return (
    <Dialog open={isVisible} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{t("adminSettings.sso.modals.add.title")}</DialogTitle>
        </DialogHeader>
        <BaseSSOSettingsForm form={form} onFormSubmit={handleFormSubmit} />
        <DialogFooter>
          <div className="flex items-center justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isPending}>
              {t("common.cancel")}
            </Button>
            <Button
              type="button"
              disabled={isPending}
              onClick={submitMountedSSOValues(form, "sso-settings", handleFormSubmit)}
            >
              {isPending && <UiLoadingSpinner className="size-4 mr-1" />}
              {isPending ? t("adminSettings.sso.modals.add.adding") : t("adminSettings.sso.modals.add.action")}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddSSOSettingsModal;
