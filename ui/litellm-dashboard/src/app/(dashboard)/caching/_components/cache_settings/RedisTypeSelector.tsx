import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "@/i18n";

interface RedisTypeSelectorProps {
  redisType: string;
  redisTypeDescriptions: Readonly<Record<string, string>>;
  onTypeChange: (type: string) => void;
}

const REDIS_TYPE_VALUES = ["node", "cluster", "sentinel", "semantic"] as const;

const RedisTypeSelector: React.FC<RedisTypeSelectorProps> = ({ redisType, redisTypeDescriptions, onTypeChange }) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{t("caching.redisTypeLabel")}</label>
      <Select value={redisType} onValueChange={(value) => value !== null && onTypeChange(value)}>
        <SelectTrigger className="w-full">
          <SelectValue>{t(`caching.redisType.${redisType}.label`)}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {REDIS_TYPE_VALUES.map((value) => (
            <SelectItem key={value} value={value}>
              {t(`caching.redisType.${value}.label`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground">
        {redisTypeDescriptions[redisType] || t("caching.redisTypeFallbackDesc")}
      </p>
    </div>
  );
};

export default RedisTypeSelector;
