"use server";

import prisma from "@/lib/db";
import { Badges } from "@prisma/client";
import { getAuthenticatedUser } from "../auth";

// Private
export const claimBadge = async (badge: Badges) => {
  const user = await getAuthenticatedUser();
  if (user) {
    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
    });
    if (currentUser) {
      const newUser = await prisma.user.update({
        data: {
          badges: [...currentUser.badges, badge],
        },
        where: {
          id: user.id,
        },
      });
      return { ...newUser, dateJoined: newUser.dateJoined.toDateString() };
    }
  }
  return null;
};

// New function that takes userId directly
export const claimBadgeById = async (userId: string, badge: Badges) => {
  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (currentUser) {
    const newUser = await prisma.user.update({
      data: {
        badges: [...currentUser.badges, badge],
      },
      where: {
        id: userId,
      },
    });
    return { ...newUser, dateJoined: newUser.dateJoined.toDateString() };
  }

  return null;
};
