import { syncDomains } from "@/lib/api/sync/domains";
import { getChainOnApi } from "@/utils/api-get-chain";

export async function POST(request: Request) {
  const chainId = getChainOnApi(request);
  if (chainId) {
    await syncDomains(chainId);
  }
  return Response.json({});
}
