"use server";

import prisma from "@/lib/db";
import { HIP } from "@prisma/client";

export const mintHIP = async (walletAddress: string) => {
  // Create HIP entry first with initial points
  const hipItem = await prisma.hIP.findFirst({
    where: { walletAddress },
  });

  if (!hipItem) {
    const data = await prisma.hIP.create({
      data: {
        walletAddress,
        totalPoints: 300, // Initial points for minting
        totalEarnings: 0,
      },
    });
    return data;
  }
};

export const updateHIPReferral = async (refer: string, mintPrice: bigint) => {
  // First find the referral item to get its ID
  const referralItem = await prisma.referral.findFirst({
    where: {
      walletAddress: refer,
      chain: "INKMAINNET",
    },
  });

  // Convert bigint to number with 18 decimal places
  const mintPriceNumber = Number(mintPrice) / Math.pow(10, 18);
  const referralAmount = mintPriceNumber * 0.25; // 25% of the mint price

  if (!referralItem) {
    // Create new referral if not found
    const newReferral = await prisma.referral.create({
      data: {
        chain: "INKMAINNET",
        walletAddress: refer,
        numberOfReferrals: 1,
        totalEarnings: referralAmount,
      },
    });
    return newReferral.id;
  } else {
    await prisma.referral.update({
      data: {
        totalEarnings: {
          increment: referralAmount,
        },
      },
      where: {
        id: referralItem.id,
      },
    });

    return referralItem.id;
  }
};

export const getHIPByAddress = async (walletAddress: string) => {
  const hipItem = await prisma.hIP.findFirst({
    where: { walletAddress },
  });
  if (hipItem) {
    const totalPoints = calculateTotalPoints(hipItem);
    // Return both the item and calculated points
    return { ...hipItem, totalPoints };
  }
  return null;
};

export const updateHIPImage = async (id: string, mainImgUrl: string) => {
  const hipItem = await prisma.hIP.update({
    data: {
      mainImgUrl,
    },
    where: { id },
  });
  return hipItem;
};

export const updateHIPProfile = async (
  id: string,
  name: string,
  bio: string,
  position: string
) => {
  const hipItem = await prisma.hIP.update({
    data: {
      name,
      bio,
      position,
    },
    where: { id },
  });
  return hipItem;
};

export const updateHIP = async (id: string, data: Partial<HIP>) => {
  const hipItem = await prisma.hIP.update({
    data: {
      ...data,
    },
    where: { id },
  });
  return hipItem;
};

export const getAllHIPs = async () => {
  const hips = await prisma.hIP.findMany({
    orderBy: {
      totalPoints: "desc", // Sort by points in descending order
    },
  });

  // Calculate total points for each HIP
  const hipsWithCalculatedPoints = hips.map((hip) => ({
    ...hip,
    totalPoints: calculateTotalPoints(hip),
  }));

  return hipsWithCalculatedPoints;
};

const calculateTotalPoints = (hipData: HIP) => {
  let total = hipData.totalPoints;

  // Add points for each verified social account
  if (hipData.linkedinVerified) total += 10;
  if (hipData.discordVerified) total += 10;
  if (hipData.twitterVerified) total += 10;

  // Add other point categories
  total += hipData.referralPoints || 0;
  total += hipData.domainPoints || 0;
  total += hipData.nftPoints || 0;

  return total;
};
