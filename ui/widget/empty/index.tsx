import React, { FC } from "react";
import { MdOutlineSearch } from "react-icons/md";
import { cn } from "@/utils";
import { Button } from "@/ui/components/button";
import Image from "@/ui/components/image";
import { SearchIcon } from "@/ui/components/icon/SearchIcon";
import Link from "@/ui/components/link";

type EmptyStatusProps = {
  title?: string;
  searchButton?: boolean;
  icon?: "gift" | "domain" | "favorite";
  content?: React.ReactNode;
} & ComponentProps;

const iconMap = {
  gift: (
    <Image
      src="/img/empty/gift.png"
      alt=""
      width={80}
      height={80}
      className="w-20 h-20 mobile:w-[64px] mobile:h-[64px]"
    />
  ),
  domain: (
    <Image
      src="/img/empty/domain.png"
      alt=""
      width={80}
      height={80}
      className="w-20 h-20 mobile:w-[64px] mobile:h-[64px]"
    />
  ),
  favorite: (
    <Image
      src="/img/empty/favorite.png"
      alt=""
      width={80}
      height={80}
      className="w-20 h-20 mobile:w-[64px] mobile:h-[64px]"
    />
  ),
};

const EmptyStatus: FC<EmptyStatusProps> = ({
  title,
  className,
  searchButton = true,
  content,
  icon,
}) => {
  return (
    <div
      className={cn(
        "w-full mt-11 mb-4 inline-flex flex-col justify-center items-center",
        className
      )}
    >
      {/* search icon */}
      {searchButton && (
        <div className="flex w-[48px] h-[48px] p-[12px] justify-center items-center rounded-full outline outline-[12px] outline-[rgba(26,26,26,0.73)] bg-[#1A1A1A]">
          <Link href="/search">
            <SearchIcon className="w-6 h-6" />
          </Link>
        </div>
      )}

      <div className="flex flex-col items-center mt-4 mb-1">
        {icon && iconMap[icon]}
        <p className="text-[#F4F4F5] font-poppins text-xl font-medium leading-[30px]">
          {title}
        </p>
      </div>

      {content}

      {false && searchButton && (
        <Button
          variant="outline"
          className="space-x-1 mobile:border-none mobile:py-2"
          href="/search"
          size="nm"
        >
          <MdOutlineSearch className="w-5 h-5" />
          <span>Search your domains</span>
        </Button>
      )}
    </div>
  );
};

export default EmptyStatus;
