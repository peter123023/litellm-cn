import { LoaderCircle } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "@/i18n";

interface GlobalRetryPolicyObject {
  [retryPolicyKey: string]: number;
}

interface RetryPolicyObject {
  [key: string]: { [retryPolicyKey: string]: number } | undefined;
}

interface ModelRetrySettingsTabProps {
  selectedModelGroup: string | null;
  setSelectedModelGroup: (selectedModelGroup: string | null) => void;
  availableModelGroups: string[];
  globalRetryPolicy: GlobalRetryPolicyObject | null;
  setGlobalRetryPolicy: React.Dispatch<React.SetStateAction<GlobalRetryPolicyObject | null>>;
  defaultRetry: number;
  modelGroupRetryPolicy: RetryPolicyObject | null;
  setModelGroupRetryPolicy: React.Dispatch<React.SetStateAction<RetryPolicyObject | null>>;
  handleSaveRetrySettings: () => void;
  isSaving?: boolean;
}

// Display label and policy key are separate: the label is translated, the key is a wire value.
const RETRY_POLICY_ENTRIES: { labelKey: string; retryPolicyKey: string }[] = [
  { labelKey: "modelRetry.err.badRequest", retryPolicyKey: "BadRequestErrorRetries" },
  { labelKey: "modelRetry.err.authentication", retryPolicyKey: "AuthenticationErrorRetries" },
  { labelKey: "modelRetry.err.timeout", retryPolicyKey: "TimeoutErrorRetries" },
  { labelKey: "modelRetry.err.rateLimit", retryPolicyKey: "RateLimitErrorRetries" },
  { labelKey: "modelRetry.err.contentPolicy", retryPolicyKey: "ContentPolicyViolationErrorRetries" },
  { labelKey: "modelRetry.err.internalServer", retryPolicyKey: "InternalServerErrorRetries" },
  { labelKey: "modelRetry.err.serviceUnavailable", retryPolicyKey: "ServiceUnavailableErrorRetries" },
  { labelKey: "modelRetry.err.notFound", retryPolicyKey: "NotFoundErrorRetries" },
  { labelKey: "modelRetry.err.allOther", retryPolicyKey: "DefaultRetries" },
];

const isValidRetryCount = (value: number) => Number.isFinite(value) && Number.isInteger(value) && value >= 0;

const ModelRetrySettingsTab = ({
  selectedModelGroup,
  setSelectedModelGroup,
  availableModelGroups,
  globalRetryPolicy,
  setGlobalRetryPolicy,
  defaultRetry,
  modelGroupRetryPolicy,
  setModelGroupRetryPolicy,
  handleSaveRetrySettings,
  isSaving = false,
}: ModelRetrySettingsTabProps) => {
  const { t } = useTranslation();
  const isGlobalScope = selectedModelGroup === "global";
  const scopeItems = [
    { value: "global", label: t("modelRetry.globalDefault") },
    ...availableModelGroups.map((group) => ({ value: group, label: group })),
  ];

  const setGlobalValue = (retryPolicyKey: string, value: number | null) => {
    if (value == null) return;
    setGlobalRetryPolicy((prev) => ({ ...(prev ?? {}), [retryPolicyKey]: value }));
  };

  const setModelOverride = (retryPolicyKey: string, value: number | null) => {
    setModelGroupRetryPolicy((prev) => {
      const groupPolicy = { ...(prev?.[selectedModelGroup!] ?? {}) };
      if (value == null) {
        delete groupPolicy[retryPolicyKey];
      } else {
        groupPolicy[retryPolicyKey] = value;
      }
      return { ...(prev ?? {}), [selectedModelGroup!]: groupPolicy };
    });
  };

  const handleRetryCountChange = (retryPolicyKey: string, rawValue: string) => {
    const value = rawValue === "" ? null : Number(rawValue);
    if (value !== null && !isValidRetryCount(value)) return;
    if (isGlobalScope) setGlobalValue(retryPolicyKey, value);
    else setModelOverride(retryPolicyKey, value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Label htmlFor="retry-policy-scope">{t("modelRetry.scopeLabel")}</Label>
        <div className="w-48">
          <Select
            items={scopeItems}
            value={isGlobalScope ? "global" : selectedModelGroup || availableModelGroups[0]}
            onValueChange={(value) => setSelectedModelGroup(value)}
          >
            <SelectTrigger id="retry-policy-scope" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {scopeItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isGlobalScope ? (
        <div>
          <h2 className="text-lg font-semibold">{t("modelRetry.globalTitle")}</h2>
          <p className="text-sm text-muted-foreground">{t("modelRetry.globalDesc")}</p>
        </div>
      ) : (
        <div>
          <h2 className="text-lg font-semibold">{t("modelRetry.groupTitle", { group: selectedModelGroup ?? "" })}</h2>
          <p className="text-sm text-muted-foreground">{t("modelRetry.groupDesc")}</p>
        </div>
      )}
      <table className="w-full">
        <tbody>
          {RETRY_POLICY_ENTRIES.map(({ labelKey, retryPolicyKey }) => {
            const exceptionType = t(labelKey);
            const inheritedValue = globalRetryPolicy?.[retryPolicyKey] ?? defaultRetry;
            const override = isGlobalScope ? undefined : modelGroupRetryPolicy?.[selectedModelGroup!]?.[retryPolicyKey];
            const hasOverride = override != null;

            return (
              <tr key={retryPolicyKey} className="flex items-center justify-between gap-4 border-b py-2 last:border-0">
                <td className="text-sm">
                  <span>{exceptionType}</span>
                  {!isGlobalScope && (
                    <span className="ml-2 text-xs text-muted-foreground">
                      {t("modelRetry.globalValue", { value: inheritedValue })}
                    </span>
                  )}
                </td>
                <td className="flex items-center gap-2">
                  <Input
                    className="w-28"
                    type="number"
                    aria-label={t("modelRetry.retryCountAria", { type: exceptionType })}
                    min={0}
                    step={1}
                    value={isGlobalScope ? inheritedValue : hasOverride ? override : ""}
                    placeholder={isGlobalScope ? undefined : String(inheritedValue)}
                    onChange={(event) => handleRetryCountChange(retryPolicyKey, event.currentTarget.value)}
                  />
                  {!isGlobalScope && hasOverride && (
                    <Button variant="ghost" size="xs" onClick={() => setModelOverride(retryPolicyKey, null)}>
                      {t("modelRetry.reset")}
                    </Button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Button onClick={handleSaveRetrySettings} disabled={isSaving}>
        {isSaving && <LoaderCircle className="animate-spin" />}
        {t("modelRetry.save")}
      </Button>
    </div>
  );
};

export default ModelRetrySettingsTab;
