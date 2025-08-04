"use client";
import React, { useMemo } from "react";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Image from "@/ui/components/image";
import Popover from "@/ui/components/popover";
import { Button } from "@/ui/components/button";
import { useAppSelector } from "@/lib/store";
import ProfileMenu from "./profile-menu";
import { FaRegUserCircle } from "react-icons/fa";

const ConnectButton = () => {
  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { userPrimaryDomainDB } = useAppSelector((state) => state.user);

  const domainImage = useMemo(
    () => userPrimaryDomainDB?.mainImgUrl ?? "",
    [userPrimaryDomainDB]
  );

  return (
    <div className="flex items-center">
      {!address ? (
        <Button
          size="sm"
          onClick={openConnectModal}
          suppressHydrationWarning
          className="laptop:hidden"
        >
          Connect
        </Button>
      ) : (
        <>
          <Popover
            content={<ProfileMenu />}
            contentClassName="translate-x-0 -right-10 desktop:-right-3 mobile:-right-12"
          >
            {() => (
              <button>
                {domainImage ? (
                  <Image
                    src={domainImage}
                    alt="profile"
                    width={44}
                    height={44}
                    className="w-[44px] h-[44px] shrink-0 rounded-full"
                  />
                ) : (
                  <FaRegUserCircle className="w-6 h-6" />
                )}
              </button>
            )}
          </Popover>
        </>
      )}
    </div>
  );
};

export default ConnectButton;
