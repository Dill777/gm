"use client";
import React, { useState, Suspense } from "react";
import Image from "@/ui/components/image";
import Link from "@/ui/components/link";
import { useScroll } from "@/utils/hooks/useScroll";
import { MdOutlineMenu as Menu } from "react-icons/md";
import { cn } from "@/utils";
import CheapLogo from "@/public/img/cheap-logo.svg";
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
          "h-[102px] mobile:h-[80px]"
        )}
      >
        <div
          className={cn(
            "max-w-[1440px] w-full h-full",
            "flex items-center justify-between p-[28px_40px] ",
            "p-[28px_56px] mobile:p-[12px_16px]"
          )}
        >
          {/* Logo */}
          <Link href="/">
            <Image
              src={CheapLogo}
              alt="CheapGM logo"
              width={44}
              height={44}
              className={cn(
                "w-[44px] h-[44px]",
                "mr-10 mac_before:mr-4"
                // "mobile:w-[29px] mobile:h-[29px]"
              )}
            />
          </Link>

          {/* Navigation */}
          <Suspense fallback={null}>
            <NavList
              className={cn(
                "flex items-center",
                isAuthorized
                  ? "gap-10 mac_before:gap-8 desktop:gap-6"
                  : "gap-12 mac_before:gap-8 desktop:gap-6",
                "laptop_md:hidden"
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
