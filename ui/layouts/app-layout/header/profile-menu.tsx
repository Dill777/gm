"use client";
import React, { useMemo, useState } from "react";
import { formatEther } from "viem";
import { useAccount, useBalance, useDisconnect } from "wagmi";
import { FaCheck, FaRegCopy } from "react-icons/fa6";
import Link from "@/ui/components/link";
import Loading from "@/ui/components/loading";
import Tooltip from "@/ui/components/tooltip";
import { GradientText } from "@/ui/components/text";
import NetworkButton from "@/ui/widget/network-button";
import { useAppSelector } from "@/lib/store";
import { formatPrice } from "@/utils";
import { makeMultisuffix, shortenWalletAddress } from "@/utils/string-helper";
import { useTLD } from "@/ui/hooks/useTLD";
import { useCopy } from "@/utils/hooks/useCopy";
import { CreditIcon } from "@/ui/components/icon/CreditIcon";
import { UserIcon } from "@/ui/components/icon/UserIcon";
import { DomainIcon } from "@/ui/components/icon/DomainIcon";
import { SettingIcon } from "@/ui/components/icon/SettingIcon";
import { LogoutIcon } from "@/ui/components/icon/LogoutIcon";
import { toast } from "react-toastify";
import { getChainByID } from "@/config/chains";
import { FlashIcon } from "@/ui/components/icon/FlashIcon";

const ProfileMenu = () => {
  const { address, chainId } = useAccount();
  const { data: userBalance, isLoading } = useBalance({ address: address });
  const { userPrimaryDomain } = useAppSelector((state) => state.user);
  const tld = useTLD(chainId);
  const chain = getChainByID(chainId);

  const { isCopied, onCopy } = useCopy();
  const userAddress = useMemo(
    () => shortenWalletAddress(address ?? "", 4),
    [address]
  );

  const { disconnect } = useDisconnect();

  const primaryDomain = useMemo(
    () =>
      userPrimaryDomain?.domainName
        ? `${userPrimaryDomain.domainName}.${tld}`
        : "",
    [userPrimaryDomain, tld]
  );
  const { userCredit, isLoadingCreditData } = useAppSelector(
    (state) => state.user
  );

  const [open, setOpen] = useState(true);

  const handleItemClick = () => {
    setOpen(false);
  };

  return open ? (
    <div className="flex flex-col bg-white rounded-xl p-4 w-[365px] z-[500] mobile:w-[290px] shadow-lg">
      <div className="flex flex-col space-y-[18px]">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-lg font-space_grotesk space-x-3 flex-1 mobile:space-x-2">
            <span className="text-lg font-semibold text-text3">
              {userAddress}
            </span>
            <div className="flex items-center space-x-3 mobile:space-x-2">
              <Tooltip content="Copy wallet address">
                <div
                  className="relative p-2 text-text3 rounded-full cursor-pointer hover:text-primary hover:bg-primary/30 hover:border-primary/30"
                  onClick={() => onCopy(address)}
                >
                  {isCopied ? (
                    <FaCheck className="w-4 h-4" />
                  ) : (
                    <FaRegCopy className="w-4 h-4" />
                  )}
                </div>
              </Tooltip>
            </div>
          </div>
          <Loading loading={isLoading}>
            <span className="text-sm font-medium text-text2">
              Balance:{" "}
              {`${formatPrice(
                Number(formatEther(userBalance?.value ?? BigInt(0)))
              )} ${userBalance?.symbol}`}
            </span>
          </Loading>
        </div>
        <div className="space-y-1">
          <span className="text-xs font-medium text-text3/60">
            Switch network
          </span>
          <NetworkButton />
        </div>
        <div className="p-5 rounded-2xl bg-light_b2 space-y-[18px]">
          <Link
            className="flex items-center space-x-2.5 cursor-pointer hover:text-primary group"
            href="/?tab=gm"
          >
            <span>👋🏻</span>
            <p className="text-text3 group-hover:text-primary text-sm">
              Say Gm on Blockchain
            </p>
          </Link>
          <Link
            className="flex items-center space-x-2.5 cursor-pointer text-text2 hover:text-primary group"
            href="/?tab=dashboard"
          >
            <FlashIcon className="w-4 h-4" />
            <p className="text-text3 group-hover:text-primary text-sm">
              Deploy Smart Contract
            </p>
          </Link>
          <button
            className="flex items-center space-x-2.5 cursor-pointer text-danger"
            onClick={() => {
              disconnect();
              handleItemClick();
            }}
          >
            <LogoutIcon />
            <p className="text-sm">Disconnect wallet</p>
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default ProfileMenu;
