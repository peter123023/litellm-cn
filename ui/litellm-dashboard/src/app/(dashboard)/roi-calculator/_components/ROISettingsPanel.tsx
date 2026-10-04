"use client";

import React from "react";

import { SearchSelect } from "@/components/shared/SearchSelect";
import { estimatorModelOptions } from "./roiCalculatorData";

import { apiClient } from "@/components/networking";
import { extractErrorMessage } from "@/utils/errorUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import type { ROIRepository, ROIRepositoriesResponse, ROISettings, ROISettingsUpdate } from "./roiCalculatorData";
import { useTranslation } from "@/i18n";

const onboardingStepKeys = ["roi.settings.stepSource", "roi.connect.stepReposTitle", "roi.settings.stepEstimator"] as const;

export default function ROISettingsPanel({
  accessToken,
  initialSettings,
  onboarding,
  onSaved,
  onReset,
  onStartSync,
  readOnly,
  syncDisabled,
}: {
  accessToken: string | null;
  initialSettings: ROISettings;
  onboarding: boolean;
  onSaved: (settings: ROISettings) => void;
  onReset: (settings: ROISettings) => void;
  onStartSync: () => Promise<void>;
  readOnly: boolean;
  syncDisabled: boolean;
}) {
  const { t } = useTranslation();
  const [provider, setProvider] = React.useState<"github" | "gitlab">(initialSettings.source_provider ?? "github");
  const sourceName = provider === "gitlab" ? "GitLab" : "GitHub";
  const savedToken = provider === "gitlab" ? initialSettings.has_gitlab_token : initialSettings.has_github_token;
  const savedUrl = provider === "gitlab" ? initialSettings.gitlab_api_url : initialSettings.github_api_url;
  const initialStep = savedToken ? 1 : 0;
  const [step, setStep] = React.useState(initialSettings.ready ? 2 : initialStep);
  const [apiUrl, setApiUrl] = React.useState(savedUrl ?? "https://gitlab.com/api/v4");
  const [token, setToken] = React.useState("");
  const [clearToken, setClearToken] = React.useState(false);
  const [repos, setRepos] = React.useState(initialSettings.repos);
  const [model, setModel] = React.useState(initialSettings.estimator_model);
  const [prompt, setPrompt] = React.useState(initialSettings.estimator_prompt);
  const [backfillDays, setBackfillDays] = React.useState(String(initialSettings.backfill_days));
  const [intervalHours, setIntervalHours] = React.useState(
    String((initialSettings.update_interval_minutes ?? 1440) / 60),
  );
  const [estimatorKey, setEstimatorKey] = React.useState("");
  const [clearEstimatorKey, setClearEstimatorKey] = React.useState(false);
  const [repositoryName, setRepositoryName] = React.useState("");
  const [resetOpen, setResetOpen] = React.useState(false);
  const [repositoryQuery, setRepositoryQuery] = React.useState("");
  const [repositoryPage, setRepositoryPage] = React.useState(1);
  const [availableRepos, setAvailableRepos] = React.useState<ROIRepository[]>([]);
  const [hasMoreRepos, setHasMoreRepos] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<string | null>(null);

  const sourceUnchanged = provider === (initialSettings.source_provider ?? "github") && apiUrl === savedUrl;
  const credentialsSaved = sourceUnchanged && !token.trim() && !clearToken;
  const canLoadRepositories = credentialsSaved && (provider === "gitlab" || savedToken);
  const tokenHelp = t(provider === "gitlab" ? "roi.settings.gitlabTokenHelp" : "roi.settings.githubTokenHelp");

  const changeProvider = (next: "github" | "gitlab") => {
    setProvider(next);
    setApiUrl(
      next === "gitlab"
        ? initialSettings.gitlab_api_url ?? "https://gitlab.com/api/v4"
        : initialSettings.github_api_url,
    );
    setToken("");
    setClearToken(false);
    setRepos([]);
    setAvailableRepos([]);
    setHasMoreRepos(false);
  };

  const loadRepositories = async (page: number) => {
    if (!accessToken || !canLoadRepositories) return;
    try {
      setBusy(true);
      const response: ROIRepositoriesResponse = await apiClient.get("/roi-calculator/repositories", {
        accessToken,
        query: { query: repositoryQuery, page },
      });
      setAvailableRepos((current) => (page === 1 ? response.repositories : [...current, ...response.repositories]));
      setHasMoreRepos(response.has_more);
      setRepositoryPage(page);
      setError(null);
    } catch (reason) {
      setError(extractErrorMessage(reason));
    } finally {
      setBusy(false);
    }
  };

  const saveSettings = async () => {
    if (!accessToken || readOnly) return false;
    const tokenValue = clearToken ? null : token.trim() || undefined;
    const body: ROISettingsUpdate = {
      source_provider: provider,
      ...(provider === "gitlab" ? { gitlab_api_url: apiUrl } : { github_api_url: apiUrl }),
      repos,
      estimator_model: model,
      estimator_prompt: prompt,
      backfill_days: Number(backfillDays),
      update_interval_minutes: Number(intervalHours) * 60,
      ...(clearEstimatorKey ? { estimator_key: null } : {}),
      ...(estimatorKey.trim() ? { estimator_key: estimatorKey.trim() } : {}),
      ...(provider === "gitlab" ? { gitlab_token: tokenValue } : { github_token: tokenValue }),
    };
    try {
      setBusy(true);
      const updated: ROISettings = await apiClient.put("/roi-calculator/settings", { accessToken, body });
      onSaved(updated);
      setToken("");
      setEstimatorKey("");
      setClearEstimatorKey(false);
      setClearToken(false);
      setMessage(t("roi.settings.saved"));
      setError(null);
      return true;
    } catch (reason) {
      setError(extractErrorMessage(reason));
      setMessage(null);
      return false;
    } finally {
      setBusy(false);
    }
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!(await saveSettings())) return;
    if (onboarding && step === 0) {
      setStep(1);
      if (!(token.trim() || savedToken) || clearToken) return;
      try {
        const result = await apiClient.get<ROIRepositoriesResponse>("/roi-calculator/repositories", { accessToken });
        setAvailableRepos(result.repositories);
        setHasMoreRepos(result.has_more);
        setRepositoryPage(1);
        setStep(1);
      } catch (reason) {
        setError(extractErrorMessage(reason));
      }
    } else if (onboarding && step === 1) setStep(2);
    else if (onboarding) await onStartSync();
  };

  const saveAndRun = async () => {
    if (await saveSettings()) await onStartSync();
  };

  const testConnections = async () => {
    if (!(await saveSettings())) return;
    setBusy(true);
    try {
      await apiClient.post("/roi-calculator/connections/test", { accessToken });
      setMessage(t("roi.settings.tested"));
    } catch (reason) {
      setError(extractErrorMessage(reason));
    } finally {
      setBusy(false);
    }
  };

  const resetSetup = async () => {
    setBusy(true);
    try {
      const updated = await apiClient.post<ROISettings>("/roi-calculator/setup/reset", { accessToken });
      setRepos([]);
      setStep(0);
      setResetOpen(false);
      onReset(updated);
    } catch (reason) {
      setError(extractErrorMessage(reason));
    } finally {
      setBusy(false);
    }
  };

  const toggleRepository = (name: string) => {
    setRepos((current) => (current.includes(name) ? current.filter((repo) => repo !== name) : [...current, name]));
  };

  const formDisabled = busy || syncDisabled;
  const runDisabled = formDisabled || !repos.length || !model;
  const sourceUrlChanged = apiUrl !== savedUrl;
  const missingReplacementToken = savedToken && sourceUrlChanged && !token.trim();
  const stepReady = [true, repos.length > 0, Boolean(model)][step];
  const onboardingLabel = step < 2 ? t("common.continue") : t("roi.settings.startBackfill");
  const submitLabel = onboarding ? onboardingLabel : t("roi.settings.saveSettings");

  return (
    <Card className={onboarding ? "max-w-2xl" : "border-0 py-0 shadow-none ring-0"}>
      {onboarding && (
        <CardHeader>
          <h2 className="text-base leading-normal font-medium">
            {t(onboardingStepKeys[step] ?? "roi.settings.stepSource")}
          </h2>
          <CardDescription>{t("roi.settings.onboardingDescription")}</CardDescription>
        </CardHeader>
      )}
      <CardContent className={onboarding ? "space-y-5" : "space-y-5 px-0"}>
        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        {message && (
          <p className="text-sm text-emerald-700" role="status">
            {message}
          </p>
        )}
        {onboarding && (
          <p className="text-sm text-muted-foreground">
            {t("roi.settings.stepCounter", { current: step + 1, total: onboardingStepKeys.length })}
          </p>
        )}
        <form className="space-y-5" onSubmit={(event) => void submit(event)}>
          <fieldset disabled={busy || syncDisabled || readOnly} className="space-y-5">
            {(!onboarding || step === 0) && (
              <section className="space-y-4">
                {!onboarding && <h3 className="font-semibold">{t("roi.settings.sectionConnection")}</h3>}
                <div className="grid gap-2">
                  <Label htmlFor="roi-source">{t("roi.settings.sourceLabel")}</Label>
                  <select
                    id="roi-source"
                    className="h-9 min-w-0 rounded-md border bg-background pl-3 pr-9 text-sm"
                    value={provider}
                    onChange={(event) => changeProvider(event.target.value as "github" | "gitlab")}
                  >
                    <option value="github">GitHub</option>
                    <option value="gitlab">GitLab</option>
                  </select>
                  {provider !== (initialSettings.source_provider ?? "github") && !onboarding && (
                    <p className="text-xs text-muted-foreground">{t("roi.settings.switchingSource")}</p>
                  )}
                </div>
                <details>
                  <summary className="cursor-pointer text-sm text-muted-foreground">
                    {t("roi.settings.selfHosted", { source: sourceName })}
                  </summary>
                  <div className="mt-3 grid gap-2">
                    <Label htmlFor="roi-github-url">{t("roi.settings.apiUrlLabel", { source: sourceName })}</Label>
                    <Input
                      disabled={readOnly}
                      id="roi-github-url"
                      value={apiUrl}
                      onChange={(event) => setApiUrl(event.target.value)}
                    />
                  </div>
                </details>
                <div className="grid gap-2">
                  <Label htmlFor="roi-github-token">{t("roi.settings.tokenLabel", { source: sourceName })}</Label>
                  <Input
                    autoComplete="new-password"
                    disabled={readOnly}
                    id="roi-github-token"
                    type="password"
                    value={token}
                    onChange={(event) => {
                      setToken(event.target.value);
                      setClearToken(false);
                    }}
                    placeholder={t(savedToken ? "roi.settings.tokenSavedPlaceholder" : "roi.settings.enterTokenPlaceholder", { source: sourceName })}
                  />
                  <p className="text-xs text-muted-foreground">
                    {savedToken ? t("roi.settings.tokenSavedNote") : tokenHelp}
                  </p>
                  {missingReplacementToken && (
                    <p className="text-xs text-amber-700">{t("roi.settings.apiUrlChangeClearsToken")}</p>
                  )}
                  {savedToken && (
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        aria-label={t("roi.settings.clearTokenAria", { source: sourceName })}
                        checked={clearToken}
                        disabled={readOnly}
                        type="checkbox"
                        onChange={(event) => setClearToken(event.target.checked)}
                      />
                      {t("roi.settings.clearToken")}
                    </label>
                  )}
                </div>
              </section>
            )}
            {(!onboarding || step === 1) && (
              <section className={onboarding ? "space-y-4" : "space-y-4 border-t pt-5"}>
                <h3 className="font-semibold">{t("roi.connect.repositoriesLabel")}</h3>
                <Label className="sr-only" htmlFor="roi-repository-search">
                  {t("roi.settings.searchRepositories")}
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="roi-repository-search"
                    value={repositoryQuery}
                    onChange={(event) => setRepositoryQuery(event.target.value)}
                    placeholder={t("roi.settings.searchRepositories")}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={busy || !canLoadRepositories}
                    onClick={() => void loadRepositories(1)}
                  >
                    {t("roi.settings.loadRepositories")}
                  </Button>
                </div>
                {!canLoadRepositories && (
                  <p className="text-xs text-muted-foreground">
                    {t(
                      provider === "github" && !savedToken
                        ? "roi.settings.needGitHubToken"
                        : "roi.settings.saveSourceFirst",
                    )}
                  </p>
                )}
                {repos.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {repos.map((repo) => (
                      <Button
                        key={repo}
                        type="button"
                        variant="outline"
                        disabled={readOnly}
                        onClick={() => toggleRepository(repo)}
                        aria-label={t("roi.settings.removeRepoAria", { repo })}
                      >
                        {repo} ×
                      </Button>
                    ))}
                  </div>
                )}
                <div>
                  <Label htmlFor="roi-repository-name">{t("roi.settings.addRepoByName")}</Label>
                  <div className="mt-2 flex gap-2">
                    <Input
                      id="roi-repository-name"
                      aria-label={t("roi.settings.repoNameAria")}
                      placeholder={t(
                        provider === "gitlab"
                          ? "roi.connect.repoPlaceholderGitLab"
                          : "roi.settings.repoPlaceholderGitHub",
                      )}
                      value={repositoryName}
                      onChange={(e) => setRepositoryName(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      disabled={!repositoryName.trim()}
                      onClick={() => {
                        if (!repos.includes(repositoryName.trim())) setRepos([...repos, repositoryName.trim()]);
                        setRepositoryName("");
                      }}
                    >
                      {t("roi.settings.add")}
                    </Button>
                  </div>
                </div>
                {availableRepos.length > 0 && (
                  <div className="max-h-56 space-y-2 overflow-y-auto rounded-md border p-3">
                    {availableRepos.map((repository) => (
                      <label key={repository.name} className="flex items-center gap-2 text-sm">
                        <input
                          aria-label={t("roi.settings.selectRepoAria", { repo: repository.name })}
                          checked={repos.includes(repository.name)}
                          disabled={readOnly}
                          type="checkbox"
                          onChange={() => toggleRepository(repository.name)}
                        />
                        <span>{repository.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {repository.visibility}
                          {repository.archived ? t("roi.settings.archivedSuffix") : ""}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
                {hasMoreRepos && (
                  <Button
                    type="button"
                    variant="link"
                    className="w-fit px-0"
                    disabled={busy}
                    onClick={() => void loadRepositories(repositoryPage + 1)}
                  >
                    {t("roi.settings.loadMore")}
                  </Button>
                )}
              </section>
            )}
            {(!onboarding || step === 2) && (
              <section className={onboarding ? "space-y-4" : "space-y-4 border-t pt-5"}>
                {!onboarding && <h3 className="font-semibold">{t("roi.settings.sectionEstimation")}</h3>}
                <div className="grid gap-2">
                  <Label htmlFor="roi-estimator-model">{t("roi.settings.estimatorModel")}</Label>
                  <SearchSelect
                    inputId="roi-estimator-model"
                    options={estimatorModelOptions(initialSettings, t)}
                    value={model}
                    onValueChange={(value) => setModel(value ?? "")}
                    placeholder={t("roi.settings.searchModels")}
                    emptyText={t("roi.settings.noModels")}
                    disabled={readOnly}
                    className="h-9"
                  />
                  <p className="text-xs text-muted-foreground">{t("roi.settings.modelRecommendation")}</p>
                </div>
                <details>
                  <summary className="cursor-pointer text-sm text-muted-foreground">
                    {t("roi.settings.advancedEstimator")}
                  </summary>
                  <div className="mt-3 grid gap-2">
                    <Label htmlFor="roi-estimator-prompt">{t("roi.settings.estimatorPrompt")}</Label>
                    <Textarea
                      id="roi-estimator-prompt"
                      rows={5}
                      disabled={readOnly}
                      value={prompt}
                      onChange={(event) => setPrompt(event.target.value)}
                    />
                  </div>
                </details>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid content-start gap-2">
                    <Label htmlFor="roi-backfill-days">{t("roi.settings.backfillDays")}</Label>
                    <Input
                      id="roi-backfill-days"
                      min={1}
                      max={3650}
                      type="number"
                      disabled={readOnly}
                      value={backfillDays}
                      onChange={(event) => setBackfillDays(event.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="roi-interval">{t("roi.settings.updateInterval")}</Label>
                    <Input
                      id="roi-interval"
                      type="number"
                      min={0}
                      max={720}
                      step="any"
                      required
                      value={intervalHours}
                      onChange={(e) => setIntervalHours(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">{t("roi.settings.intervalHint")}</p>
                  </div>
                </div>
                <details>
                  <summary className="cursor-pointer text-sm text-muted-foreground">
                    {t("roi.settings.advancedSettings")}
                  </summary>
                  <div className="mt-3 space-y-3">
                    <Label htmlFor="roi-estimator-key">{t("roi.settings.estimatorKey")}</Label>
                    <Input
                      id="roi-estimator-key"
                      type="password"
                      autoComplete="new-password"
                      value={estimatorKey}
                      onChange={(e) => {
                        setEstimatorKey(e.target.value);
                        setClearEstimatorKey(false);
                      }}
                      placeholder={t(
                        initialSettings.has_estimator_key
                          ? "roi.settings.keySavedPlaceholder"
                          : "roi.settings.optionalGatewayKey",
                      )}
                    />
                    <p className="text-xs text-muted-foreground">{t("roi.settings.estimatorKeyHint")}</p>
                    {initialSettings.has_estimator_key && (
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={clearEstimatorKey}
                          onChange={(e) => setClearEstimatorKey(e.target.checked)}
                        />
                        {t("roi.settings.useAdminKey")}
                      </label>
                    )}
                    <Button type="button" variant="link" onClick={() => setPrompt(initialSettings.default_prompt)}>
                      {t("roi.settings.resetPrompt")}
                    </Button>
                    {!onboarding && !readOnly && (
                      <Button type="button" variant="outline" onClick={() => setResetOpen(true)}>
                        {t("roi.settings.restartSetup")}
                      </Button>
                    )}
                  </div>
                </details>
                <p className="text-xs text-muted-foreground">{t("roi.settings.estimateDisclaimer")}</p>
              </section>
            )}
            {!readOnly && (
              <div className="flex flex-wrap gap-2 border-t pt-5">
                {onboarding && step > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    disabled={busy || syncDisabled}
                    onClick={() => setStep(step - 1)}
                  >
                    {t("roi.settings.back")}
                  </Button>
                )}
                <Button disabled={formDisabled || (onboarding && !stepReady)} type="submit">
                  {busy ? t("roi.settings.saving") : submitLabel}
                </Button>
                {!onboarding && (
                  <Button type="button" variant="outline" onClick={() => void testConnections()}>
                    {t("roi.settings.testConnections")}
                  </Button>
                )}
                {!onboarding && (
                  <Button disabled={runDisabled} type="button" variant="outline" onClick={() => void saveAndRun()}>
                    {t("roi.settings.saveAndRun")}
                  </Button>
                )}
              </div>
            )}
          </fieldset>
        </form>
        <Dialog open={resetOpen} onOpenChange={setResetOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("roi.settings.restartTitle")}</DialogTitle>
              <DialogDescription>{t("roi.settings.restartDescription")}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" disabled={busy} onClick={() => setResetOpen(false)}>
                {t("common.cancel")}
              </Button>
              <Button disabled={busy} onClick={() => void resetSetup()}>
                {t("roi.settings.restartSetup")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
