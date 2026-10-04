"use client";

import { createContext, useContext } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n";

export interface LensPreview {
  /** Header slot for portaled actions; null until it mounts. */
  readonly target: HTMLElement | null;
  readonly open?: () => void;
}

export const LensPreviewContext = createContext<LensPreview | undefined>(undefined);

export function LensPreviewButton() {
  const { t } = useTranslation();
  const preview = useContext(LensPreviewContext);
  if (!preview?.open || !preview.target) return null;
  return createPortal(
    <Button variant="outline" onClick={preview.open}>
      {t("lens.common.previewSample")}
    </Button>,
    preview.target,
  );
}
