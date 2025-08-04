"use client";

import { cn } from "@/utils";
import { useState, useEffect, useRef } from "react";

type ClampedTextProps = ComponentProps & {};

const ClampedText: React.FC<ClampedTextProps> = ({ children, className }) => {
  const [isClamped, setIsClamped] = useState(true);
  const [showButton, setShowButton] = useState(false);
  const textRef = useRef<HTMLPreElement>(null);

  const checkTextHeight = () => {
    if (textRef.current) {
      const textHeight = textRef.current.scrollHeight;
      const lineHeight = parseInt(
        window.getComputedStyle(textRef.current).lineHeight
      );
      const lines = textHeight / lineHeight;

      setShowButton(lines > 2);
    }
  };

  useEffect(() => {
    checkTextHeight();
    window.addEventListener("resize", checkTextHeight);

    return () => {
      window.removeEventListener("resize", checkTextHeight);
    };
  }, [children]);

  const toggleClamp = () => {
    setIsClamped(!isClamped);
  };

  return (
    <div className={cn("max-w-xl mx-auto", className)}>
      <pre
        ref={textRef}
        className={`overflow-hidden ${
          isClamped ? "line-clamp-2" : ""
        } h-auto text-wrap text-sm font-poppins`}
      >
        {children}
      </pre>
      {showButton && (
        <button
          className="mt-2 text-blue-500 hover:underline"
          onClick={toggleClamp}
        >
          {isClamped ? "Read More" : "Read Less"}
        </button>
      )}
    </div>
  );
};

export default ClampedText;
