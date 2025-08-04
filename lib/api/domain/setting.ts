"use server";
import { NETWORKS } from "@/config/chains";
import prisma from "@/lib/db";
import { isDomainOwner, isDomainOwnerBySpecificAddress } from "../auth";

export const burnDomain = async (
  dId: string | undefined,
  chainId: NETWORKS | null
) => {
  if (!dId || !chainId) return;
  const isOwner = await isDomainOwner(dId, chainId);
  if (isOwner) {
    await prisma.domain.updateMany({
      data: { hasBurned: true },
      where: {
        dId: dId,
      },
    });
  }
};

export const burnDomainWithAddress = async (
  dId: string | undefined,
  chainId: NETWORKS | null,
  address: string
) => {
  if (!dId || !chainId || !address) return false;
  const isOwner = await isDomainOwnerBySpecificAddress(dId, chainId, address);
  if (isOwner) {
    await prisma.domain.updateMany({
      data: { hasBurned: true },
      where: {
        dId: dId,
      },
    });
    return true;
  }
  return false;
};
