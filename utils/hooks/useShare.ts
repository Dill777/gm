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
      "Exciting news for our @znsconnect community! 🟢\n" +
      "\n" +
      "Join me by following back! 🚀✨\n" +
      "\n" +
      "Visit:";

    let url = window.location.href.split("?")[0];
    let hashtags = "zns,znsconnect,nameservise";
    window.open(
      `https://twitter.com/intent/tweet?text=${description}&url=${url}&hashtags=${hashtags}`,
      "_blank"
    );
  }, []);

  return { onCopyShareLink, onTweet };
};
