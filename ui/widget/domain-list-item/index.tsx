import React, { FC, useMemo, useState } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import Modal from "@/ui/components/modal";
import { Button } from "@/ui/components/button";
import { useTLD } from "@/ui/hooks/useTLD";
import { cn } from "@/utils";
import { shortenWalletAddress2 } from "@/utils/string-helper";
import { formatExpirationDate } from "@/utils/date-helper";
import DomainText from "../domain-text";
import DomainAvatar from "../domain-avatar";
import DomainItemModal from "./domain-item-modal";
import { UserDomainType } from "@/lib/store/slices/user-domains";
import { ProfileEditIcon } from "@/ui/components/icon/ProfileEditIcon";
import { useAppSelector } from "@/lib/store";

type DomainListItemProps = {
  data: UserDomainType;
  idx: number;
};
const DomainListItem: FC<DomainListItemProps> = ({ data, idx }) => {
  const {
    domainName,
    domainId,
    chainId,
    isPrimary /* : _isPrimary */,
    owner,
    expirationDate,
  } = data;

  /* const { userPrimaryDomain } = useAppSelector((state) => state.user);

  const isPrimary = useMemo(
    () => userPrimaryDomain?.domainName === domainName,
    [userPrimaryDomain, domainName]
  ); */

  const [isOpenModal, setIsOpenModal] = useState(false);
  const tld = useTLD(data.chainId);

  const handleModalOpen = () => {
    setIsOpenModal(!isOpenModal);
  };

  const registrantAddress = useMemo(
    () => shortenWalletAddress2(owner, 7),
    [owner]
  );
  const domainExpirationDate = useMemo(
    () => formatExpirationDate(expirationDate, false),
    [expirationDate]
  );

  return (
    <div
      className={cn(
        "flex items-center px-5 space-x-3 rounded-[20px] bg-[rgba(16,16,16,0.50)] hover:bg-main-100",
        "h-[84px]",
        "tablet:p-[22px_14px_22px_1.5px]",
        isPrimary ? "tablet:border-[0.5px] border-verified/60 " : ""
      )}
    >
      <div
        className={cn(
          "flex flex-1 items-center justify-between relative py-2 gap-2 cursor-pointer",
          "small:gap-0"
        )}
        onClick={handleModalOpen}
      >
        <div
          className={cn(
            "w-8 h-8 text-[#858584] flex items-center justify-center font-space-mono text-base small:text-sm font-extrabold leading-[140%]",
            "small:w-6"
          )}
        >
          {idx + 1}
        </div>
        <div className="flex items-center justify-start flex-1">
          <div className="flex items-center space-x-4 mobile:space-x-2">
            <DomainAvatar
              chainId={chainId}
              domainId={domainId}
              className="w-[45px] h-[45px] tablet:w-9 tablet:h-9"
            />

            <p
              className={cn(
                "text-white font-poppins text-[22px] font-medium leading-[140%] truncate",
                "laptop:text-xl tablet:text-base ",
                "desktop:max-w-[300px] mobile_md:max-w-[150px]"
              )}
            >
              <DomainText
                chainId={chainId}
                domainName={domainName}
                useChainColor={false}
              />
            </p>

            {isPrimary && (
              <div className="tablet:hidden inline-flex text-center items-center border-[0.5px] border-verified/60 rounded-xl text-xs font-medium px-2 py-[2px]">
                Primary
              </div>
            )}
          </div>
        </div>

        <p className="w-[135px] text-base font-medium laptop:hidden text-right">
          {registrantAddress}
        </p>
        <p className="w-[130px] text-base font-medium tablet:hidden text-center">
          {domainExpirationDate}
        </p>
      </div>
      <div className="flex items-center justify-end w-24 mobile:w-10">
        <Button
          // href={`/manage/${domainName}.${tld}?manage=true`}
          href={`/${domainName}.${tld}?manage=true`}
          // onClick={handleModalOpen}
          variant="outline"
          size="none"
          className="rounded-[14px] px-5 py-[10.5px] hover:opacity-90 text-xs border-[#698902] text-[#698902]"
        >
          <ProfileEditIcon className="w-[14px] h-[14px]" />
          <span className="ml-1">Edit</span>
        </Button>
      </div>
      <Modal isOpen={isOpenModal} handleClose={handleModalOpen}>
        <DomainItemModal data={{ ...data, isPrimary }} />
      </Modal>
    </div>
  );
};

export { default as LoadingDomainItem } from "./loading-item";
export default DomainListItem;
