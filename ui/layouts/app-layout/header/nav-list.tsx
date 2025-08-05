import React from "react";
import Link from "@/ui/components/link";
import { HEADER_MENU_LIST } from "@/utils/constant";
import { cn } from "@/utils";
import { useSearchParams } from "next/navigation";
import Image from "@/ui/components/image";

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
              "flex items-center gap-2",
              menu.tab === searchParams.get("tab")
                ? "font-medium text-primary"
                : ""
            )}
          >
            {menu.iconType === "component" ? (
              <menu.icon className="w-5 h-5" />
            ) : (
              <Image
                src={menu.icon as string}
                alt={menu.name}
                width={20}
                height={20}
              />
            )}
            {menu.name}
          </Link>
        );
      })}
    </nav>
  );
};

export default NavList;
