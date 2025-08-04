import React, { FC, useMemo } from "react";
import { MdOutlineSettings, MdRemoveRedEye } from "react-icons/md";
import Link from "@/ui/components/link";
import { useTLD } from "@/ui/hooks/useTLD";
import { UserDomainType } from "@/lib/store/slices/user-domains";

const ItemMenu: FC<{ data: UserDomainType }> = ({ data }) => {
  const tld = useTLD(data.chainId);
  const domainName = useMemo(() => data.domainName, [data]);

  return (
    <div className="bg-main-100 rounded-xl p-2 space-y-1">
      <Link
        href={`/${domainName}.${tld}`}
        className="flex items-center space-x-2 bg-black py-2 px-3 flex-1 rounded-lg cursor-pointer"
      >
        <MdRemoveRedEye className="w-[16px] h-[16px]" />
        <p className="font-medium">Profile</p>
      </Link>
      <Link
        href={`/manage/${domainName}.${tld}`}
        className="flex items-center space-x-2 bg-black p-2 flex-1 rounded-lg cursor-pointer"
      >
        <MdOutlineSettings className="w-[16px] h-[16px]" />
        <p className="font-medium">Manage</p>
      </Link>
    </div>
  );
};

export default ItemMenu;
