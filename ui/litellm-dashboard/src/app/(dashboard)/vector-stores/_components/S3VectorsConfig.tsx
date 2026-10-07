import React, { useState, useEffect } from "react";
import { CircleHelp, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/shared/Alert";
import { fetchAvailableModels, ModelGroup } from "@/components/llm_calls/fetch_models";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useTranslation } from "@/i18n";

interface S3VectorsConfigProps {
  accessToken: string | null;
  providerParams: Record<string, unknown>;
  onParamsChange: (params: Record<string, unknown>) => void;
}

const labelWithHint = (label: string, hint: string): React.ReactNode => (
  <>
    {label}
    <Tooltip>
      <TooltipTrigger render={<CircleHelp className="size-3.5 shrink-0 cursor-help text-muted-foreground" />} />
      <TooltipContent>{hint}</TooltipContent>
    </Tooltip>
  </>
);

const asText = (value: unknown): string => (typeof value === "string" ? value : "");

const S3VectorsConfig: React.FC<S3VectorsConfigProps> = ({ accessToken, providerParams, onParamsChange }) => {
  const { t } = useTranslation();
  const [embeddingModels, setEmbeddingModels] = useState<ModelGroup[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);

  useEffect(() => {
    if (!accessToken) return;

    const loadModels = async () => {
      setIsLoadingModels(true);
      try {
        const models = await fetchAvailableModels(accessToken);
        const embeddingOnly = models.filter((model) => model.mode === "embedding");
        setEmbeddingModels(embeddingOnly);
      } catch (error) {
        console.error("Error fetching embedding models:", error);
      } finally {
        setIsLoadingModels(false);
      }
    };

    loadModels();
  }, [accessToken]);

  const handleFieldChange = (fieldName: string, value: string) => {
    onParamsChange({
      ...providerParams,
      [fieldName]: value,
    });
  };

  const bucketName = asText(providerParams.vector_bucket_name);
  const indexName = asText(providerParams.index_name);
  const bucketNameError =
    bucketName && bucketName.length < 3 ? t("vectorStores.s3.bucketError") : undefined;
  const indexNameError =
    indexName && indexName.length > 0 && indexName.length < 3
      ? t("vectorStores.s3.indexError")
      : undefined;

  return (
    <TooltipProvider>
      <Alert variant="info" className="mb-4">
        <Info />
        <AlertTitle>{t("vectorStores.s3.title")}</AlertTitle>
        <AlertDescription>
          <div>
            <p>{t("vectorStores.s3.desc")}</p>
            <ul style={{ marginLeft: "16px", marginTop: "8px" }}>
              <li>{t("vectorStores.s3.step1")}</li>
              <li>{t("vectorStores.s3.step2")}</li>
              <li>{t("vectorStores.s3.step3")}</li>
              <li>
                {t("vectorStores.s3.step4")}{" "}
                <a
                  href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-vector-buckets.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("vectorStores.s3.docLink")}
                </a>
              </li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>

      <Field data-invalid={bucketNameError !== undefined || undefined}>
        <FieldLabel htmlFor="s3-vector-bucket-name">
          {labelWithHint(
            t("vectorStores.s3.bucketName"),
            t("vectorStores.s3.bucketNameHint"),
          )}
        </FieldLabel>
        <Input
          id="s3-vector-bucket-name"
          value={bucketName}
          onChange={(e) => handleFieldChange("vector_bucket_name", e.target.value)}
          placeholder={t("vectorStores.s3.bucketPlaceholder")}
          aria-invalid={bucketNameError !== undefined || undefined}
        />
        <FieldError>{bucketNameError}</FieldError>
      </Field>

      <Field data-invalid={indexNameError !== undefined || undefined}>
        <FieldLabel htmlFor="s3-index-name">
          {labelWithHint(
            t("vectorStores.s3.indexName"),
            t("vectorStores.s3.indexNameHint"),
          )}
        </FieldLabel>
        <Input
          id="s3-index-name"
          value={indexName}
          onChange={(e) => handleFieldChange("index_name", e.target.value)}
          placeholder={t("vectorStores.s3.indexPlaceholder")}
          aria-invalid={indexNameError !== undefined || undefined}
        />
        <FieldError>{indexNameError}</FieldError>
      </Field>

      <Field>
        <FieldLabel htmlFor="s3-aws-region-name">
          {labelWithHint(t("vectorStores.s3.region"), t("vectorStores.s3.regionHint"))}
        </FieldLabel>
        <Input
          id="s3-aws-region-name"
          value={asText(providerParams.aws_region_name)}
          onChange={(e) => handleFieldChange("aws_region_name", e.target.value)}
          placeholder={t("vectorStores.s3.regionPlaceholder")}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="s3-embedding-model">
          {labelWithHint(t("vectorStores.s3.embeddingModel"), t("vectorStores.s3.embeddingModelHint"))}
        </FieldLabel>
        <Combobox
          value={asText(providerParams.embedding_model) || null}
          onValueChange={(value: string | null) => value !== null && handleFieldChange("embedding_model", value)}
          items={embeddingModels.map((model) => model.model_group)}
        >
          <ComboboxInput id="s3-embedding-model" placeholder={t("vectorStores.s3.embeddingPlaceholder")} />
          <ComboboxContent>
            <ComboboxEmpty>
              {isLoadingModels ? t("vectorStores.s3.loadingModels") : t("vectorStores.s3.noModels")}
            </ComboboxEmpty>
            <ComboboxList>
              {(model: string) => (
                <ComboboxItem key={model} value={model}>
                  {model}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </Field>
    </TooltipProvider>
  );
};

export default S3VectorsConfig;
