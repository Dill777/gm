"use server";
import prisma from "@/lib/db";
import { getDomainId } from "@/lib/web3/service/domain";
import { DomainInfoType } from "@/lib/store/slices/profile";
import {
  NETWORKS,
  getChainByID,
  isChainSupported,
  mainnets,
} from "@/config/chains";
import { getAuthenticatedUser } from "../auth";
import { isEmpty } from "lodash";

export type DomainType = {
  domainName: string;
  chainId: NETWORKS;
};

// READ ONLY
export const findDomain = async (data: DomainType) => {
  const chain = getChainByID(data.chainId).chain;
  const domain = await prisma.domain.findFirst({
    where: { domainName: data.domainName, chain: chain, hasBurned: false },
  });

  return domain;
};

export const getDomain = async (data: DomainType, dId: number) => {
  const chain = getChainByID(data.chainId).chain;
  if (!isEmpty(data.domainName) && isChainSupported(data.chainId ?? 0)) {
    const domain = await prisma.domain.findFirst({
      where: { domainName: data.domainName, chain: chain, hasBurned: false },
    });
    if (domain) {
      return domain;
    } else {
      return await _createDomain(data, dId);
    }
  }
  return null;
};

export const fetchDomain = async (
  data: DomainType,
  domainInfo?: DomainInfoType
) => {
  const chain = getChainByID(data.chainId).chain;

  try {
    const domain = await prisma.domain.findFirst({
      where: { domainName: data.domainName, chain: chain, hasBurned: false },
      include: {
        following: {
          select: {
            toId: true,
            to: {
              select: { id: true, domainName: true, dId: true, chain: true },
            },
          },
        },
        followers: {
          select: {
            fromId: true,
            from: {
              select: { id: true, domainName: true, dId: true, chain: true },
            },
          },
        },
      },
    });

    if (domain) {
      return { isError: false, error: null, data: domain };
    } else {
      // TODO
      const newDomain = await prisma.domain.create({
        data: {
          domainName: data.domainName,
          chain: chain,
          dId: domainInfo?.id?.toString(),
        },
        include: {
          following: {
            select: {
              toId: true,
              to: { select: { id: true, domainName: true, chain: true } },
            },
          },
          followers: {
            select: {
              fromId: true,
              from: { select: { id: true, domainName: true, chain: true } },
            },
          },
        },
      });
      return { isError: false, error: null, data: newDomain };
    }
  } catch (e) {
    console.error(e);
    return { isError: true, error: e, data: null };
  }
};

export const fetchRecentMintedDomain = async (mainnetOnly: boolean = false) => {
  try {
    const domain = await prisma.domain.findMany({
      where: {
        hasBurned: false,
        ...(mainnetOnly
          ? { chain: { in: mainnets.map((id) => getChainByID(id).chain) } }
          : {}),
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return domain;
  } catch (e) {
    console.error(e);
    return null;
  }
};

// PRIVATE ROUTER ONLY
export const createDomain = async (domains: DomainType[]) => {
  const user = await getAuthenticatedUser();
  if (user) {
    try {
      for (const index in domains) {
        const _domain = domains[index];

        const domain = await findDomain(_domain);

        if (!domain) {
          const domainId = Number(
            (await getDomainId(_domain.domainName, _domain.chainId)) as bigint
          );

          await _createDomain(_domain, domainId);
          await _createUriData(_domain, domainId);
        }
      }
      return { isError: false, error: null, data: true };
    } catch (e) {
      console.error(e);
      return { isError: true, error: "Error", data: null };
    }
  } else {
    return {
      isError: true,
      error: "You need to login for create Domain",
      data: null,
    };
  }
};

// Function to create domains without authentication check
export const createDomainWithoutAuth = async (domains: DomainType[]) => {
  try {
    for (const index in domains) {
      const _domain = domains[index];

      const domain = await findDomain(_domain);

      if (!domain) {
        const domainId = Number(
          (await getDomainId(_domain.domainName, _domain.chainId)) as bigint
        );

        await _createDomain(_domain, domainId);
        await _createUriData(_domain, domainId);
      }
    }
    return { isError: false, error: null, data: true };
  } catch (e) {
    console.error(e);
    return { isError: true, error: "Error", data: null };
  }
};

//
export const _createDomain = async (domain: DomainType, domainId: number) => {
  const chain = getChainByID(domain.chainId).chain;

  return await prisma.domain.create({
    data: {
      chain: chain,
      domainName: domain.domainName,
      dId: domainId.toString(),
    },
  });
};
export const _createUriData = async (_domain: DomainType, domainId: number) => {
  const data = { chain: _domain.chainId, id: domainId };

  try {
    const res = await fetch("https://api.znsconnect.io/v1/create-metadata", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return { isError: false, error: null, data: await res.json() };
  } catch (e) {
    return { isError: true, error: e, data: null };
  }
};
