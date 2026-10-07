import { z } from "zod";
import { type Translate } from "@/i18n";

export const ALL_TEAM_MODELS = "all-team-models";

const repeatsEarlierValue = (values: readonly string[], index: number): boolean =>
  values[index] !== "" && values.indexOf(values[index]) !== index;

const buildModelLimitSchema = (t: Translate) =>
  z.object({
    model: z.string().min(1, t("projects.schema.modelRequired")),
    tpm: z.number().optional(),
    rpm: z.number().optional(),
    itpm: z.number().optional(),
    otpm: z.number().optional(),
  });

export const createProjectFormSchema = (t: Translate) =>
  z
    .object({
      project_alias: z.string().min(1, t("projects.schema.projectNameRequired")),
      team_id: z
        .string()
        .nullable()
        .pipe(z.string({ error: t("projects.schema.teamRequired") }).min(1, t("projects.schema.teamRequired"))),
      description: z.string().optional(),
      models: z.array(z.string()),
      max_budget: z.number().nullish(),
      isBlocked: z.boolean(),
      guardrails: z.array(z.string()).optional(),
      modelLimits: z.array(buildModelLimitSchema(t)).optional(),
      metadata: z
        .array(
          z.object({
            key: z.string().min(1, t("projects.schema.metadataKeyRequired")),
            value: z.string().min(1, t("projects.schema.metadataValueRequired")),
          }),
        )
        .optional(),
    })
    .superRefine((values, ctx) => {
      const models = (values.modelLimits ?? []).map((entry) => entry.model);
      models.forEach((_, index) => {
        if (repeatsEarlierValue(models, index)) {
          ctx.addIssue({ code: "custom", message: t("projects.schema.duplicateModel"), path: ["modelLimits", index, "model"] });
        }
      });

      const keys = (values.metadata ?? []).map((entry) => entry.key);
      keys.forEach((_, index) => {
        if (repeatsEarlierValue(keys, index)) {
          ctx.addIssue({ code: "custom", message: t("projects.schema.duplicateKey"), path: ["metadata", index, "key"] });
        }
      });
    });

export type ProjectFormValues = z.input<ReturnType<typeof createProjectFormSchema>>;
export type ProjectSubmitValues = z.output<ReturnType<typeof createProjectFormSchema>>;

export const emptyProjectFormValues: ProjectFormValues = {
  project_alias: "",
  team_id: null,
  description: undefined,
  models: [],
  max_budget: undefined,
  isBlocked: false,
  guardrails: undefined,
  modelLimits: undefined,
  metadata: undefined,
};
