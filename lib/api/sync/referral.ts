import { NETWORKS } from "@/config/chains";
import { updateRefer } from "../referral";
import { getUsers } from "../user";

export const syncReferral = async (chainId: NETWORKS) => {
  const users = await getUsers();
  for (let idx = 0; idx < users.length; idx++) {
    const user = users[idx];
    await updateRefer(user.walletAddress, chainId);
    console.log("User Referral Generated :", user.id);
  }
  console.log("Sync Referral is finished.");
};
