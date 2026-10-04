import { useEditSSOSettings } from "@/app/(dashboard)/hooks/sso/useEditSSOSettings";
import { useSSOSettings } from "@/app/(dashboard)/hooks/sso/useSSOSettings";
import React from "react";
import DeleteResourceModal from "../../../../common_components/DeleteResourceModal";
import { toast } from "@/lib/toast";
import { useTranslation } from "@/i18n";
import { parseErrorMessage } from "../../../../shared/errorUtils";
import { detectSSOProvider } from "../utils";

interface DeleteSSOSettingsModalProps {
  isVisible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const DeleteSSOSettingsModal: React.FC<DeleteSSOSettingsModalProps> = ({ isVisible, onCancel, onSuccess }) => {
  const { t } = useTranslation();
  const { data: ssoSettings } = useSSOSettings();
  const { mutateAsync: editSSOSettings, isPending: isEditingSSOSettings } = useEditSSOSettings();

  // Handle clearing SSO settings
  const handleClearSSO = async () => {
    const clearSettings = {
      google_client_id: null,
      google_client_secret: null,
      microsoft_client_id: null,
      microsoft_client_secret: null,
      microsoft_tenant: null,
      generic_client_id: null,
      generic_client_secret: null,
      generic_authorization_endpoint: null,
      generic_token_endpoint: null,
      generic_userinfo_endpoint: null,
      saml_idp_metadata_url: null,
      saml_idp_metadata_xml: null,
      saml_sp_entity_id: null,
      saml_allow_unsolicited: null,
      proxy_base_url: null,
      user_email: null,
      sso_provider: null,
      role_mappings: null,
      team_mappings: null,
    };

    await editSSOSettings(clearSettings, {
      onSuccess: () => {
        toast.success(t("adminSettings.sso.deleteModal.clearSuccess"));
        onCancel();
        onSuccess();
      },
      onError: (error) => {
        toast.fromError(t("adminSettings.sso.deleteModal.clearFailure", { message: parseErrorMessage(error) }));
      },
    });
  };

  return (
    <DeleteResourceModal
      isOpen={isVisible}
      title={t("adminSettings.sso.deleteModal.title")}
      alertMessage={t("adminSettings.sso.deleteModal.alertMessage")}
      message={t("adminSettings.sso.deleteModal.message")}
      resourceInformationTitle={t("adminSettings.sso.deleteModal.resourceTitle")}
      resourceInformation={[
        {
          label: t("adminSettings.sso.fieldLabels.provider"),
          value:
            (ssoSettings?.values && detectSSOProvider(ssoSettings?.values)) || t("adminSettings.sso.providers.generic"),
        },
      ]}
      onCancel={onCancel}
      onOk={handleClearSSO}
      confirmLoading={isEditingSSOSettings}
    />
  );
};

export default DeleteSSOSettingsModal;
