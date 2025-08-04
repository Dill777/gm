import { NextRequest, NextResponse } from "next/server";
import { fetchDomain, DomainType } from "@/lib/api/domain";
import { setCorsHeaders } from "@/lib/api/cors";

export async function POST(req: NextRequest) {
  try {
    const { domain, domainInfo } = await req.json();

    if (!domain || !domain.domainName || !domain.chainId) {
      return setCorsHeaders(
        NextResponse.json(
          { code: 400, message: "Invalid or missing domain data" },
          { status: 400 }
        )
      );
    }

    const result = await fetchDomain(domain as DomainType, domainInfo);

    if (result.isError) {
      return setCorsHeaders(
        NextResponse.json({ code: 400, message: result.error }, { status: 400 })
      );
    }

    return setCorsHeaders(
      NextResponse.json(
        {
          code: 200,
          message: "Domain fetched successfully",
          data: result.data,
        },
        { status: 200 }
      )
    );
  } catch (error) {
    console.error("Error:", error);
    return setCorsHeaders(
      NextResponse.json({ code: 500, message: "Server error" }, { status: 500 })
    );
  }
}
