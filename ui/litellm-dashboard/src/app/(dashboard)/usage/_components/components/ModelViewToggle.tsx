import { useTranslation } from "@/i18n";

export type ModelViewType = "groups" | "individual";

interface ModelViewToggleProps {
  value: ModelViewType;
  onChange: (value: ModelViewType) => void;
}

export default function ModelViewToggle({ value, onChange }: ModelViewToggleProps) {
  const { t } = useTranslation();

  const options = [
    { value: "groups" as const, label: t("usage.modelView.publicModelName") },
    { value: "individual" as const, label: t("usage.modelView.litellmModelName") },
  ];

  return (
    <div className="flex bg-muted rounded-lg p-1">
      {options.map((option) => (
        <button
          key={option.value}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            value === option.value ? "bg-card shadow-xs text-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
