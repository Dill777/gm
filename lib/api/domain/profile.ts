"use server";
import { Domain } from "@prisma/client";
import prisma from "@/lib/db";
import { ProfileAccountsType } from "@/lib/model/domain";
import {
  isDomainOwnerByDBID,
  isHIPOwnerByDBID,
  isDomainOwnerByAddress,
  isHIPOwnerByAddress,
} from "../auth";
import { getDomainId } from "@/lib/web3/service/domain";
import { Chain as PrismaChain } from "@prisma/client";
import { NETWORKS } from "@/config/chains";

// For bugs on INK MAINNET
export const syncOnchainDomainIdsForInk = async () => {
  try {
    const bugDomains = await prisma.domain.findMany({
      where: {
        chain: PrismaChain.INKMAINNET,
        dId: "0",
      },
      select: {
        id: true,
        domainName: true,
      },
    });
    console.log(bugDomains.length);

    await Promise.all(
      bugDomains.map(async (bugDomain) => {
        try {
          const domainId = Number(
            (await getDomainId(
              bugDomain.domainName,
              NETWORKS.INKMAINNET
            )) as bigint
          );
          await syncOnchainDomainId(bugDomain.id, domainId.toString());
          console.log(`Syned for ${bugDomain.domainName}`);
        } catch (error) {
          console.error(`Failed to sync for ${bugDomain.domainName}`);
        }
      })
    );

    return {
      isError: false,
      error: null,
      data: {},
    };
  } catch (e) {
    console.error(e);
    return { isError: true, error: "Error", data: null };
  }
};
export const syncOnchainDomainId = async (profileId: string, dId: string) => {
  try {
    const updatedDomain = await prisma.domain.update({
      where: {
        id: profileId,
      },
      data: {
        dId,
      },
    });
    return {
      isError: false,
      error: null,
      data: {
        ...updatedDomain,
      },
    };
  } catch (e) {
    console.error(e);
    return { isError: true, error: "Error", data: null };
  }
};

export const updateDomainProfile = async (
  profileId: string,
  data: Partial<Domain>
) => {
  const isOwner = await isDomainOwnerByDBID(profileId);
  try {
    if (isOwner) {
      const updatedDomain = await prisma.domain.update({
        where: {
          id: profileId,
        },
        data: {
          ...data,
        },
      });
      return {
        isError: false,
        error: null,
        data: {
          ...updatedDomain,
          createdAt: updatedDomain.createdAt.toDateString(),
        },
      };
    }
    return { isError: true, error: "Error", data: null };
  } catch (e) {
    console.error(e);
    return { isError: true, error: "Error", data: null };
  }
};

export const updateDomainProfileByAddress = async (
  profileId: string,
  data: Partial<Domain>,
  address: string
) => {
  const isOwner = await isDomainOwnerByAddress(profileId, address);
  try {
    if (isOwner) {
      const updatedDomain = await prisma.domain.update({
        where: {
          id: profileId,
        },
        data: {
          ...data,
        },
      });
      return {
        isError: false,
        error: null,
        data: {
          ...updatedDomain,
          createdAt: updatedDomain.createdAt.toDateString(),
        },
      };
    }
    return { isError: true, error: "Error", data: null };
  } catch (e) {
    console.error(e);
    return { isError: true, error: "Error", data: null };
  }
};

export const verifyAccount = async (
  profileId: string,
  account: keyof ProfileAccountsType,
  accountData: string
) => {
  const isOwner = await isDomainOwnerByDBID(profileId);
  if (isOwner) {
    try {
      const data = { [account]: accountData, [`${account}Verified`]: true };
      if (profileId) {
        await prisma.domain.update({
          where: {
            id: profileId,
          },
          data: {
            ...data,
          },
        });
        return { isError: false, error: null, data: true };
      }
      return { isError: true, error: "Error", data: null };
    } catch (e) {
      console.error(e);
      return { isError: true, error: "Error", data: null };
    }
  }
  const isHIPOwner = await isHIPOwnerByDBID(profileId);
  if (isHIPOwner) {
    try {
      const data = { [account]: accountData, [`${account}Verified`]: true };
      if (profileId) {
        await prisma.hIP.update({
          where: {
            id: profileId,
          },
          data: {
            ...data,
          },
        });
        return { isError: false, error: null, data: true };
      }
      return { isError: true, error: "Error", data: null };
    } catch (e) {
      console.error(e);
      return { isError: true, error: "Error", data: null };
    }
  }
  return { isError: true, error: "Error", data: null };
};

