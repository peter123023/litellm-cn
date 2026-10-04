"use client";

import PromptsPanel from "./_components";
import { DeprecationBanner } from "@/components/DeprecationBanner";
import useAuthorized from "@/app/(dashboard)/hooks/useAuthorized";
import { useTranslation } from "@/i18n";

export default function Prompts() {
  const { accessToken, userRole } = useAuthorized();
  const { t } = useTranslation();
  return (
    <>
      <DeprecationBanner featureName={t("prompts.featureName")} />
      <PromptsPanel accessToken={accessToken} userRole={userRole} />
    </>
  );
}
