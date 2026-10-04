import { SearchSelect } from "@/components/shared/SearchSelect";
import React from "react";
import { useTranslation } from "@/i18n";
import { ENDPOINT_OPTIONS } from "./chatConstants";

interface EndpointSelectorProps {
  endpointType: string | null;
  onEndpointChange: (value: string | null) => void;
  className?: string;
}

const EndpointSelector: React.FC<EndpointSelectorProps> = ({ endpointType, onEndpointChange, className }) => {
  const { t } = useTranslation();
  return (
    <div className={className}>
      <SearchSelect
        value={endpointType}
        onValueChange={onEndpointChange}
        options={ENDPOINT_OPTIONS}
        placeholder={t("playground.compare.selectEndpointAria")}
      />
    </div>
  );
};

export default EndpointSelector;
