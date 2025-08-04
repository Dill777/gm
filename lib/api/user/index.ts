"use server";
import { isEmpty } from "lodash";
import prisma from "@/lib/db";
import { getAuthenticatedUser } from "../auth";
import { generateReferralCode } from "@/utils/generateReferralCode";

// READ ONLY
const getReferralUserByCode = async (referral?: string) => {
  if (referral) {
    const referralUser = await prisma.user.findFirst({
      where: { referralCode: referral },
    });
    return referralUser?.walletAddress ?? "";
  }
  return "";
};

export const findUserByAddress = async (walletAddress: string) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        walletAddress,
      },
    });
    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    console.error("Error finding User:", error);
    return null;
  }
};

export const getUser = async (walletAddress: string) => {
  if (!walletAddress) return null;
  try {
    const user = await findUserByAddress(walletAddress);
    if (!user) {
      const newUser = await prisma.user.create({
        data: {
          walletAddress,
          referralCode: generateReferralCode(walletAddress),
        },
      });
      return newUser;
    }
    return user;
  } catch (error) {
    console.error("Error Creating User:", error);
    return null;
  }
};

// CREADT & UPDATE
export const getOrCreateUserIdByAddress = async (walletAddress: string) => {
  try {
    // FIND USER BY ADDRESS
    const user = await prisma.user.findFirst({
      where: {
        walletAddress,
      },
      select: {
        id: true,
      },
    });
    // IF USER DOES NOT EXIST, CREATE NEW USER
    if (!user) {
      const newUser = await prisma.user.create({
        data: {
          walletAddress,
          referralCode: generateReferralCode(walletAddress),
        },
        select: {
          id: true,
        },
      });
      return newUser.id;
    } else {
      // ELSE Return User ID
      return user.id;
    }
  } catch (error) {
    return null;
  }
};

// BACKEND SIDE PROTECTED
export const setEmail = async (userId: string, email: string) => {
  if (userId) {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        email: email,
        verified: true,
      },
    });
    return { isError: false, error: null, data: true };
  }
};

// PRIVATE ROUTER ONLY
export const getCurrentUser = async () => {
  // Fetch the user's address from the session
  const user = await getAuthenticatedUser();
  if (user) {
    return prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });
  } else {
    return null;
  }
};

// PRIVATE ROUTER ONLY
export const updateReferCode = async (referCode: string) => {
  const user = await getAuthenticatedUser();
  if (user && referCode) {
    const referAddress = await getReferralUserByCode(referCode);
    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (isEmpty(currentUser?.refer) || currentUser?.refer === user.address) {
      await prisma.user.update({
        data: {
          refer: referAddress,
        },
        where: { id: user.id },
      });
    }
  }
};

// API SYNC
export const getUsers = async () => {
  return await prisma.user.findMany();
};
