"use client";
import React, { useMemo } from "react";
import { toast } from "react-toastify";
import { MdFavoriteBorder, MdOutlineFavorite } from "react-icons/md";
import { Button } from "@/ui/components/button";
import Loading from "@/ui/components/loading";
import { useTLD } from "@/ui/hooks/useTLD";
import useFavourite from "@/ui/hooks/useFavourite";
import { useDomain } from "@/lib/web3/hooks/useDomain";
import { cartDomain } from "@/lib/store/slices/setting";
import { Domain } from "@/lib/model/domain";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { useClientRender } from "@/utils/hooks/useClientRender";
import DomainAvatar from "../domain-avatar";
import DomainText from "../domain-text";
import { cn, formatPrice } from "@/utils";

const DomainComponent = (
  { domainName = "", chainId, rowIndex }: Domain // price
) => {
  const dispatch = useAppDispatch();
  const { carts } = useAppSelector((state) => state.setting);
  const tld = useTLD(chainId);
  const {
    id: domainId,
    price,
    symbol,
    isLoading,
  } = useDomain(domainName, chainId);

  const isClient = useClientRender();
  const fullDomain = useMemo(() => `${domainName}.${tld}`, [domainName, tld]);
  const domainData = useMemo(
    () => ({ domainName, chainId }),
    [domainName, chainId]
  );

  const { isFavourite, onFavourite } = useFavourite(domainData);

  const profileLink = useMemo(() => {
    return `/${fullDomain}`;
  }, [fullDomain]);

  const isCarted = useMemo(
    () =>
      carts.filter(
        (item) => item.domainName === domainName && item.chainId === chainId
      ).length !== 0,
    [carts, domainName]
  );

  const onAddCart = () => {
    if (fullDomain === "") return;
    toast.success("Added to your cart");
    dispatch(cartDomain(domainData));
  };

  const onDeleteCart = () => {
    if (fullDomain === "") return;
    toast.error("Removed from your cart");
    dispatch(cartDomain(domainData));
  };

  return (
    <div
      className={cn(
        "relative",
        "flex items-center justify-between self-stretch h-[84px]",
        "rounded-[20px] border border-stroke bg-[rgba(16,16,16,0.50)] hover:bg-main-100",
        "px-5 py-3 tablet:px-3 tablet:py-5 tablet:flex-col tablet:justify-between tablet:h-[128px]"
      )}
    >
      <div className="flex items-center h-full gap-2 tablet:self-stretch tablet:h-fit">
        <p className="font-space_mono text-base font-bold text-[#858584] p-[4px_10px] w-8 h-8 tablet:hidden">
          {rowIndex}
        </p>
        <div className="flex items-center gap-4 tablet:w-full tablet:justify-between">
          <DomainAvatar
            chainId={chainId}
            domainId={domainId}
            className="w-[36px] h-[36px] tablet:hidden"
          />
          <div className="flex items-center gap-2">
            <DomainAvatar
              chainId={chainId}
              domainId={domainId}
              className={cn("w-6 h-6 tablet:block hidden")}
            />
            <p className="max-w-[340px] text-[22px] tablet:text-xl font-medium break-all">
              <DomainText
                chainId={chainId}
                domainName={domainName}
                useChainColor={true}
              />
            </p>
          </div>
          <button onClick={onFavourite} className={cn("hidden tablet:block")}>
            {!isClient ? (
              <></>
            ) : !isLoading && isFavourite ? (
              <MdOutlineFavorite className="w-6 h-6 text-primary" />
            ) : (
              <MdFavoriteBorder className="w-6 h-6 text-primary" />
            )}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "flex items-center justify-end self-stretch",
          "tablet:justify-between"
        )}
      >
        <Loading loading={isLoading}>
          <div
            className={cn(
              "mr-[40px] min-w-[100px] flex flex-col gap-0 items-end",
              "tablet:items-start"
            )}
          >
            <p className="text-text_normal text-base font-medium">
              {`${formatPrice(Number(price))} ${symbol}`}
            </p>
            {/* <p className="text-text_body text-xs font-medium">{`$3.01`}</p> */}
          </div>
        </Loading>

        {!isClient || isLoading ? (
          <div className="w-[100px]"></div>
        ) : Number(domainId) ? (
          <Button
            size="sm"
            variant="success"
            href={profileLink}
            className={cn(
              "border border-[#698902] rounded-[14px] h-[39px]",
              "bg-transparent text-[#698902] text-xs",
              "w-[100px] p-0"
            )}
          >
            View Profile
          </Button>
        ) : isCarted ? (
          <Button
            size="sm"
            variant="success"
            onClick={onDeleteCart}
            className={cn(
              "border border-[#698902] bg-transparent text-[#698902]",
              "rounded-[14px] w-[116px] h-[39px] text-xs p-0"
            )}
          >
            Added
          </Button>
        ) : (
          <Button
            size="sm"
            variant="success"
            onClick={onAddCart}
            className={cn(
              "border border-primary bg-primary text-bg ",
              "rounded-[14px] w-[116px] h-[39px] text-xs p-0"
            )}
          >
            Add to cart
          </Button>
        )}

        <button onClick={onFavourite} className={cn("ml-4 tablet:hidden")}>
          {!isClient ? (
            <></>
          ) : !isLoading && isFavourite ? (
            <MdOutlineFavorite className="w-6 h-6 text-primary" />
          ) : (
            <MdFavoriteBorder className="w-6 h-6 text-primary" />
          )}
        </button>
      </div>
    </div>
  );
};

export const DomainItem = React.memo<Domain>(
  ({ domainName, chainId, rowIndex }) => {
    return (
      <DomainComponent
        domainName={domainName}
        chainId={chainId}
        rowIndex={rowIndex}
      />
    );
  },
  (prevProps, nextProps) => {
    // Return true if props are equal, preventing re-render
    return (
      prevProps.domainName === nextProps.domainName &&
      prevProps.chainId === nextProps.chainId &&
      prevProps.rowIndex === nextProps.rowIndex
    );
  }
);
