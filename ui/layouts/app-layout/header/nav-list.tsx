import React from "react";
import Link from "@/ui/components/link";
import { HEADER_MENU_LIST } from "@/utils/constant";
import { cn } from "@/utils";
import { useSearchParams, usePathname } from "next/navigation";
import Image from "@/ui/components/image";

const NavList = ({ className }: { className?: string }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex items-center",
        "gap-6 mac_before:gap-4 desktop:gap-3 laptop_md:gap-6 tablet_md:gap-4",
        className ?? ""
      )}
    >
      {HEADER_MENU_LIST.map((menu, idx) => {
        const isActive = menu.tab
          ? menu.tab === searchParams.get("tab") ||
            (menu.tab === "gm" && !searchParams.get("tab"))
          : pathname === menu.link;

        return (
          <Link
            key={`navbar_menu_${idx}`}
            href={menu.link}
            newTab={menu.external}
            className={cn(
              "text-text2 text-sm",
              "hover:text-primary transition-colors",
              "flex items-center gap-2",
              "tablet:gap-1",
              "tablet:rounded-[10px] tablet:bg-light_bg1 tablet:p-[9px]",
              "tablet:border tablet:border-light_gray",
              isActive ? "font-medium text-primary" : ""
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
            <span className="tablet:hidden">{menu.name}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default NavList;
