"use client";
import React, { FC, useCallback, useState } from "react";
import { LuMinus, LuPlus } from "react-icons/lu";
import { RiDeleteBin5Line } from "react-icons/ri";
import { cartDomain, handleDomainPeriod } from "@/lib/store/slices/setting";
import { useAppDispatch } from "@/lib/store";
import {
  CartDomainType,
  handleCartDomainPeriod,
  removeCartDomain,
} from "@/lib/store/slices/cart";
import { cn, formatPrice, getSanitizedValue } from "@/utils";
import DomainText from "../domain-text";
import Tooltip from "@/ui/components/tooltip";
import { useTLD } from "@/ui/hooks/useTLD";
import Modal from "@/ui/components/modal";
import { Button } from "@/ui/components/button";

type DomainCartItemProps = { data: CartDomainType };

const DomainCartItem: FC<DomainCartItemProps> = ({ data }) => {
  const dispatch = useAppDispatch();
  const { id: domainId, price, domainName, chainId, year, symbol } = data;
  const tld = useTLD(chainId);
  const handlePeriod = (isAdd: boolean, amount?: number) => {
    dispatch(handleDomainPeriod({ ...data, isAdd, updateAmount: amount }));
    dispatch(handleCartDomainPeriod({ ...data, isAdd, updateAmount: amount }));
  };

  const removeItem = () => {
    dispatch(cartDomain(data));
    dispatch(removeCartDomain(data));
    handleModalOpen();
  };

  const onYearChange = useCallback((value: string) => {
    const amount = getSanitizedValue(value, 1);
    handlePeriod(true, amount);
  }, []);

  const [isOpenModal, setIsOpenModal] = useState(false);
  const handleModalOpen = () => setIsOpenModal((prev) => !prev);

  return (
    <div
      className={cn(
        "flex items-center justify-between",
        "p-[20px_26px] rounded-[15px] border-[1px] border-stroke border-opacity-80 bg-[rgba(16,16,16,0.70)]",
        "tablet:flex-col tablet:p-[20px_12px] tablet:gap-[23px]"
      )}
    >
      <div
        className={cn(
          "w-[260px] flex items-center justify-between",
          "tablet:w-full"
        )}
      >
        <Tooltip
          content={`${domainName}.${tld}`}
          className="bottom-full -right-2"
        >
          <p className="text-xl small:flex-1 font-medium w-[140px] break-all">
            <DomainText domainName={domainName} chainId={chainId} />
          </p>
        </Tooltip>

        {Number(domainId) ? (
          <p
            className={cn(
              "flex w-[86] h-[26px] px-[14px] justify-center items-center gap-[10px] rounded-[7px] border-[0.5px] border-[rgba(255,87,34,0.60)] bg-[rgba(255,87,34,0.10)]",
              "text-[rgba(255,87,34,0.68)] font-poppins text-xs font-medium leading-[160%] capitalize",
              "cursor-pointer"
            )}
          >
            Not Avaliable
          </p>
        ) : (
          <p
            className={cn(
              "flex w-[86px] h-[26px] px-[14px] justify-center items-center gap-[10px] rounded-[7px] border-[0.5px] border-[rgba(5,171,255,0.60)] bg-[rgba(5,171,255,0.10)]",
              "text-[rgba(5,171,255,0.68)] font-poppins text-xs font-medium leading-[160%] capitalize",
              "cursor-pointer"
            )}
          >
            Avaliable
          </p>
        )}

        <RiDeleteBin5Line
          onClick={handleModalOpen}
          className={cn(
            "w-5 h-5 text-danger/60 hover:text-danger cursor-pointer",
            "hidden tablet:block"
          )}
        />
      </div>
      <div
        className={cn(
          "flex items-center gap-[29px]",
          "tablet:self-stretch tablet:justify-between"
        )}
      >
        <div className="flex flex-col items-end tablet:items-start w-max">
          <p className="text-base text-[#F4F4F5] font-medium">
            {`${formatPrice(Number(price))} ${symbol}`}
          </p>
          {/* <p className="text-xs text-text_body font-medium">{"$3.01"}</p> */}
        </div>

        <div className="flex items-center justify-between w-[124px]">
          <button
            className={"flex items-center justify-center w-[23px] h-[23px]"}
            onClick={() => handlePeriod(false)}
          >
            <LuMinus className="w-[12px] h-[12px] text-white fill-white stroke-white" />
          </button>
          <div className="flex items-center rounded-lg border border-main-300 p-[6px_12px]">
            <input
              placeholder="0"
              value={year}
              onChange={(e) => onYearChange(e.target.value)}
              className={cn(
                "text-xs placeholder:text-center placeholder:text-white-500",
                "w-3 h-full outline-none bg-transparent text-center"
              )}
            />
            <div className="text-xs font-medium text-white-700">{`Year`}</div>
          </div>
          <button
            className={"flex items-center justify-center w-[23px] h-[23px]"}
            onClick={() => handlePeriod(true)}
          >
            <LuPlus className="w-[12px] h-[12px] text-white" />
          </button>
        </div>

        <RiDeleteBin5Line
          onClick={handleModalOpen}
          className={cn(
            "w-5 h-5 text-danger/60 hover:text-danger cursor-pointer",
            "tablet:hidden"
          )}
        />

        <Modal
          isOpen={isOpenModal}
          handleClose={handleModalOpen}
          hideCloseButton={true}
        >
          <div
            className={cn(
              "inline-flex p-[40px] flex-col justify-center items-center gap-6 rounded-[24px] border-2 border-stroke border-opacity-80 bg-black shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]",
              "tablet:p-[40px_10px] tablet:mx-[16px]"
            )}
          >
            <div className="flex h-[124px] px-[20px] py-[16px] flex-col justify-center items-center gap-[12px] rounded-[10px] bg-[#101010]">
              <p className="text-[#F4F4F5] text-center font-inter text-2xl tablet:text-lg font-medium leading-normal">
                Remove from cart?
              </p>
              <p className="text-text_body text-center font-poppins text-sm font-normal leading-[150%]">
                The selected domain will be removed from cart
              </p>
            </div>
            <div className="flex items-center justify-center gap-4">
              <Button
                className="flex w-[159px] h-[50px] px-[30px] justify-center items-center gap-[5px] flex-shrink-0 rounded-[14px] bg-[#C9FC01] text-base"
                onClick={handleModalOpen}
              >
                No
              </Button>
              <Button
                className="flex w-[159px] h-[50px] px-[30px] justify-center items-center text-[#FF0505] font-poppins text-sm font-normal leading-[150%] bg-transparent border-none outline-none"
                onClick={removeItem}
              >
                Remove
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default DomainCartItem;
