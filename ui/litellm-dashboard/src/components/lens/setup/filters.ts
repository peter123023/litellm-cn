import { DEFAULT_LANGUAGE, translate } from "@/i18n";
import type { Settings } from "../model/types";

export function normalizeFilters(filters: NonNullable<Settings["filters"]>): Settings["filters"] {
  return filters.map((f) => {
    if (!f.key.trim() || !f.value.trim())
      throw new Error(translate(DEFAULT_LANGUAGE, "lens.setup.validation.filterIncomplete"));
    return { key: f.key.trim(), value: f.value.trim() };
  });
}
