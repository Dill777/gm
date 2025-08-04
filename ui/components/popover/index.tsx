"use client";
import { cn } from "@/utils";
import React, { FC, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type PopoverProps = {
  className?: string;
  children: (isOpened: boolean) => React.ReactNode;
  content: React.ReactNode;
  trigger?: "click" | "hover";
  contentClassName?: string;
  forceHide?: boolean;
  hideTrigger?: any;
};

const Popover: FC<PopoverProps> = ({
  className,
  children,
  content,
  trigger = "click",
  contentClassName = "",
  forceHide = false,
  hideTrigger,
}) => {
  const [show, setShow] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleMouseOver = () => {
    if (trigger === "hover") {
      setShow(true);
    }
  };

  const handleMouseLeft = () => {
    if (trigger === "hover") {
      setShow(false);
    }
  };

  useEffect(() => {
    forceHide && setShow(false);
  }, [hideTrigger]);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShow(false);
      }
    }

    if (show) {
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [show, wrapperRef]);

  const onFire = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setShow(!show);
  };

  return (
    <div
      ref={wrapperRef}
      onMouseEnter={handleMouseOver}
      onMouseLeave={handleMouseLeft}
      className={cn(
        "w-fit h-fit relative flex justify-center items-center cursor-pointer",
        className ?? ""
      )}
    >
      <div onClick={onFire} className="flex items-center w-full h-fit">
        {children(show)}
      </div>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "min-w-fit h-fit absolute mt-2 top-[100%] z-50",
              contentClassName
            )}
          >
            <div className="shadow-normal">{content}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Popover;
