import type { Translate } from "@/i18n";

export const SENSITIVE_FIELDS = new Set(["vault_token", "approle_secret_id", "client_key"]);

const FIELD_LABEL_KEYS: Record<string, string> = {
  vault_addr: "adminSettings.hashicorpVault.fieldLabels.vaultAddress",
  vault_namespace: "adminSettings.hashicorpVault.fieldLabels.namespace",
  vault_login_namespace: "adminSettings.hashicorpVault.fieldLabels.loginNamespace",
  vault_secret_namespace: "adminSettings.hashicorpVault.fieldLabels.secretNamespace",
  vault_mount_name: "adminSettings.hashicorpVault.fieldLabels.kvMountName",
  vault_path_prefix: "adminSettings.hashicorpVault.fieldLabels.pathPrefix",
  vault_token: "adminSettings.hashicorpVault.fieldLabels.token",
  approle_role_id: "adminSettings.hashicorpVault.fieldLabels.roleId",
  approle_secret_id: "adminSettings.hashicorpVault.fieldLabels.secretId",
  approle_mount_path: "adminSettings.hashicorpVault.fieldLabels.mountPath",
  client_cert: "adminSettings.hashicorpVault.fieldLabels.clientCertificate",
  client_key: "adminSettings.hashicorpVault.fieldLabels.clientKey",
  vault_cert_role: "adminSettings.hashicorpVault.fieldLabels.certificateRole",
};

export function getFieldLabels(t: Translate): Record<string, string> {
  return Object.fromEntries(Object.entries(FIELD_LABEL_KEYS).map(([field, key]) => [field, t(key)]));
}
