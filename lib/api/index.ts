"use server";

import prisma from "../db";
import { NETWORKS } from "@/config/chains";

interface Domain {
  id: string;
  domainName: string;
  tokenId: string;
  owner: string;
  expiry: string;
  chainId: string;
  isPrimary: boolean;
  eventContract: string;
}

export type StatisticType = {
  chain: NETWORKS;
  domain: string;
  name: string;
  data: Domain[];
  gifts: number;
};

export interface StatisticReturnType extends Omit<StatisticType, "data"> {
  chainId: string;
  chainName: string;
  chainDomain: string;
  domains: number;
  owner: number;
}

export const updateStatistics = async (data: StatisticReturnType) => {
  const _data = {
    chainDomain: data.chainDomain,
    gifts: data.gifts,
    chainName: data.chainName,
    domains: data.domains,
    chainId: Number(data.chainId),
    owner: data.owner,
    updatedAt: new Date(),
  };
  const statistic = await prisma.statistic.findFirst({
    where: {
      chainId: Number(data.chainId),
    },
  });

  if (statistic) {
    await prisma.statistic.update({
      data: _data,
      where: {
        id: statistic.id,
      },
    });
  } else {
    await prisma.statistic.create({
      data: _data,
    });
  }
};

export const fetchStatistic = async () => {
  const data = await fetch("https://znsconnect.io/api/stats", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return data.json();
};
