import { useDisableBlogPosts } from "@/app/(dashboard)/hooks/useDisableBlogPosts";
import { useBlogPosts, type BlogPost } from "@/app/(dashboard)/hooks/blogPosts/useBlogPosts";
import { NAV_PRODUCT_LINK_CLASS } from "@/components/Navbar/navProductLinkClass";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation, type Language } from "@/i18n";
import { ChevronDown, LoaderCircle } from "lucide-react";
import React from "react";

const DATE_LOCALES: Readonly<Record<Language, string>> = { en: "en-US", zh: "zh-CN" };

function formatDate(dateStr: string, language: Language): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString(DATE_LOCALES[language], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export const BlogDropdown: React.FC = () => {
  const disableBlogPosts = useDisableBlogPosts();
  const { t, language } = useTranslation();

  const { data, isLoading, isError, refetch } = useBlogPosts();

  if (disableBlogPosts) {
    return null;
  }

  const renderMenuContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center px-2 py-1.5 text-sm">
          <LoaderCircle role="img" aria-label={t("navbar.loading")} className="size-4 animate-spin" />
        </div>
      );
    }

    if (isError) {
      return (
        <div className="flex items-center gap-2 px-2 py-1.5 text-sm">
          <span className="text-destructive">{t("navbar.blogLoadFailed")}</span>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            {t("common.retry")}
          </Button>
        </div>
      );
    }

    if (!data || data.posts.length === 0) {
      return <div className="px-2 py-1.5 text-sm text-muted-foreground">{t("navbar.blogEmpty")}</div>;
    }

    return (
      <>
        {data.posts.slice(0, 5).map((post: BlogPost) => (
          <DropdownMenuItem key={post.url}>
            <a href={post.url} target="_blank" rel="noopener noreferrer" style={{ display: "block", width: 380 }}>
              <h5 className="text-sm font-semibold" style={{ marginBottom: 2 }}>
                {post.title}
              </h5>
              <span className="text-muted-foreground" style={{ fontSize: 11 }}>
                {formatDate(post.date, language)}
              </span>
              <p className="line-clamp-2">{post.description}</p>
            </a>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <a href="https://docs.litellm.ai/blog" target="_blank" rel="noopener noreferrer">
            {t("navbar.blogViewAll")}
          </a>
        </DropdownMenuItem>
      </>
    );
  };

  // Blog opens a post list; Docs is a single outbound link — navbar adds a layout-only chevron there for alignment.
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        openOnHover
        closeDelay={100}
        render={<Button variant="ghost" className={`${NAV_PRODUCT_LINK_CLASS} border-0!`} />}
      >
        {t("navbar.blog")}
        <ChevronDown className="size-2.5 text-muted-foreground" aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="bottom" className="w-auto">
        {renderMenuContent()}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BlogDropdown;
