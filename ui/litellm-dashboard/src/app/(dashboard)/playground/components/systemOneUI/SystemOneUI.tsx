"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation } from "@tanstack/react-query";
import { Code, Info, LoaderCircle, RotateCcw, Send } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { makeSystemOneRequest } from "../../llm_calls/system_one";
import { SYSTEM_ONE_EXAMPLE } from "./lib/example";
import type { SystemOneRequest } from "./lib/schemas";
import JsonEditor from "./JsonEditor";
import QuestionBreakdown from "./QuestionBreakdown";
import ResponseView from "./ResponseView";
import { validateSystemOnePayload } from "./lib/validatePayload";
import { useTranslation } from "@/i18n";

interface SystemOneUIProps {
  accessToken: string | null;
  disabledPersonalKeyCreation?: boolean;
}

type ApiKeySource = "session" | "custom";

interface SystemOneSendVariables {
  payload: SystemOneRequest;
  apiKey: string;
  signal: AbortSignal;
}

const EXAMPLE_PAYLOAD = JSON.stringify(SYSTEM_ONE_EXAMPLE, null, 2);
const DECISION_MODELS_DISCUSSION_URL = "https://github.com/BerriAI/litellm/discussions/44231";

function getCustomProxyBaseUrl(): string | undefined {
  return typeof window === "undefined" ? undefined : window.sessionStorage.getItem("customProxyBaseUrl") || undefined;
}

export default function SystemOneUI({ accessToken, disabledPersonalKeyCreation = false }: SystemOneUIProps) {
  const { t } = useTranslation();
  const [apiKeySource, setApiKeySource] = useState<ApiKeySource>(disabledPersonalKeyCreation ? "custom" : "session");
  const [customApiKey, setCustomApiKey] = useState("");
  const [rawPayload, setRawPayload] = useState(EXAMPLE_PAYLOAD);
  const activeController = useRef<AbortController | null>(null);
  const validation = useMemo(() => validateSystemOnePayload(rawPayload, t), [rawPayload, t]);
  const effectiveApiKey = apiKeySource === "session" ? accessToken || "" : customApiKey.trim();
  const hasSyntaxError = validation.issues.some((issue) => issue.path === "syntax");

  const systemOne = useMutation({
    mutationFn: ({ payload, apiKey, signal }: SystemOneSendVariables) =>
      makeSystemOneRequest(payload, apiKey, getCustomProxyBaseUrl(), signal),
  });
  const isLoading = systemOne.isPending;
  const { reset: resetSystemOne } = systemOne;

  useEffect(() => () => activeController.current?.abort(), []);

  useEffect(() => {
    activeController.current?.abort();
    activeController.current = null;
    resetSystemOne();
  }, [effectiveApiKey, resetSystemOne]);

  function clearRequestState() {
    activeController.current?.abort();
    activeController.current = null;
    systemOne.reset();
  }

  function handlePayloadChange(value: string) {
    if (value !== rawPayload) {
      clearRequestState();
      setRawPayload(value);
    }
  }

  function handleFormatJson() {
    if (rawPayload.trim() && !hasSyntaxError) {
      handlePayloadChange(JSON.stringify(JSON.parse(rawPayload), null, 2));
    }
  }

  function handleSend() {
    if (!validation.payload || !effectiveApiKey) {
      return;
    }
    clearRequestState();
    const controller = new AbortController();
    activeController.current = controller;
    systemOne.mutate({ payload: validation.payload, apiKey: effectiveApiKey, signal: controller.signal });
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 overflow-auto p-4 xl:overflow-hidden">
      <section className="grid gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              {t("playground.systemOne.virtualKeySource")}
            </span>
            <Select
              value={apiKeySource}
              onValueChange={(value) => {
                if (value === "session" || value === "custom") {
                  setApiKeySource(value);
                }
              }}
              disabled={disabledPersonalKeyCreation}
            >
              <SelectTrigger className="w-48" aria-label={t("playground.systemOne.virtualKeySource")}>
                <SelectValue>
                  {apiKeySource === "custom"
                    ? t("playground.systemOne.virtualKey")
                    : t("playground.systemOne.currentUiSession")}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="session" disabled={!accessToken}>
                  {t("playground.systemOne.currentUiSession")}
                </SelectItem>
                <SelectItem value="custom">{t("playground.systemOne.virtualKey")}</SelectItem>
              </SelectContent>
            </Select>
            {apiKeySource === "custom" && (
              <Input
                type="password"
                aria-label={t("playground.systemOne.virtualKey")}
                value={customApiKey}
                onChange={(event) => setCustomApiKey(event.target.value)}
                placeholder={t("playground.systemOne.enterVirtualKey")}
                className="w-56"
              />
            )}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => handlePayloadChange(EXAMPLE_PAYLOAD)}
              disabled={rawPayload === EXAMPLE_PAYLOAD}
            >
              <RotateCcw />
              {t("playground.systemOne.resetExample")}
            </Button>
            <Button variant="outline" onClick={handleFormatJson} disabled={!rawPayload.trim() || hasSyntaxError}>
              <Code />
              {t("playground.systemOne.formatJson")}
            </Button>
            {isLoading && (
              <Button variant="outline" onClick={clearRequestState}>
                {t("playground.systemOne.cancelRequest")}
              </Button>
            )}
            <Button onClick={handleSend} disabled={!validation.isValid || isLoading || !effectiveApiKey}>
              {isLoading ? <LoaderCircle className="animate-spin" /> : <Send />}
              {t("playground.systemOne.send")}
            </Button>
          </div>
        </div>
        <Alert role="note" aria-label={t("playground.systemOne.betaNoticeAria")}>
          <Info />
          <AlertTitle>{t("playground.systemOne.betaTitle")}</AlertTitle>
          <AlertDescription>
            {t("playground.systemOne.betaBodyBefore")}{" "}
            <a href={DECISION_MODELS_DISCUSSION_URL} target="_blank" rel="noopener noreferrer" className="underline">
              {t("playground.systemOne.feedbackLink")}
            </a>
          </AlertDescription>
        </Alert>
      </section>

      <div className="grid gap-4 xl:min-h-0 xl:flex-1 xl:grid-cols-2">
        <section className="flex min-h-96 flex-col xl:min-h-0" aria-label={t("playground.systemOne.requestEditorAria")}>
          <JsonEditor value={rawPayload} onChange={handlePayloadChange} validation={validation} />
        </section>
        <section
          className="grid content-start gap-4 xl:min-h-0 xl:overflow-auto"
          aria-label={t("playground.systemOne.resultsAria")}
        >
          <ResponseView
            response={systemOne.data?.response}
            fallbackModel={validation.payload?.model}
            latencyMs={systemOne.data?.latencyMs}
            error={systemOne.error?.message}
            isLoading={isLoading}
          />
          <QuestionBreakdown payload={validation.payload} />
        </section>
      </div>
    </div>
  );
}
