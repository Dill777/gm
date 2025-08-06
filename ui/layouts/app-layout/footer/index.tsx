import React from "react";
import Link from "@/ui/components/link";
import Image from "@/ui/components/image";
import Container from "@/ui/components/container";
import { FOOTER_MENU_LIST, SOCIAL_LIST } from "@/utils/constant";
import SubscribeEmail from "./subscribe";
import { cn } from "@/utils";

export default function Footer() {
  return (
    <div className="bg-white">
      <Container
        className={cn(
          "bg-white",
          "flex flex-col items-center w-full",
          "gap-[54px] py-10",
          "laptop_md:p-[32px_16px] mobile:p-[32px_16px]"
        )}
      >
        <div
          className={cn(
            "flex items-start justify-between self-stretch gap-5",
            "tablet:flex-col tablet:gap-10"
          )}
        >
          {/* ZNS Connect */}
          <div className={cn("flex flex-col w-full max-w-[356px] gap-5")}>
            <div className="flex flex-col gap-6 items-start self-stretch">
              <div className="flex items-center gap-3 self-stretch">
                <Image
                  src="/img/cheap-logo.png"
                  alt="Cheap logo"
                  width={1167}
                  height={1128}
                  className="mobile:w-[45px] mobile:h-[45px] rounded-full"
                />
                <p className="text-text3 text-[32px] mobile:text-2xl font-medium">
                  CheapGM
                </p>
              </div>

              <p className="text-text2">
                ⚡️ Your daily ritual to connect, earn, and grow onchain. Join
                our community now!
              </p>
            </div>
            <div className="flex flex-col gap-[15px] items-start">
              <div className="flex flex-row flex-wrap gap-[15px]">
                {SOCIAL_LIST.map((item, index) => (
                  <Link
                    key={`social_link_${index}`}
                    href={item.link}
                    className="cursor-pointer font-medium"
                    newTab
                  >
                    {<item.icon className="w-8 h-8 desktop:h-7 desktop:w-7" />}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Explore */}
          <div className="flex flex-col items-start gap-8 w-full">
            <p className="self-stretch text-text3 text-sm font-medium">
              COMPANY
            </p>
            <div className="flex flex-col items-start gap-6">
              {FOOTER_MENU_LIST.map((menu, index) => (
                <Link
                  key={`navbar_menu_${index}`}
                  href={menu.link}
                  className="text-text2 hover:underline cursor-pointer whitespace-nowrap"
                  newTab={menu.external}
                >
                  {menu.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Join our weekly digest */}
          <div
            className={cn(
              "flex flex-col items-start gap-8 max-w-[325px] w-full"
            )}
          >
            <div className="flex flex-col items-start gap-2 self-stretch">
              <p className="self-stretch text-text3 text-sm font-medium">
                NEWSLETTER
              </p>
              <p className="self-stretch text-text2">
                Weekly updates, no spams, guaranteed.
              </p>
            </div>
            <SubscribeEmail />
          </div>
        </div>

        <div
          className={cn(
            "flex items-center justify-center tablet:justify-start w-full",
            "border-t-2 border-t-text2 border-opacity-25",
            "px-4 py-10"
          )}
        >
          <div className="text-text_body tablet:text-sm">
            © 2025 • CheapGM. • All rights reserved.
          </div>
        </div>
      </Container>
    </div>
  );
}
