"use client";

import { ArrowUpRight, Loader2, SearchX, TriangleAlert } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { StateMessage } from "../ui/StateMessage";

import { ApiError } from "@/lib/http/client";
import { useTranslation, type Translate } from "@/i18n";

const DOCS_URL = "https://docs.litellm.ai/docs/proxy/lens";

function DocsLink() {
  const { t } = useTranslation();
  return (
    <a
      href={DOCS_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={buttonVariants({ variant: "ghost", size: "sm" })}
    >
      {t("lens.investigations.docsLink")}
      <ArrowUpRight aria-hidden="true" className="size-3.5" />
    </a>
  );
}

function loadFailureMessage(queryError: unknown, unavailable: boolean, t: Translate): string {
  if (unavailable) return t("lens.investigations.loadFailureVersionMismatch");
  if (queryError instanceof Error) return queryError.message;
  return t("lens.investigations.loadFailureGeneric");
}

export function InvestigationsLoadFailed({ queryError, refresh }: { queryError: unknown; refresh: () => void }) {
  const { t } = useTranslation();
  const unavailable = queryError instanceof ApiError && queryError.status === 404;
  return (
    <StateMessage
      role="alert"
      tone="destructive"
      icon={<TriangleAlert className="size-5" />}
      title={t(unavailable ? "lens.investigations.apiUnavailable" : "lens.investigations.loadFailed")}
      description={loadFailureMessage(queryError, unavailable, t)}
    >
      <Button size="sm" onClick={() => (unavailable ? window.location.reload() : refresh())}>
        {t(unavailable ? "lens.investigations.reloadPage" : "lens.investigations.tryAgain")}
      </Button>
      <DocsLink />
    </StateMessage>
  );
}

export function InvestigationError({ message, refresh }: { message: string; refresh: () => void }) {
  const { t } = useTranslation();
  return (
    <div
      role="alert"
      className="flex items-center justify-between gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
    >
      <span className="min-w-0">{message}</span>
      <Button variant="ghost" size="sm" onClick={refresh}>
        {t("common.retry")}
      </Button>
    </div>
  );
}

export function InvestigationsLoading() {
  const { t } = useTranslation();
  return (
    <StateMessage
      role="status"
      icon={<Loader2 className="size-5 animate-spin motion-reduce:animate-none" />}
      title={t("lens.investigations.loadingTitle")}
      description={t("lens.investigations.loadingBody")}
    />
  );
}

export function InvestigationMissing({ selectLens }: { selectLens: (id: string | null) => void }) {
  const { t } = useTranslation();
  return (
    <StateMessage
      role="alert"
      icon={<SearchX className="size-5" />}
      title={t("lens.investigations.notFound")}
      description={t("lens.investigations.notFoundBody")}
    >
      <Button size="sm" onClick={() => selectLens(null)}>
        {t("lens.investigations.viewAll")}
      </Button>
    </StateMessage>
  );
}
