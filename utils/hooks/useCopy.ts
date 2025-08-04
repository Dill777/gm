import { useEffect, useState } from "react";
import { copyToClipboard } from "..";

export const useCopy = () => {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    let isRendered = true;
    let timer: NodeJS.Timeout;
    if (isCopied) {
      timer = setTimeout(() => {
        if (isRendered) {
          setIsCopied(false);
        }
      }, 3000);
    }
    return () => {
      clearTimeout(timer);
      isRendered = false;
    };
  }, [isCopied]);

  const onCopy = (value?: string) => {
    copyToClipboard(value);
    setIsCopied(true);
  };

  return { isCopied, onCopy };
};
