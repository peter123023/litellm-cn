import { DEFAULT_LANGUAGE, translate, type Translate } from "@/i18n";

const englishT: Translate = (key, params) => translate(DEFAULT_LANGUAGE, key, params);

export interface AnalysisModelInfo {
  model_group: string;
  providers: string[];
  mode?: string | null;
  supported_openai_params?: string[] | null;
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
