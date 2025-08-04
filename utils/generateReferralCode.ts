import crypto from "crypto";

export const generateReferralCode = (walletAddress: string): string => {
  const uniqueIdentifier = Date.now().toString();
  const combinedString = `${walletAddress}-${uniqueIdentifier}`;
  const hash = crypto.createHash("sha256").update(combinedString).digest("hex");
  const referralCode = Buffer.from(hash).toString("base64").slice(0, 10);

  return referralCode;
};
