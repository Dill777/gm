"use client";
import { CHAIN_IDS, mainnets, NETWORKS } from "@/config/chains";
import React, { FC, useEffect, useMemo, useState } from "react";
import ChainLogo from "../chain-logo";
import { tlds } from "@/config/tld";
import Switch from "@/ui/components/switch";
import { cn } from "@/utils";
import Badge from "@/ui/components/badge";
import _ from "lodash";

type ChainSelectProps = {
  chains?: NETWORKS[];
  chainData?: { chainId: NETWORKS; data: number | string }[];
  value?: NETWORKS;
  onSelect?: (chainId: NETWORKS) => void;
  onNetworkSelect?: (network: "mainnet" | "testnet", inside: boolean) => void;
  noNetworkFilter?: boolean;
};

const ChainSelect: FC<ChainSelectProps> = ({
  value,
  onSelect,
  onNetworkSelect,
  chains,
  chainData,
  noNetworkFilter = false,
}) => {
  const [isMainnet, setIsMainnet] = useState<boolean>(true);
  const networks = useMemo(() => (chains ? chains : CHAIN_IDS), [chains]);
  const handleSwitchChange = (newState: boolean, inside = false) => {
    if (newState) {
      onNetworkSelect && onNetworkSelect("mainnet", inside);
    } else {
      onNetworkSelect && onNetworkSelect("testnet", inside);
    }
    setIsMainnet(newState);
  };

  useEffect(() => {
    if (value && CHAIN_IDS.includes(value) && !noNetworkFilter) {
      const isMainnetBySelected = mainnets.includes(value);
      if (isMainnetBySelected !== isMainnet) {
        handleSwitchChange(isMainnetBySelected, true);
      }
    }
  }, [value]);

  const onChainSelect = (chainId: NETWORKS) => {
    onSelect && onSelect(chainId);
  };

  const processedNetworks = useMemo(() => {
    const chainOrder = Object.values(NETWORKS);

    const filteredNetworks = noNetworkFilter
      ? networks
      : networks.filter((item) => isMainnet === mainnets.includes(item));

    return filteredNetworks.sort(
      (a, b) => chainOrder.indexOf(a) - chainOrder.indexOf(b)
    );
  }, [networks, noNetworkFilter, isMainnet]);

  const getChainData = (chainId: NETWORKS) => {
    const chainInfo = _.find(chainData, { chainId });
    return chainInfo ? chainInfo.data : 0;
  };

  return (
    <div
      className={cn(
        // !noNetworkFilter && "space-y-3",
        "w-full self-stretch flex flex-col items-start gap-4"
      )}
    >
      {!noNetworkFilter && (
        <Switch
          labelT="Mainnet"
          labelF="Testnet"
          value={isMainnet}
          onChange={handleSwitchChange}
        />
      )}
      <div className="w-full overflow-auto hide-scroll-bar flex flex-wrap gap-2 pt-2 pr-2 tablet:flex-nowrap">
        {processedNetworks.length < 1 ? (
          <div
            className={cn(
              "h-[42px] relative flex items-center space-x-4 border-main-300 border-[1.8px] rounded-xl px-4 py-1.5 w-fit cursor-pointer group",
              "mobile:space-x-0 mobile:px-1.5 mobile:justify-evenly"
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-main-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m2 4H7m8-8H9"
              />
            </svg>
            <p className={cn("text-base font-medium text-main-300")}>
              No Available Chain
            </p>
          </div>
        ) : (
          processedNetworks.map((chainId) => (
            <div
              key={`chain_selectItem_${chainId}`}
              onClick={() => onChainSelect(chainId)}
              className={cn(
                "relative flex items-center justify-between gap-2 px-3 py-[10px] w-fit min-w-max h-[44px] bg-[rgba(38,38,38,0.40)] border-[1px] border-[rgba(38,38,38,0.40)] rounded-xl cursor-pointer hover:border-primary group ",
                "mobile:space-x-0 mobile:px-1.5 mobile:justify-evenly",
                value === chainId && "border-primary"
              )}
            >
              <ChainLogo chainId={chainId} className="w-6 h-6" />
              <p
                className={cn(
                  "text-base font-medium group-hover:text-primary",
                  "tablet:text-xs"
                  // value === chainId && "text-primary"
                )}
              >
                .{tlds.find((tld) => tld.chainId === chainId)?.label ?? ""}
              </p>
              {chainData && (
                <Badge
                  size="md"
                  className="absolute -right-2 -top-2 text-white"
                >
                  {getChainData(chainId)}
                </Badge>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChainSelect;
