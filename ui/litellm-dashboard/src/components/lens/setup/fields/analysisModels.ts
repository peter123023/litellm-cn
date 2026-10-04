import type { AnalysisModelInfo } from "../../model/types";
import type { AnalysisModels } from "./useAnalysisModels";
import { DEFAULT_LANGUAGE, translate, type Translate } from "@/i18n";

const englishT: Translate = (key, params) => translate(DEFAULT_LANGUAGE, key, params);

export interface ModelGate {
  readonly modelValid: boolean;
  readonly unavailable: boolean;
  readonly unsupported: boolean;
}

/** An edit may keep its saved model while the model list is loading or failing; a new run needs a verified one. */
export function modelGate(models: AnalysisModels, model: string, preservingSavedModel: boolean): ModelGate {
  const unsupported = models.modelDetails.some((m) => m.model_group === model && m.mode && m.mode !== "chat");
  const modelsReady = !models.modelsLoading && !models.modelsError;
  const unavailable = !!model && modelsReady && !models.models.includes(model);
  const supported = !unsupported && !unavailable;
  const verified = modelsReady || preservingSavedModel;
  return { modelValid: !!model && supported && verified, unavailable, unsupported };
}

export function analysisModelOptions(models: string[], details: AnalysisModelInfo[], t: Translate = englishT) {
  return [...new Set(models)].sort().map((name) => {
    const info = details.find((item) => item.model_group === name);
    const capability = () => {
      if (info?.mode && info.mode !== "chat") return t("lens.setup.model.notSuitable", { mode: info.mode });
      if (info?.supported_openai_params?.includes("response_format")) return t("lens.setup.model.jsonSupported");
      return t("lens.setup.model.jsonUnverified");
    };
    return {
      value: name,
      label: name,
      sublabel: [info?.providers.join(", "), capability()].filter(Boolean).join(" · "),
    };
  });
}
