"use server";
import { IRON_OPTIONS } from "@/config/session";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { randomBytes } from "crypto";

// Generate a random nonce for wallet authentication
const generateNonce = () => {
  return randomBytes(32).toString("hex");
};

export const getNonce = async () => {
  const session = await getIronSession<{ nonce: string }>(
    cookies(),
    IRON_OPTIONS
  );
  session.nonce = generateNonce();
  await session.save();
  return session.nonce;
};

export const getISessionNonce = async () => {
  const session = await getIronSession<{ nonce: string }>(
    cookies(),
    IRON_OPTIONS
  );
  return session.nonce;
};
