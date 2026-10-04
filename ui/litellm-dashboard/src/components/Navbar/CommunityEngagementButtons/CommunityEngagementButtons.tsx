import { useDisableShowPrompts } from "@/app/(dashboard)/hooks/useDisableShowPrompts";
import { buttonVariants } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useTranslation } from "@/i18n";
import { cn } from "@/lib/cva.config";
import { Github, Slack } from "lucide-react";
import React from "react";

const COMMUNITY_LINKS = [
  {
    href: "https://www.litellm.ai/support",
    labelKey: "nav.community.joinSlack",
    tooltipKey: "nav.community.slackTooltip",
    Icon: Slack,
  },
  {
    href: "https://github.com/BerriAI/litellm",
    labelKey: "nav.community.github",
    tooltipKey: "nav.community.github",
    Icon: Github,
  },
] as const;

export const CommunityEngagementButtons: React.FC = () => {
  const disableShowPrompts = useDisableShowPrompts();
  const { t } = useTranslation();

  if (disableShowPrompts) {
    return null;
  }

  return (
    <TooltipProvider>
      <ButtonGroup aria-label={t("nav.community.links")}>
        {COMMUNITY_LINKS.map(({ href, labelKey, tooltipKey, Icon }) => (
          <Tooltip key={href}>
            <TooltipTrigger
              render={
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t(labelKey)}
                  className={cn(buttonVariants({ variant: "outline", size: "icon" }), "text-muted-foreground")}
                />
              }
            >
              <Icon />
            </TooltipTrigger>
            <TooltipContent>{t(tooltipKey)}</TooltipContent>
          </Tooltip>
        ))}
      </ButtonGroup>
    </TooltipProvider>
  );
};
