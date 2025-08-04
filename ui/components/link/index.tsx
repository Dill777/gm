"use client";
import { FC, forwardRef, PropsWithChildren, Suspense, useMemo } from "react";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import nProgress from "nprogress";
import { cn } from "@/utils";
import { shouldTriggerStartEvent } from "@/utils/should-trigger-start-event";

export interface LinkProps extends Omit<NextLinkProps, "href"> {
  href?: string;
  className?: string;
  style?: React.CSSProperties;
  highlighted?: boolean;
  isExact?: boolean;
  exceptHighlight?: string[];
  newTab?: boolean;
}

const extractPathname = (inputString: string) => {
  const match = inputString.match(/\/([^\/\?&]+)/);
  return match ? match[1] : "";
};

const LinkComponent = forwardRef<
  HTMLAnchorElement,
  PropsWithChildren<LinkProps>
>(function Link(
  {
    href,
    className,
    onClick,
    highlighted,
    isExact,
    exceptHighlight,
    newTab,
    ...rest
  },
  ref
) {
  const useLink = href && href.startsWith("/");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const highlightedCN = useMemo(() => {
    const fullpath = `${pathname}?${new URLSearchParams(
      searchParams
    ).toString()}`;
    const pathToMatch = isExact ? fullpath : pathname;
    if (exceptHighlight?.includes(fullpath)) return "";
    const hrefToMatch = isExact ? href : "/" + extractPathname(href ?? "");

    return highlighted && pathToMatch === hrefToMatch
      ? "text-primary font-semibold"
      : "";
  }, [pathname, searchParams, isExact, href]);

  if (!useLink)
    return (
      <a
        href={href}
        onClick={onClick}
        target={newTab ? "_blank" : undefined}
        rel={newTab ? "noopener noreferrer" : undefined}
        {...rest}
        className={cn(className, highlightedCN, "cursor-pointer")}
      />
    );

  return (
    <NextLink
      href={href}
      className={cn(className, highlightedCN, "cursor-pointer")}
      onClick={(event) => {
        if (shouldTriggerStartEvent(href, event)) nProgress.start();

        if (onClick) onClick(event);
      }}
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noopener noreferrer" : undefined}
      {...rest}
      ref={ref}
    />
  );
});

const Link: FC<PropsWithChildren<LinkProps>> = ({ ...props }) => (
  <Suspense>
    <LinkComponent {...props} />
  </Suspense>
);
export default Link;
