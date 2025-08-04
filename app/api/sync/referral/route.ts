import { syncReferral } from "@/lib/api/sync/referral";
import { getChainOnApi } from "@/utils/api-get-chain";

export async function POST(request: Request) {
  const chainId = getChainOnApi(request);
  if (chainId) {
    await syncReferral(chainId);
  }
  return Response.json({});
}
