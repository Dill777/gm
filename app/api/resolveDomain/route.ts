import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, http } from "viem";
import { getChainByID } from "@/config/chains";
import { getRegistryAddressByChainId } from "@/config/contracts";
import { REGISTRY_ABI } from "@/config/abis";
import { setCorsHeaders } from "@/lib/api/cors";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const domain = url.searchParams.get("domain");
  const chainId = Number(url.searchParams.get("chain"));

  if (!domain) {
    return setCorsHeaders(
      NextResponse.json(
        { code: 400, message: "Invalid Details" },
        { status: 400 }
      )
    );
  }

  if (!chainId) {
    return setCorsHeaders(
      NextResponse.json(
        { code: 400, message: "Invalid Chain" },
        { status: 400 }
      )
    );
  }

  try {
    const chain = getChainByID(chainId);
    const registryAddress = getRegistryAddressByChainId(chainId);

    if (!chain || !registryAddress) {
      return setCorsHeaders(
        NextResponse.json(
          { code: 400, message: "Invalid Chain Configuration" },
          { status: 400 }
        )
      );
    }

    const publicClient = createPublicClient({
      chain: chain,
      transport: http(),
    });

    const data: any = await publicClient.readContract({
      address: registryAddress as `0x${string}`,
      abi: REGISTRY_ABI,
      functionName: "registryLookupByName",
      args: [domain],
    });

    if (data.owner === "0x0000000000000000000000000000000000000000") {
      return NextResponse.json(
        { code: 404, message: "Domain not found" },
        { status: 404 }
      );
    }

    return setCorsHeaders(
      NextResponse.json({ code: 200, address: data?.owner }, { status: 200 })
    );
  } catch (error) {
    console.error("Error:", error);
    return setCorsHeaders(
      NextResponse.json({ error: "Server error" }, { status: 500 })
    );
  }
}
