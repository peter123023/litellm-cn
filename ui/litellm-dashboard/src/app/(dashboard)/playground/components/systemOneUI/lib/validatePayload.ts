import { DEFAULT_LANGUAGE, translate } from "@/i18n";
import { createSystemOneRequestSchema, type SystemOneRequest, type Translate } from "./schemas";

const RECOMMENDED_MAX_SCORE_LEVELS = 10;

export interface SystemOnePayloadIssue {
  path: string;
  message: string;
  severity: "error" | "warning";
}

export interface SystemOnePayloadValidation {
  isValid: boolean;
  payload?: SystemOneRequest;
  issues: SystemOnePayloadIssue[];
}

const invalid = (path: string, message: string): SystemOnePayloadValidation => ({
  isValid: false,
  issues: [{ path, message, severity: "error" }],
});

function parseJson(raw: string): { ok: true; value: unknown } | { ok: false; message: string } {
  try {
    return { ok: true, value: JSON.parse(raw) };
  } catch (error: unknown) {
    return { ok: false, message: error instanceof Error ? error.message : String(error) };
  }
}

const scoreLevelWarnings = (payload: SystemOneRequest, t: Translate): SystemOnePayloadIssue[] =>
  Object.entries(payload.questions)
    .filter(([, question]) => question.type === "score" && question.criteria.length > RECOMMENDED_MAX_SCORE_LEVELS)
    .map(([id]) => ({
      path: `questions.${id}.criteria`,
      message: t("playground.systemOne.validation.tooManyScoreLevels", { max: RECOMMENDED_MAX_SCORE_LEVELS }),
      severity: "warning",
    }));

export function validateSystemOnePayload(raw: string, translateMessages?: Translate): SystemOnePayloadValidation {
  const t: Translate = translateMessages ?? ((key, params) => translate(DEFAULT_LANGUAGE, key, params));

  if (!raw.trim()) {
    return invalid("root", t("playground.systemOne.validation.payloadEmpty"));
  }

  const json = parseJson(raw);
  if (!json.ok) {
    return invalid("syntax", t("playground.systemOne.validation.invalidJsonSyntax", { message: json.message }));
  }

  const result = createSystemOneRequestSchema(t).safeParse(json.value);
  if (!result.success) {
    return {
      isValid: false,
      issues: result.error.issues.map((issue) => ({
        path: issue.path.length > 0 ? issue.path.join(".") : "root",
        message: issue.message,
        severity: "error",
      })),
    };
  }

  return { isValid: true, payload: result.data, issues: scoreLevelWarnings(result.data, t) };
}
