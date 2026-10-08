import React, { useState } from "react";
import { CircleHelp } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useTranslation } from "@/i18n";

const PREDEFINED_INTERVALS = ["7d", "30d", "90d", "180d", "365d"] as const;

const intervalLabelKey = (interval: string): string => `keyLifecycle.interval.${interval}`;

interface KeyLifecycleSettingsProps {
  value?: string;
  onChange?: (value: string) => void;
  autoRotationEnabled: boolean;
  onAutoRotationChange: (enabled: boolean) => void;
  rotationInterval: string;
  onRotationIntervalChange: (interval: string) => void;
  isCreateMode?: boolean;
  neverExpire?: boolean;
  onNeverExpireChange?: (checked: boolean) => void;
  id?: string;
}

const hintIcon = (hint: string): React.ReactNode => (
  <Tooltip>
    <TooltipTrigger
      render={<CircleHelp className="size-3.5 shrink-0 cursor-help text-muted-foreground" />}
      aria-label={hint}
    />
    <TooltipContent>{hint}</TooltipContent>
  </Tooltip>
);

const KeyLifecycleSettings: React.FC<KeyLifecycleSettingsProps> = ({
  value,
  onChange,
  autoRotationEnabled,
  onAutoRotationChange,
  rotationInterval,
  onRotationIntervalChange,
  isCreateMode = false,
  neverExpire = false,
  onNeverExpireChange,
  id,
}) => {
  const { t } = useTranslation();
  const isCustomInterval = Boolean(rotationInterval) && !PREDEFINED_INTERVALS.includes(rotationInterval as never);

  const [showCustomInput, setShowCustomInput] = useState(isCustomInterval);
  const [customInterval, setCustomInterval] = useState(isCustomInterval ? rotationInterval : "");

  const durationId = id ?? "key-lifecycle-duration";

  const handleIntervalChange = (next: string) => {
    if (next === "custom") {
      setShowCustomInput(true);
      return;
    }
    setShowCustomInput(false);
    setCustomInterval("");
    onRotationIntervalChange(next);
  };

  const handleCustomIntervalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomInterval(event.target.value);
    onRotationIntervalChange(event.target.value);
  };

  const handleNeverExpireChange = (checked: boolean) => {
    onNeverExpireChange?.(checked);
    if (checked) {
      onChange?.("");
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="space-y-4">
          <span className="text-sm font-medium text-foreground">{t("keyLifecycle.expirySettings")}</span>

          <div className="space-y-2">
            <div className="flex items-center space-x-1 text-sm font-medium text-foreground">
              <label htmlFor={durationId}>{t("keyLifecycle.expireKey")}</label>
              {hintIcon(t("keyLifecycle.expireKeyHint"))}
              {!isCreateMode && onNeverExpireChange && (
                <span className="ml-2 flex items-center gap-2 text-sm font-normal text-muted-foreground">
                  <Checkbox
                    id={`${durationId}-never-expire`}
                    checked={neverExpire}
                    onCheckedChange={handleNeverExpireChange}
                  />
                  <label htmlFor={`${durationId}-never-expire`} className="cursor-pointer">
                    {t("keyLifecycle.neverExpire")}
                  </label>
                </span>
              )}
            </div>
            <Input
              id={durationId}
              value={value ?? ""}
              onChange={(event) => onChange?.(event.target.value)}
              placeholder={t(
                isCreateMode ? "keyLifecycle.durationPlaceholderCreate" : "keyLifecycle.durationPlaceholderEdit",
              )}
              className="w-full"
              disabled={!isCreateMode && neverExpire}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <span className="text-sm font-medium text-foreground">{t("keyLifecycle.autoRotationSettings")}</span>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="flex items-center space-x-1 text-sm font-medium text-foreground">
                <span>{t("keyLifecycle.enableAutoRotation")}</span>
                {hintIcon(t("keyLifecycle.enableAutoRotationHint"))}
              </label>
              <Switch checked={autoRotationEnabled} onCheckedChange={onAutoRotationChange} />
            </div>

            {autoRotationEnabled && (
              <div className="space-y-2">
                <label className="flex items-center space-x-1 text-sm font-medium text-foreground">
                  <span>{t("keyLifecycle.rotationInterval")}</span>
                  {hintIcon(t("keyLifecycle.rotationIntervalHint"))}
                </label>
                <div className="space-y-2">
                  <Select
                    value={showCustomInput ? "custom" : rotationInterval || null}
                    onValueChange={(next: string | null) => next !== null && handleIntervalChange(next)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("keyLifecycle.selectInterval")}>
                        {(selected: string | null) =>
                          selected === null ? (
                            t("keyLifecycle.selectInterval")
                          ) : (
                            <span title={t(intervalLabelKey(selected))}>
                              {t(intervalLabelKey(selected))}
                            </span>
                          )
                        }
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {PREDEFINED_INTERVALS.map((interval) => (
                        <SelectItem key={interval} value={interval} title={t(intervalLabelKey(interval))}>
                          {t(intervalLabelKey(interval))}
                        </SelectItem>
                      ))}
                      <SelectItem value="custom" title={t(intervalLabelKey("custom"))}>
                        {t(intervalLabelKey("custom"))}
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  {showCustomInput && (
                    <div className="space-y-1">
                      <Input
                        value={customInterval}
                        onChange={handleCustomIntervalChange}
                        placeholder={t("keyLifecycle.customIntervalPlaceholder")}
                      />
                      <div className="text-xs text-muted-foreground">
                        {t("keyLifecycle.supportedFormats")}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {autoRotationEnabled && (
            <div className="rounded-md bg-info/10 p-3 text-sm text-info">
              {t("keyLifecycle.rotationNotice")}
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default KeyLifecycleSettings;
