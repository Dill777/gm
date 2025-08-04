import { twMerge } from "tailwind-merge";

// import type { IconType } from "react-icons";
import { AiOutlineUser as User } from "react-icons/ai";
import { BiWallet as Wallet } from "react-icons/bi";
import {
  FaRegFileAlt as File,
  FaTelegramPlane as Telegram,
  FaYoutube as Youtube,
} from "react-icons/fa";
import {
  FaDiscord as Discord,
  FaMedium as Medium,
  FaXTwitter as Twitter,
  FaLinkedinIn as Linkedin,
} from "react-icons/fa6";
import { FiArrowRight as Right, FiX as Close } from "react-icons/fi";
import { GoDeviceDesktop as Device } from "react-icons/go";
import { HiLink as Link, HiMenu as Menu } from "react-icons/hi";
import {
  RxArrowTopRight as External,
  RxPencil2 as Pencil,
} from "react-icons/rx";
import { TbSearch as Search } from "react-icons/tb";
import { TfiRulerAlt2 as Ruler } from "react-icons/tfi";
import { VscGlobe as Global } from "react-icons/vsc";

import type { ButtonProps } from "../button";

const icons = {
  close: Close,
  device: Device,
  external: External,
  file: File,
  link: Link,
  menu: Menu,
  pencil: Pencil,
  right: Right,
  ruler: Ruler,
  search: Search,
  user: User,
  wallet: Wallet,

  // socials
  global: Global,
  twitter: Twitter,
  discord: Discord,
  telegram: Telegram,
  medium: Medium,
  youtube: Youtube,
  linkedin: Linkedin,
};

export interface IconProps extends ComponentProps, Pick<ButtonProps, "action"> {
  name: keyof typeof icons;
  size: number;
}

export type SVGProps = { className?: string };

export default function Icon({ name, size, action, className }: IconProps) {
  if (!icons[name]) {
    // Optionally, return a default icon or null if the icon is not found
    return null;
  }

  const NextIcon = icons[name];

  return (
    <NextIcon size={size} onClick={action} className={twMerge("", className)} />
  );
}
