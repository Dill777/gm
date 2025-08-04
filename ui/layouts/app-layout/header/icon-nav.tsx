"use client";

import React, { FC, useMemo } from "react";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Image from "@/ui/components/image";
import Popover from "@/ui/components/popover";
import { Button } from "@/ui/components/button";
import useAuth from "@/lib/auth/useAuth";
import { useAppSelector } from "@/lib/store";
import { cn } from "@/utils";
import ProfileMenu from "./profile-menu";
import { UserIcon } from "@/ui/components/icon/UserIcon";
import { shortenWalletAddress3 } from "@/utils/string-helper";
import { ArrowDownIcon } from "@/ui/components/icon/ArrowDownIcon";
import { useTLD } from "@/ui/hooks/useTLD";

const IconNav: FC<ComponentProps & { contentClassName?: string }> = ({
  className,
}) => {
  const { isAuthorized } = useAuth();
  const { address, chainId } = useAccount();
  const tld = useTLD(chainId);
  const { openConnectModal } = useConnectModal();
  const { userPrimaryDomain, userPrimaryDomainDB } = useAppSelector(
    (state) => state.user
  );

  const userAddress = useMemo(
    () => shortenWalletAddress3(address ?? "", 3, 4),
    [address]
  );

  const domainImage = useMemo(
    () => userPrimaryDomainDB?.mainImgUrl ?? "",
    [userPrimaryDomainDB]
  );
  const domainName = useMemo(
    () =>
      userPrimaryDomain?.domainName
        ? `${userPrimaryDomain.domainName}.${tld}`
        : "",
    [userPrimaryDomain, tld]
  );

  return (
    <>
      <nav className={cn("flex items-center justify-end gap-6", className)}>
        {!isAuthorized ? (
          <Button
            onClick={openConnectModal}
            suppressHydrationWarning
            className={cn(
              "tablet:hidden",
              "w-[148px] h-[46px] rounded-2xl flex items-center justify-center",
              "text-sm text-white"
            )}
          >
            Connect
          </Button>
        ) : (
          <>
            <Popover
              content={<ProfileMenu />}
              contentClassName="translate-x-0 -right-10 desktop:-right-3 mobile_md:-right-14"
            >
              {() => (
                <button
                  className={cn(
                    "flex items-center justify-between",
                    "w-[190px] h-[46px] p-[10px_9px]",
                    "tablet:w-11 tablet:h-11 tablet:p-0 tablet:justify-center",
                    "relative rounded-xl font-semibold bg-bg2/70 cursor-pointer"
                  )}
                >
                  <div className="flex items-center gap-1.5">
                    {domainImage ? (
                      <Image
                        src={domainImage}
                        alt="profile"
                        width={24}
                        height={24}
                        className={cn(
                          "w-6 h-6 rounded-full border-[0.5px] border-stroke/80",
                          "tablet:w-11 tablet:h-11 tablet:rounded-xl tablet:border-none"
                        )}
                      />
                    ) : (
                      <div
                        className={cn(
                          "group w-6 h-6 flex items-center justify-center border-[0.5px] border-stroke/80 rounded-full"
                        )}
                      >
                        <UserIcon />
                      </div>
                    )}
                    <span
                      className={cn(
                        "text-base font-semibold text-text_body1/90 font-inter leading-[140%] w-[120px] tablet:hidden",
                        "text-start",
                        "text-ellipsis overflow-hidden whitespace-nowrap"
                      )}
                    >
                      {!!domainName ? domainName : userAddress}
                    </span>
                  </div>

                  <ArrowDownIcon className="tablet:hidden" />
                </button>
              )}
            </Popover>
          </>
        )}
      </nav>
    </>
  );
};

export default IconNav;
