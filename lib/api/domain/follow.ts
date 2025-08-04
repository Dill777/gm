"use server";
import prisma from "@/lib/db";

// Read Only
export const fetchFollowersByDomain = async (domainIds: string[]) => {
  const followers = await prisma.follow.findMany({
    where: {
      to: { dId: { in: domainIds } },
    },
  });

  return followers;
};

export const fetchFollowByDomainId = async (domainId: string) => {
  const following = await prisma.follow.findMany({
    where: {
      from: { dId: domainId },
    },
  });
  const followers = await prisma.follow.findMany({
    where: {
      to: { dId: domainId },
    },
  });
  return { following, followers };
};
