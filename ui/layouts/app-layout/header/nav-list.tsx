import React from "react";
import Link from "@/ui/components/link";
import { HEADER_MENU_LIST } from "@/utils/constant";
import { cn } from "@/utils";
import { useSearchParams } from "next/navigation";

const NavList = ({ className }: { className?: string }) => {
  const searchParams = useSearchParams();

  return (
    <nav className={cn("flex items-center", className ?? "")}>
      {HEADER_MENU_LIST.map((menu, idx) => {
        return (
          <Link
            key={`navbar_menu_${idx}`}
            href={menu.link}
            newTab={menu.external}
            className={cn(
              "text-text2 text-sm",
              "hover:text-primary transition-colors",
              menu.tab === searchParams.get("tab")
                ? "font-medium text-primary"
                : ""
            )}
          >
            {menu.name}
          </Link>
        );
      })}
    </nav>
  );
};

export default NavList;
