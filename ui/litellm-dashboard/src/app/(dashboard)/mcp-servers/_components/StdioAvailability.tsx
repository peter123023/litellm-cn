import { type FC } from "react";
import { TriangleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/shared/Alert";
import { SelectItem } from "@/components/ui/select";
import { SimpleTooltip } from "@/components/ui/tooltip";
import { TRANSPORT, TRANSPORT_ITEMS } from "@/components/mcp_tools/types";
import { $api } from "@/lib/http/api";
import { useTranslation } from "@/i18n";

// Kept as a plain string for the callers that render it outside a React tree; components
// should use useStdioDisabledMessage so the text follows the active language.
export const STDIO_DISABLED_MESSAGE =
  "stdio MCP servers are disabled on this proxy. Set LITELLM_ENABLE_MCP_STDIO=true on the proxy and restart to enable them";

export const useStdioDisabledMessage = (): string => {
  const { t } = useTranslation();
  return t("mcp.stdio.disabledMessage");
};

export const useMcpStdioEnabled = (): boolean =>
  $api.useQuery("get", "/.well-known/litellm-ui-config").data?.mcp_stdio_enabled !== false;

export const TransportSelectItems: FC<{ stdioEnabled: boolean }> = ({ stdioEnabled }) => {
  const disabledMessage = useStdioDisabledMessage();

  return (
    <>
      {TRANSPORT_ITEMS.map((item) => {
        const disabled = item.value === TRANSPORT.STDIO && !stdioEnabled;
        return (
          <SelectItem key={item.value} value={item.value} disabled={disabled}>
            {item.label}
            {disabled && <SimpleTooltip content={disabledMessage} className="pointer-events-auto" />}
          </SelectItem>
        );
      })}
    </>
  );
};

export const StdioDisabledBanner: FC = () => {
  const { t } = useTranslation();
  const disabledMessage = useStdioDisabledMessage();

  return (
    <Alert variant="warning" className="mb-4 rounded-lg">
      <TriangleAlert />
      <AlertTitle>{t("mcp.stdio.disabledTitle")}</AlertTitle>
      <AlertDescription>
        {disabledMessage}. {t("mcp.stdio.disabledDescription")}
      </AlertDescription>
    </Alert>
  );
};
