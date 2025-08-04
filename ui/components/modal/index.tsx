"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import FocusLock from "react-focus-lock";
import { IoMdCloseCircle } from "react-icons/io";
import { BackdropProps, ModalContentProps, ModalProps } from "./type";
import { cn } from "@/utils";
import { IoClose } from "react-icons/io5";

const effect = {
  hidden: {
    opacity: 0,
    display: "hidden",
  },
  visible: {
    y: "0",
    opacity: 1,
    display: "block",
    transition: {
      type: "spring",
      stiffness: 600,
      damping: 30,
    },
  },
  exit: {
    opacity: 0,
  },
};

const Backdrop = ({
  children,
  className,
  handleClose,
  keepCenter,
}: BackdropProps) => (
  <motion.div
    className={cn(
      "z-[200] fixed inset-0 flex items-center justify-center bg-black/60 bg-backdrop backdrop-filter backdrop-blur-md outline-none",
      "laptop:w-screen laptop:h-screen",
      keepCenter ? "" : "laptop:items-start",
      "overflow-auto",
      "hide-scroll-bar",
      className
    )}
    onClick={handleClose}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    {children}
  </motion.div>
);

const ModalContent = ({
  className,
  children,
  ariaLabel,
}: ModalContentProps) => (
  <motion.div
    tabIndex={-1}
    role="dialog"
    aria-modal={true}
    aria-label={ariaLabel}
    className={`relative outline-none ${
      className || "m-5 p-5 bg-white rounded-lg shadow-lg"
    }`}
    variants={effect}
    initial="hidden"
    animate="visible"
    exit="exit"
    onClick={(event) => event.stopPropagation()}
  >
    {children}
  </motion.div>
);

const Modal = ({
  children,
  className,
  isOpen,
  handleClose,
  hideCloseButton,
  backdropDismiss = true,
  onExitComplete,
  ariaLabel,
  backdropClassName,
  keepCenter = true,
}: ModalProps) => {
  const [isBrowser, setIsBrowser] = useState(false);
  const [trigger, setTrigger] = onExitComplete ?? [undefined, undefined];

  const handleKeyDown = (event: KeyboardEvent) => {
    if (!isOpen || event.key !== "Escape") return;

    handleClose();
  };

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "auto";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  if (!isBrowser) return <></>;

  return createPortal(
    <AnimatePresence
      initial={false}
      mode="wait"
      onExitComplete={() =>
        setTrigger && trigger === "fired" && setTrigger("completed")
      }
    >
      {isOpen && (
        <Backdrop
          handleClose={backdropDismiss ? handleClose : undefined}
          className={backdropClassName}
          keepCenter={keepCenter}
        >
          {!hideCloseButton && (
            <IoClose
              onClick={handleClose}
              className={cn(
                "z-[999] absolute w-8 h-8 top-4 right-4 cursor-pointer"
              )}
            />
          )}
          <FocusLock>
            <ModalContent
              className={cn(
                "max-w-[1024px] w-full",
                "laptop:pt-10 laptop:pb-5",
                className
              )}
              handleClose={hideCloseButton ? undefined : handleClose}
              ariaLabel={ariaLabel}
            >
              <>{children}</>
            </ModalContent>
          </FocusLock>
        </Backdrop>
      )}
    </AnimatePresence>,
    document.getElementById("modal-portal")!
  );
};

export default Modal;

export const Provider = () => <div id="modal-portal"></div>;
