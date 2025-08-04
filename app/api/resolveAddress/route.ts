import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, http } from "viem";
import { getChainByID } from "@/config/chains";
import { getRegistryAddressByChainId } from "@/config/contracts";
import { REGISTRY_ABI } from "@/config/abis";
import { setCorsHeaders } from "@/lib/api/cors";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const address = url.searchParams.get("address");
  const chainId = Number(url.searchParams.get("chain"));

  if (!address) {
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

    if (!registryAddress || !chain) {
      return setCorsHeaders(
        NextResponse.json(
          { code: 400, message: "Invalid Chain" },
          { status: 400 }
        )
      );
    }

    const registryContract = {
      address: registryAddress as `0x${string}`,
      abi: REGISTRY_ABI,
    } as const;

    const publicClient = createPublicClient({
      chain: chain,
      transport: http(),
    });

    const userDetails: any = await publicClient.readContract({
      ...registryContract,
      functionName: "userLookupByAddress",
      args: [address as `0x${string}`],
    });

    const primaryDomainCallPromise = publicClient.readContract({
      ...registryContract,
      functionName: "registryLookupById",
      args: [userDetails.primaryDomain],
    });

    const userOwnedDomainsPromise = Promise.all(
      userDetails.allOwnedDomains.map((domainId: string) =>
        publicClient.readContract({
          ...registryContract,
          functionName: "registryLookupById",
          args: [domainId],
        })
      )
    );

    const [primaryDomainCall, userOwnedDomains]: any = await Promise.all([
      primaryDomainCallPromise,
      userOwnedDomainsPromise,
    ]);

    const primaryDomain = `${primaryDomainCall.domainName}`;
    const userOwnedDomainNames = userOwnedDomains.map(
      (domainCall: any) => `${domainCall.domainName}`
    );

    return setCorsHeaders(
      NextResponse.json(
        {
          code: 200,
          primaryDomain,
          userOwnedDomains: userOwnedDomainNames,
        },
        { status: 200 }
      )
    );
  } catch (error) {
    console.error("Error:", error);
    return setCorsHeaders(
      NextResponse.json({ error: "Server error" }, { status: 500 })
    );
  }
}
