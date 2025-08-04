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
            "flex items-start justify-between self-stretch",
            "laptop_md:grid laptop_md:grid-cols-2 laptop_md:gap-10",
            "mobile:grid mobile:grid-cols-2 mobile:gap-10"
          )}
        >
          {/* ZNS Connect */}
          <div
            className={cn(
              "flex flex-col items-start w-[288px] gap-[62px]",
              "laptop_md:col-span-2",
              "mobile:col-span-2"
            )}
          >
            <div className="flex flex-col gap-6 items-start self-stretch">
              <div className="flex items-center gap-3 self-stretch">
                <Image
                  src="/img/cheap-logo.svg"
                  alt="Cheap logo"
                  width={63}
                  height={63}
                  className="mobile:w-[45px] mobile:h-[45px]"
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
          <div className="flex flex-col items-start w-[156px] gap-8 mobile:col-span-1">
            <p className="self-stretch text-text3 text-sm font-medium">
              COMPANY
            </p>
            <div className="flex flex-col items-start gap-6">
              {FOOTER_MENU_LIST.map((menu, index) => (
                <Link
                  key={`navbar_menu_${index}`}
                  href={menu.link}
                  className="text-text2 hover:underline cursor-pointer"
                >
                  {menu.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Join our weekly digest */}
          <div
            className={cn(
              "flex flex-col items-start gap-8 w-[361px]",
              "mobile:col-span-2 mobile:w-full"
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
            "flex items-center justify-center w-full",
            "border-t-2 border-t-text2 border-opacity-25",
            "h-[82px] p-[10px]",
            "laptop_md:h-[155px] laptop_md:flex-col-reverse laptop_md:items-start laptop_md:justify-between",
            "mobile:h-[155px] mobile:flex-col-reverse mobile:items-start mobile:justify-between"
          )}
        >
          <div className="text-text_body">
            © 2025 • CheapGM. • All rights reserved.
          </div>
        </div>
      </Container>
    </div>
  );
}
