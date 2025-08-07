"use client";
import React, { useMemo } from "react";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { copyToClipboard } from "@/utils";
import { useAppSelector } from "@/lib/store";
import { useClientRender } from "@/utils/hooks/useClientRender";
import { toast } from "react-toastify";
import { Button } from "@/ui/components/button";
import CopyLinkIcon from "@/ui/components/icon/CopyLinkIcon";
import ShareLinkIcon from "@/ui/components/icon/referral/ShareLinkIcon";
import { NetworkButton } from "@/ui/widget/network-button";
import { FlashIcon } from "@/ui/components/icon/FlashIcon";

const GMDeploySidebar = () => {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const isClient = useClientRender();
  const { user } = useAppSelector((state) => state.user);

  // Get referral URL
  const referUrl = useMemo(
    () =>
      isClient
        ? user && user.referralCode
          ? `${window.location.origin}?ref=${user.referralCode}`
          : `${window.location.origin}`
        : "",
    [user, isClient]
  );

  const onCopy = () => {
    if (user) {
      copyToClipboard(referUrl);
      toast.success("Copied to clipboard");
    }
  };

  const onShare = () => {
    let description =
      "🌞 Big GM energy for @gmcheap!\n" +
      "\n" +
      "Mint your onchain GM now and earn up to 25% forever from your referrals 🪙\n" +
      "\n" +
      "Start here →";

    let url = referUrl;
    let hashtags = "GM,CheapGM";
    window.open(
      `https://twitter.com/intent/tweet?text=${description}&url=${url}&hashtags=${hashtags}`,
      "_blank"
    );
  };

  return (
    <div className="space-y-5">
      {/* Wallet Connection Status */}
      <div className="space-y-4">
        <span className="text-black font-medium">Your wallet</span>
        <div className="bg-light_bg1/60 rounded-2xl px-5 py-3">
          {isConnected ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text_body">Current Network</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success2" />
                  <span className="text-success2 text-sm">Connected</span>
                </div>
              </div>
              <NetworkButton />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-hot" />
                <span className="text-hot text-lg">Not connected</span>
              </div>
              <p className="text-text2 text-sm">
                Connect your wallet to deploy contracts and send GM messages
              </p>
              <Button
                onClick={openConnectModal}
                className="w-full bg-primary text-white font-medium rounded-xl py-3 gap-2"
              >
                Connect
              </Button>
            </div>
          )}
        </div>
      </div>

      {isConnected && (
        <div className="rounded-3xl p-[1px] bg-gradient_cheap_primary">
          <span className="block rounded-3xl bg-white px-4 py-1.5 text-sm text-primary">
            <b>25%</b> rewards{" "}
            <span className="text-text2">from all SC from your link</span>
          </span>
        </div>
      )}

      {/* Referral Link */}
      {isConnected && (
        <div className="space-y-4">
          <span className="text-black font-medium">Referral Link</span>
          <div className="bg-light_bg1/60 rounded-2xl px-5 py-3 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center flex-1 rounded-xl p-3 border border-light_gray h-[50px] bg-light_bg1">
                <p className="text-text2 text-xs truncate max-w-[190px]">
                  {referUrl}
                </p>
              </div>
              <Button
                className="bg-primary text-white rounded-xl w-[50px] h-[50px] p-4"
                onClick={onCopy}
              >
                <CopyLinkIcon className="w-6 h-6" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                className="flex-1 bg-primary/20 text-primary rounded-xl py-2.5 px-3 gap-2 font-medium"
                onClick={onShare}
                disabled={!user}
              >
                <ShareLinkIcon className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Network Updates */}
      <div className="space-y-4">
        <span className="text-black font-medium">Network Update</span>
        <div className="space-y-4">
          <div className="bg-light_bg1/60 rounded-2xl px-5 py-3 space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-4 h-4 min-w-4 rounded-[4.25px] bg-primary/20 mt-1">
                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
              </div>
              <div className="gap-1">
                <span className="text-text2 text-xs font-medium">
                  2025-08-01
                </span>
                <div className="text-black font-medium">
                  🟢 Plume Network Added!
                </div>
                <div className="text-text2 text-sm">
                  .goon domains now available for GM and deployment.
                </div>
              </div>
            </div>
          </div>
          <div className="bg-light_bg1/60 rounded-2xl px-5 py-3 space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-4 h-4 min-w-4 rounded-[4.25px] bg-primary/20 mt-1">
                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
              </div>
              <div className="gap-1">
                <span className="text-text2 text-xs font-medium">
                  2025-08-05
                </span>
                <div className="text-black font-medium">🟣 XRPL Added!</div>
                <div className="text-text2 text-sm">
                  .xrpl domains now supported for GM and deployment.
                </div>
              </div>
            </div>
          </div>
          <div className="bg-light_bg1/60 rounded-2xl px-5 py-3 space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-4 h-4 min-w-4 rounded-[4.25px] bg-primary/20 mt-1">
                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
              </div>
              <div className="gap-1">
                <span className="text-text2 text-xs font-medium">
                  2025-08-08
                </span>
                <div className="text-black font-medium">
                  🌌 Somnia Testnet Added!
                </div>
                <div className="text-text2 text-sm">
                  .somnia domains now integrated for GM functionality.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GMDeploySidebar;
