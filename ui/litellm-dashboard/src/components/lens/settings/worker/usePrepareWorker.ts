"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { lensKeys } from "../../data/queries";
import type { LensApi } from "../../data/service";
import { useLensApi } from "../../data/LensServices";
import type { WorkerCreated } from "../../model/types";
import { validateWorkerAddress, analysisAccessSchema, type AnalysisAccess } from "./workerSchema";
import { DEFAULT_LANGUAGE, translate, useTranslation, type Translate } from "@/i18n";

const englishT: Translate = (key, params) => translate(DEFAULT_LANGUAGE, key, params);

export interface WorkerRegistration {
  readonly address: string;
  readonly useExisting: boolean;
  readonly analysisKey: string | null;
  readonly access: AnalysisAccess;
  readonly editingWorker: string | null;
}

export async function createAnalysisKey(
  api: LensApi,
  access: AnalysisAccess,
  t: Translate = englishT,
): Promise<string> {
  const parsed = analysisAccessSchema.safeParse(access);
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);
  const result = await api.generateAnalysisKey(parsed.data);
  if (!result.token_id) throw new Error(t("lens.worker.missingKeyId"));
  return result.token_id;
}

async function releaseUnusedKey(api: LensApi, keyId: string): Promise<void> {
  const current = await api.lenses();
  if (current.workers.some((worker) => !worker.revoked && worker.analysis_key_id === keyId)) return;
  await api.deleteKeys([keyId]);
}

async function prepareWorker(
  api: LensApi,
  registration: WorkerRegistration,
  t: Translate,
): Promise<WorkerCreated | null> {
  const { address, useExisting, analysisKey, access, editingWorker } = registration;
  validateWorkerAddress(address);
  const keyId = useExisting ? analysisKey : await createAnalysisKey(api, access, t);
  const newKey = useExisting ? null : keyId;
  try {
    if (editingWorker) {
      await api.setWorkerBillingKey(editingWorker, keyId);
      return null;
    }
    return await api.registerWorker(keyId);
  } catch (e) {
    const message = e instanceof Error ? e.message : t("lens.worker.createCredentialFailed");
    if (!newKey) throw new Error(message);
    try {
      await releaseUnusedKey(api, newKey);
    } catch {
      throw new Error(t("lens.worker.cleanupUnconfirmed", { message }));
    }
    throw new Error(message);
  }
}

/** Registers a worker (or re-points its billing key), releasing a freshly minted key if registration fails. */
export function usePrepareWorker() {
  const api = useLensApi();
  const client = useQueryClient();
  const { t } = useTranslation();
  return useMutation({
    retry: false,
    mutationFn: (registration: WorkerRegistration) => prepareWorker(api, registration, t),
    onSettled: () => client.invalidateQueries({ queryKey: lensKeys.list(api.scope) }),
  });
}
