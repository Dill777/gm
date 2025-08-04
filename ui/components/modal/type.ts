import { Dispatch, HTMLAttributes, SetStateAction } from "react";

export type ModalProps = HTMLAttributes<HTMLDivElement> & {
  isOpen: boolean;
  handleClose: () => void;
  hideCloseButton?: boolean;
  backdropDismiss?: boolean;
  onExitComplete?: [
    "fired" | "completed" | undefined,
    Dispatch<SetStateAction<"fired" | "completed" | undefined>>
  ];
  ariaLabel?: string;
  backdropClassName?: string;
  keepCenter?: boolean;
};

export type ModalContentProps = HTMLAttributes<HTMLDivElement> & {
  handleClose?: () => void;
  ariaLabel?: string;
};

export type BackdropProps = HTMLAttributes<HTMLDivElement> & {
  handleClose?: () => void;
  keepCenter: boolean;
};
