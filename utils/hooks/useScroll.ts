import { useEffect, useState } from "react";

export const useScroll = () => {
  const [isScrolled, setisScrolled] = useState(true);

  const handleScroll = () => {
    setisScrolled(document.documentElement.scrollTop !== 0);
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return { isScrolled };
};
