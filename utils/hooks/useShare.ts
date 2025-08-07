"use client";
import { useCallback } from "react";
import { toast } from "react-toastify";
import { copyToClipboard } from "..";

export const useShare = () => {
  const onCopyShareLink = useCallback(() => {
    copyToClipboard(`${window.location.origin}${window.location.pathname}`);
    toast.success("Share Link has been Copied");
  }, []);

  const onTweet = useCallback(() => {
    let description =
      "🌞 Big GM energy for @gmcheap!\n" +
      "\n" +
      "Mint your onchain GM now and earn up to 25% forever from your referrals 🪙\n" +
      "\n" +
      "Start here →";

    let url = window.location.href.split("?")[0];
    let hashtags = "GM,CheapGM";
    const encodedText = encodeURIComponent(description);
    const encodedUrl = encodeURIComponent(url);
    const encodedHashtags = encodeURIComponent(hashtags);

    window.open(
      `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}&hashtags=${encodedHashtags}`,
      "_blank"
    );
  }, []);

  return { onCopyShareLink, onTweet };
};
