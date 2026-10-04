import { z } from "zod";

const MAX_CHOICE_OPTIONS = 255;

export type Translate = (key: string, params?: Record<string, string | number>) => string;

const nonEmptyString = (message: string) =>
  z.string({ error: message }).refine((value) => value.trim().length > 0, message);

export const createQuestionSchema = (t: Translate) => {
  const instructions = z.string({
    error: (iss) =>
      iss.input === undefined
        ? t("playground.systemOne.validation.instructionsMissing")
        : t("playground.systemOne.validation.instructionsNotString"),
  });

  const choiceQuestionSchema = z.looseObject({
    type: z.literal("choice"),
    instructions,
    criteria: z
      .record(z.string(), z.string({ error: t("playground.systemOne.validation.choiceDescriptionsNotStrings") }), {
        error: t("playground.systemOne.validation.choiceCriteriaNotObject"),
      })
      .refine(
        (criteria) => {
          const count = Object.keys(criteria).length;
          return count >= 1 && count <= MAX_CHOICE_OPTIONS;
        },
        t("playground.systemOne.validation.choiceCriteriaOptionCount", { max: MAX_CHOICE_OPTIONS }),
      ),
  });

  const noulQuestionSchema = z.looseObject({
    type: z.literal("noul"),
    instructions,
    criteria: z
      .looseObject(
        {
          true: z.string({ error: t("playground.systemOne.validation.noulTrueNotString") }).optional(),
          false: z.string({ error: t("playground.systemOne.validation.noulFalseNotString") }).optional(),
        },
        { error: t("playground.systemOne.validation.noulCriteriaNotObject") },
      )
      .optional(),
  });

  const scoreQuestionSchema = z.looseObject({
    type: z.literal("score"),
    instructions,
    criteria: z
      .array(z.string({ error: t("playground.systemOne.validation.scoreLevelsNotStrings") }), {
        error: t("playground.systemOne.validation.scoreCriteriaNotArray"),
      })
      .min(2, t("playground.systemOne.validation.scoreCriteriaTooFewLevels")),
  });

  const questionErrorMessages: Partial<Record<z.core.$ZodIssue["code"], string>> = {
    invalid_union: t("playground.systemOne.validation.questionTypeInvalid"),
    invalid_type: t("playground.systemOne.validation.questionNotObject"),
  };

  return z.discriminatedUnion("type", [choiceQuestionSchema, noulQuestionSchema, scoreQuestionSchema], {
    error: (iss) => questionErrorMessages[iss.code],
  });
};

export const createSystemOneRequestSchema = (t: Translate) =>
  z.looseObject(
    {
      model: nonEmptyString(t("playground.systemOne.validation.modelEmpty")).optional(),
      state: z.unknown().nonoptional({ error: t("playground.systemOne.validation.stateMissing") }),
      questions: z
        .record(z.string(), createQuestionSchema(t), {
          error: (iss) =>
            iss.input === undefined
              ? t("playground.systemOne.validation.questionsMissing")
              : t("playground.systemOne.validation.questionsEmpty"),
        })
        .refine(
          (questions) => Object.keys(questions).length > 0,
          t("playground.systemOne.validation.questionRequired"),
        ),
    },
    { error: t("playground.systemOne.validation.payloadNotObject") },
  );

const probability = z.number().finite().min(0).max(1);
const probabilities = z.record(z.string(), probability);

const noulAnswerSchema = z.looseObject({ type: z.literal("noul"), noul: probability });

const choiceAnswerShape = {
  type: z.literal("choice"),
  choice: z.string(),
  confidence: probability.optional(),
  probabilities,
};
const choiceAnswerSchema = z.looseObject(choiceAnswerShape);

const scoreAnswerShape = {
  type: z.literal("score"),
  score: z.number().finite(),
  confidence: probability.optional(),
  legend: z.record(z.string(), z.string()).optional(),
  probabilities,
};
const scoreAnswerSchema = z.looseObject(scoreAnswerShape);

const tokenCount = z.number().finite().nonnegative();

export const systemOneResponseSchema = z.looseObject({
  model: nonEmptyString("Model must be a non-empty string.").nullish(),
  answers: z.record(
    z.string(),
    z.discriminatedUnion("type", [noulAnswerSchema, choiceAnswerSchema, scoreAnswerSchema]),
  ),
  usage: z.object({ input_tokens: tokenCount, output_tokens: tokenCount }).optional(),
});

export type SystemOneRequest = z.infer<ReturnType<typeof createSystemOneRequestSchema>>;
export type SystemOneQuestion = z.infer<ReturnType<typeof createQuestionSchema>>;
export type SystemOneResponse = z.infer<typeof systemOneResponseSchema>;
export type SystemOneAnswer = SystemOneResponse["answers"][string];