export const verifyAccountByAddress = async (
  profileId: string,
  account: keyof ProfileAccountsType,
  accountData: string,
  address: string
) => {
  const isOwner = await isDomainOwnerByAddress(profileId, address);
  if (isOwner) {
    try {
      const data = { [account]: accountData, [`${account}Verified`]: true };
      if (profileId) {
        await prisma.domain.update({
          where: {
            id: profileId,
          },
          data: {
            ...data,
          },
        });
        return { isError: false, error: null, data: true };
      }
      return { isError: true, error: "Error", data: null };
    } catch (e) {
      console.error(e);
      return { isError: true, error: "Error", data: null };
    }
  }
  const isHIPOwner = await isHIPOwnerByAddress(profileId, address);
  if (isHIPOwner) {
    try {
      const data = { [account]: accountData, [`${account}Verified`]: true };
      if (profileId) {
        await prisma.hIP.update({
          where: {
            id: profileId,
          },
          data: {
            ...data,
          },
        });
        return { isError: false, error: null, data: true };
      }
      return { isError: true, error: "Error", data: null };
    } catch (e) {
      console.error(e);
      return { isError: true, error: "Error", data: null };
    }
  }
  return { isError: true, error: "Error", data: null };
};

export const deleteVerifedAccount = async (
  profileId: string,
  account: keyof ProfileAccountsType
) => {
  const isOwner = await isDomainOwnerByDBID(profileId);
  if (isOwner) {
    try {
      const data = { [account]: "", [`${account}Verified`]: false };
      if (profileId) {
        await prisma.domain.update({
          where: {
            id: profileId,
          },
          data: {
            ...data,
          },
        });
        return { isError: false, error: null, data: true };
      }

      return { isError: true, error: "Error", data: null };
    } catch (e) {
      console.error(e);
      return { isError: true, error: "Error", data: null };
    }
  }
  const isHIPOwner = await isHIPOwnerByDBID(profileId);
  if (isHIPOwner) {
    try {
      const data = { [account]: "", [`${account}Verified`]: false };
      if (profileId) {
        await prisma.hIP.update({
          where: {
            id: profileId,
          },
          data: {
            ...data,
          },
        });
        return { isError: false, error: null, data: true };
      }
      return { isError: true, error: "Error", data: null };
    } catch (e) {
      console.error(e);
      return { isError: true, error: "Error", data: null };
    }
  }
  return { isError: true, error: "Error", data: null };
};

export const deleteVerifedAccountByAddress = async (
  profileId: string,
  account: keyof ProfileAccountsType,
  address: string
) => {
  const isOwner = await isDomainOwnerByAddress(profileId, address);
  if (isOwner) {
    try {
      const data = { [account]: "", [`${account}Verified`]: false };
      if (profileId) {
        await prisma.domain.update({
          where: {
            id: profileId,
          },
          data: {
            ...data,
          },
        });
        return { isError: false, error: null, data: true };
      }

      return { isError: true, error: "Error", data: null };
    } catch (e) {
      console.error(e);
      return { isError: true, error: "Error", data: null };
    }
  }
  const isHIPOwner = await isHIPOwnerByAddress(profileId, address);
  if (isHIPOwner) {
    try {
      const data = { [account]: "", [`${account}Verified`]: false };
      if (profileId) {
        await prisma.hIP.update({
          where: {
            id: profileId,
          },
          data: {
            ...data,
          },
        });
        return { isError: false, error: null, data: true };
      }
      return { isError: true, error: "Error", data: null };
    } catch (e) {
      console.error(e);
      return { isError: true, error: "Error", data: null };
    }
  }
  return { isError: true, error: "Error", data: null };
};

export const updateDomainAvatar = async (
  profileId: string,
  avatarUrl: string
) => {
  try {
    if (profileId) {
      await prisma.domain.update({
        where: {
          id: profileId,
        },
        data: {
          mainImgUrl: avatarUrl,
        },
      });
      return { isError: false, error: null, data: true };
    }

    return { isError: true, error: "Error", data: null };
  } catch (e) {
    console.error(e);
    return { isError: true, error: "Error", data: null };
  }
};

export const followDomain = async (domainId: string, userPDomainId: string) => {
  const isOwner = await isDomainOwnerByDBID(userPDomainId);
  if (isOwner) {
    const followedItem = await prisma.follow.findFirst({
      where: { fromId: userPDomainId, toId: domainId },
    });

    if (followedItem) {
      await prisma.follow.delete({
        where: { id: followedItem.id },
      });
    } else {
      await prisma.follow.create({
        data: { fromId: userPDomainId, toId: domainId },
      });
    }
  }
  return { isError: false, error: "", data: true };
};

export const followDomainWithAddress = async (
  domainId: string,
  userPDomainId: string,
  address: string
) => {
  const isOwner = await isDomainOwnerByAddress(userPDomainId, address);
  if (isOwner) {
    const followedItem = await prisma.follow.findFirst({
      where: { fromId: userPDomainId, toId: domainId },
    });

    if (followedItem) {
      await prisma.follow.delete({
        where: { id: followedItem.id },
      });
    } else {
      await prisma.follow.create({
        data: { fromId: userPDomainId, toId: domainId },
      });
    }
  }
  return { isError: false, error: "", data: true };
};
