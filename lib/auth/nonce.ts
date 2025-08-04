"use server";
import { IRON_OPTIONS } from "@/config/session";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { generateNonce } from "siwe";

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
