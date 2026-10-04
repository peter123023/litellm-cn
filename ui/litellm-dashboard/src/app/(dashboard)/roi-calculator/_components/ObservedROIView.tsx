"use client";

import { useEffect, useState } from "react";
import { Link2, RefreshCw } from "lucide-react";
import { apiClient } from "@/components/networking";
import { extractProxyErrorMessage } from "@/lib/http/client";
import { Page } from "@/components/shared/Page";
import { PageHeader, PageHeaderDescription, PageHeaderTitle } from "@/components/shared/PageHeader";
import { DemoNotice } from "@/components/shared/DemoNotice";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ObservedConnections from "./ObservedConnections";
import ObservedReport from "./ObservedReport";
import { useObservedReport, type ObservedViewData } from "./useObservedReport";
import { syncMessage, type ObservedSnapshot } from "./observedData";
import { createObservedDemo } from "./observedDemo";
import { useTranslation } from "@/i18n";

function SyncActions({
  data,
  error,
  busy,
  readOnly,
  compact = false,
  onSync,
  onRetry,
}: {
  data: ObservedViewData | null;
  error: string;
  busy: boolean;
  readOnly: boolean;
  compact?: boolean;
  onSync: (cancel: boolean) => void;
  onRetry: () => void;
}) {
  const { t } = useTranslation();
  const message = error || data?.status.error;
  const statusMessage = data ? syncMessage(data.status, data.report) : "";
  const canSync = data?.settings.ready && !readOnly;
  if (!message && !statusMessage && !canSync) return null;
  return (
    <div className={compact ? "contents" : "space-y-2"}>
      {message && (
        <div
          role="alert"
          className="flex basis-full items-center justify-between gap-3 rounded-lg border border-destructive/30 p-3 text-sm text-destructive"
        >
          <span>{message}</span>
          <Button size="sm" variant="outline" onClick={onRetry}>
            {t("common.retry")}
          </Button>
        </div>
      )}
      {data && (
        <div className={compact ? "contents" : "flex flex-wrap items-center justify-between gap-2"}>
          {statusMessage && (
            <span role="status" className="text-xs text-muted-foreground">
              {statusMessage}
            </span>
          )}
          {!readOnly && data.settings.ready && (
            <Button size="sm" variant="outline" disabled={busy} onClick={() => onSync(data.status.running)}>
              <RefreshCw className={data.status.running ? "animate-spin" : ""} />
              {data.status.running ? t("roi.sync.cancel") : t("roi.sync.now")}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

function EmptyReport({
  data,
  readOnly,
  onConnect,
}: {
  data: ObservedViewData;
  readOnly: boolean;
  onConnect: () => void;
}) {
  const { t } = useTranslation();
  function title() {
    if (data.status.running) return t("roi.empty.readingActivity");
    return data.settings.ready ? t("roi.empty.readyForFirstReport") : t("roi.empty.connectRepositories");
  }
  return (
    <div className="flex flex-col items-center gap-4 px-6 py-12 text-center">
      <h2 className="text-lg font-medium">{title()}</h2>
      <p className="max-w-md text-sm text-muted-foreground">
        {data.status.running
          ? t("roi.empty.reportAppearsAfterSync")
          : t("roi.empty.tagline")}
      </p>
      {!readOnly && !data.status.running && (
        <Button onClick={onConnect}>
          <Link2 />
          {data.settings.ready ? t("roi.empty.connections") : t("roi.empty.connectGitHubOrGitLab")}
        </Button>
      )}
    </div>
  );
}

export default function ObservedROIView({
  accessToken,
  isViewOnly = false,
}: {
  accessToken: string;
  isViewOnly?: boolean;
}) {
  const { t } = useTranslation();
  const { data, error, refresh } = useObservedReport(accessToken);
  const [returned] = useState(() => new URLSearchParams(typeof window === "undefined" ? "" : window.location.search));
  const [sample, setSample] = useState<ObservedSnapshot | null>(() =>
    returned.get("demo") === "1" ? createObservedDemo(28) : null,
  );
  const [connections, setConnections] = useState(
    ["github", "gitlab"].includes(returned.get("connected") ?? "") ||
      returned.has("connection_cancelled") ||
      returned.has("connection_failed"),
  );
  const [connectionError, setConnectionError] = useState(() => {
    if (returned.has("connection_failed")) return t("roi.connection.failedOrExpired");
    if (returned.has("connection_cancelled")) return t("roi.connection.cancelled");
    return "";
  });
  const [afterAuthorization, setAfterAuthorization] = useState(Boolean(returned.get("connected")));
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState("");
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.delete("connected");
    url.searchParams.delete("connection_cancelled");
    url.searchParams.delete("connection_failed");
    window.history.replaceState(window.history.state, "", url);
  }, []);
  function previewSample(enabled: boolean) {
    const url = new URL(window.location.href);
    if (enabled) url.searchParams.set("demo", "1");
    else url.searchParams.delete("demo");
    window.history.replaceState(window.history.state, "", url);
    setSample(enabled ? createObservedDemo(28) : null);
  }
  function closeConnections() {
    setConnections(false);
    setConnectionError("");
    setAfterAuthorization(false);
    refresh();
  }
  async function sync(cancel: boolean, days?: number) {
    setBusy(true);
    setActionError("");
    try {
      if (cancel) await apiClient.delete("/roi-calculator/observed/sync", { accessToken });
      else await apiClient.post("/roi-calculator/observed/sync", { accessToken, query: { days } });
      refresh();
    } catch (reason) {
      setActionError(extractProxyErrorMessage(reason));
    } finally {
      setBusy(false);
    }
  }
  function retry() {
    if (error || isViewOnly || !data?.settings.ready) refresh();
    else void sync(data.status.running);
  }
  if (sample) {
    return (
      <ObservedReport
        key="demo"
        snapshot={sample}
        accessToken={accessToken}
        readOnly
        onRefresh={refresh}
        onConnect={() => setConnections(true)}
        actions={null}
        notice={<DemoNotice onExit={() => previewSample(false)} />}
        syncing={false}
        onPeriod={(days) => setSample(createObservedDemo(days))}
      />
    );
  }
  const previewButton = (
    <Button size="sm" variant="ghost" onClick={() => previewSample(true)}>
      {t("roi.previewSampleReport")}
    </Button>
  );
  const actions = (
    <>
      {previewButton}
      <SyncActions
        data={data}
        error={error || actionError}
        busy={busy}
        readOnly={isViewOnly}
        compact={Boolean(data?.report)}
        onSync={sync}
        onRetry={retry}
      />
    </>
  );
  const content = data?.report ? (
    <ObservedReport
      key="live"
      snapshot={data.report}
      accessToken={accessToken}
      readOnly={isViewOnly}
      onRefresh={refresh}
      onConnect={() => setConnections(true)}
      actions={actions}
      syncing={busy || data.status.running}
      onPeriod={isViewOnly ? undefined : (days) => void sync(false, days)}
    />
  ) : (
    <Page>
      <PageHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <PageHeaderTitle>{t("roi.title")}</PageHeaderTitle>
          {previewButton}
        </div>
        <PageHeaderDescription>{t("roi.description")}</PageHeaderDescription>
      </PageHeader>
      <SyncActions
        data={data}
        error={error || actionError}
        busy={busy}
        readOnly={isViewOnly}
        onSync={sync}
        onRetry={retry}
      />
      {!data && !error && (
        <>
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-96 w-full" />
        </>
      )}
      {data && <EmptyReport data={data} readOnly={isViewOnly} onConnect={() => setConnections(true)} />}
    </Page>
  );
  const showConnections = connections && data && !isViewOnly;
  return (
    <>
      {content}
      {showConnections && (
        <ObservedConnections
          accessToken={accessToken}
          settings={data.settings}
          initialError={connectionError}
          afterAuthorization={afterAuthorization}
          onClose={closeConnections}
          onSaved={refresh}
        />
      )}
    </>
  );
}
