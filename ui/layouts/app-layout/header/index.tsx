"use client";
import React, { useState, Suspense } from "react";
import Image from "@/ui/components/image";
import Link from "@/ui/components/link";
import { useScroll } from "@/utils/hooks/useScroll";
import { MdOutlineMenu as Menu } from "react-icons/md";
import { cn } from "@/utils";
import NavList from "./nav-list";
import IconNav from "./icon-nav";
import MobileMenu from "./menu";
import useAuth from "@/lib/auth/useAuth";

const Header = () => {
  const { isAuthorized } = useAuth();
  const { isScrolled } = useScroll();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 z-[100] w-full flex justify-center bg-white",
          isScrolled && "shadow-lg",
          "h-[102px] tablet:h-[80px]"
        )}
      >
        <div
          className={cn(
            "max-w-[1440px] w-full h-full",
            "flex items-center justify-between p-[28px_40px] ",
            "p-[28px_56px] tablet:p-[12px_16px]"
          )}
        >
          {/* Logo */}
          <Link href="/">
            <Image
              src="/img/cheap-logo.png"
              alt="CheapGM logo"
              width={1167}
              height={1128}
              className={cn("w-[44px] h-[44px] rounded-full")}
            />
          </Link>

          {/* Navigation */}
          <Suspense fallback={null}>
            <NavList
              className={cn(
                "flex items-center mac_before:gap-8 desktop:gap-6",
                isAuthorized ? "gap-10" : "gap-12"
              )}
            />
          </Suspense>

          <div
            className={cn(
              "flex items-center justify-end",
              "gap-6 mac_before:gap-4 desktop:gap-3 laptop_md:gap-6 tablet_md:gap-4"
            )}
          >
            <IconNav
              className={cn(
                "flex items-center justify-end",
                "gap-6 mac_before:gap-4 desktop:gap-3 laptop_md:gap-6 tablet_md:gap-4"
              )}
            />

            {/* Hamburger */}
            {
              <>
                <div
                  className={cn(
                    "rounded-[10px] bg-light_bg1 hover:text-primary cursor-pointer",
                    "p-[9px]",
                    "hidden laptop_md:block",
                    "border border-light_gray"
                  )}
                  onClick={() => setShowMenu(true)}
                >
                  <Menu className="w-6 h-6 text-text3" />
                </div>
                <MobileMenu showMenu={showMenu} setShowMenu={setShowMenu} />
              </>
            }
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
