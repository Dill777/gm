"use server";

import prisma from "@/lib/db";
import { NETWORKS, getChainByID } from "@/config/chains";

export interface GMRecord {
  walletAddress: string;
  dId: string;
  chainId: NETWORKS;
}

export const saveGM = async (data: GMRecord) => {
  try {
    const chain = getChainByID(data.chainId).chain;

    const gmRecord = await prisma.gM.create({
      data: {
        walletAddress: data.walletAddress,
        dId: data.dId,
        chain: chain,
      },
    });

    return { isError: false, error: null, data: gmRecord };
  } catch (e) {
    console.error("Error saving GM record:", e);
    return { isError: true, error: "Failed to save GM record", data: null };
  }
};

export const getUserGMCount = async (
  walletAddress: string,
  chainId?: NETWORKS
) => {
  try {
    const whereClause: any = { walletAddress };

    if (chainId) {
      const chain = getChainByID(chainId).chain;
      whereClause.chain = chain;
    }

    const count = await prisma.gM.count({
      where: whereClause,
    });

    return { isError: false, error: null, data: count };
  } catch (e) {
    console.error("Error fetching GM count:", e);
    return { isError: true, error: "Failed to fetch GM count", data: 0 };
  }
};

// Check if user can send GM (24-hour cooldown)
export const canUserSendGM = async (
  walletAddress: string,
  chainId: NETWORKS
) => {
  try {
    const chain = getChainByID(chainId).chain;

    // Get the last GM for this user on this chain
    const lastGM = await prisma.gM.findFirst({
      where: {
        walletAddress,
        chain,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!lastGM) {
      // No previous GM, user can send
      return {
        isError: false,
        error: null,
        data: { canSend: true, timeRemaining: 0 },
      };
    }

    // Check if 24 hours have passed
    const now = new Date();
    const hoursDiff =
      (now.getTime() - lastGM.createdAt.getTime()) / (1000 * 60 * 60);
    const canSend = hoursDiff >= 24;
    const timeRemaining = canSend ? 0 : Math.ceil(24 - hoursDiff);

    return {
      isError: false,
      error: null,
      data: {
        canSend,
        timeRemaining,
        lastGM: lastGM.createdAt,
      },
    };
  } catch (e) {
    console.error("Error checking GM cooldown:", e);
    return {
      isError: true,
      error: "Failed to check GM cooldown",
      data: { canSend: false, timeRemaining: 24 },
    };
  }
};

export const getUserGMStats = async (
  walletAddress: string,
  chainId?: NETWORKS
) => {
  try {
    const whereClause: any = { walletAddress };

    if (chainId) {
      const chain = getChainByID(chainId).chain;
      whereClause.chain = chain;
    }

    // Get total count
    const totalCount = await prisma.gM.count({
      where: whereClause,
    });

    // Get today's count
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = await prisma.gM.count({
      where: {
        ...whereClause,
        createdAt: {
          gte: today,
        },
      },
    });

    // Get this week's count
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);
    const weekCount = await prisma.gM.count({
      where: {
        ...whereClause,
        createdAt: {
          gte: weekStart,
        },
      },
    });

    // Get last GM
    const lastGM = await prisma.gM.findFirst({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      isError: false,
      error: null,
      data: {
        totalCount,
        todayCount,
        weekCount,
        lastGM: lastGM?.createdAt || null,
        todayStatus: todayCount > 0,
      },
    };
  } catch (e) {
    console.error("Error fetching GM stats:", e);
    return {
      isError: true,
      error: "Failed to fetch GM stats",
      data: {
        totalCount: 0,
        todayCount: 0,
        weekCount: 0,
        lastGM: null,
        todayStatus: false,
      },
    };
  }
};

export const getAllUserGMStats = async (walletAddress: string) => {
  try {
    // Get stats across all chains
    const totalStats = await getUserGMStats(walletAddress);

    return {
      isError: false,
      error: null,
      data: totalStats.data,
    };
  } catch (e) {
    console.error("Error fetching all GM stats:", e);
    return {
      isError: true,
      error: "Failed to fetch GM stats",
      data: {
        totalCount: 0,
        todayCount: 0,
        weekCount: 0,
        lastGM: null,
        todayStatus: false,
      },
    };
  }
};
