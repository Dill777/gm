"use client";

import React from "react";
import { useAccount } from "wagmi";
import { usePathname } from "next/navigation";
import { MdCancel } from "react-icons/md";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Link from "@/ui/components/link";
import Image from "@/ui/components/image";
import Container from "@/ui/components/container";
import { HEADER_MENU_LIST } from "@/utils/constant";

type MenuProps = { showMenu: boolean; setShowMenu: (value: boolean) => void };
const MobileMenu: React.FC<MenuProps> = ({ showMenu, setShowMenu }) => {
  const pathname = usePathname();
  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const handleClose = () => setShowMenu(!showMenu);

  const connectWallet = () => {
    handleClose();
    openConnectModal && openConnectModal();
  };

  return (
    <div
      className={`!m-0 fixed h-full w-full py-4 transition-all duration-300 z-[500] left-0 top-0 bg-black/60 ${
        showMenu
          ? "visible opacity-100 backdrop-blur-2xl"
          : "invisible opacity-0"
      }`}
    >
      <Container>
        <div className="flex flex-col justify-between h-full">
          <div className="flex flex-col space-y-5">
            <div className="flex items-center justify-between pb-5">
              <Link href="/" onClick={handleClose} className="cursor-pointer">
                <Image
                  src="/img/cheap-logo.png"
                  alt="CheapGM logo"
                  width={48}
                  height={48}
                />
              </Link>

              <button onClick={handleClose}>
                <MdCancel className="w-[35px] h-[35px] mobile:w-[30px] mobile:h-[30px]" />
              </button>
            </div>
            {!address && (
              <button
                onClick={connectWallet}
                className={`text-primary text-xl mobile:text-base font-normal cursor-pointer border border-primary rounded-lg py-2 text-center`}
              >
                Connect Wallet
              </button>
            )}
          </div>

          <div className="flex flex-col space-y-5">
            {HEADER_MENU_LIST.map((menu, index) => {
              return (
                <Link
                  key={`navbar_menu_${index}`}
                  href={menu.link}
                  onClick={handleClose}
                  newTab={menu.external}
                  className={`animated-border relative hover:text-primary/50 ${
                    pathname === menu.link
                      ? "text-primary text-2xl mobile:text-lg font-bold"
                      : "text-xl mobile:text-base font-normal"
                  } cursor-pointer`}
                >
                  {menu.name}
                </Link>
              );
            })}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default MobileMenu;
