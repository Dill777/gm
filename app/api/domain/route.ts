import { NextRequest, NextResponse } from "next/server";
import { findDomain, getDomain, DomainType } from "@/lib/api/domain";
import { setCorsHeaders } from "@/lib/api/cors";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const domainName = url.searchParams.get("domainName");
    const chainId = Number(url.searchParams.get("chainId"));

    // Validate required parameters
    if (!domainName || !chainId) {
      return setCorsHeaders(
        NextResponse.json(
          { code: 400, message: "Missing domainName or chainId parameters" },
          { status: 400 }
        )
      );
    }

    const domain = { domainName, chainId } as DomainType;
    const result = await findDomain(domain);

    if (!result) {
      return setCorsHeaders(
        NextResponse.json(
          { code: 404, message: "Domain not found" },
          { status: 404 }
        )
      );
    }

    return setCorsHeaders(
      NextResponse.json(
        {
          code: 200,
          message: "Domain retrieved successfully",
          data: result,
        },
        { status: 200 }
      )
    );
  } catch (error) {
    console.error("Error in getDomain endpoint:", error);
    return setCorsHeaders(
      NextResponse.json({ code: 500, message: "Server error" }, { status: 500 })
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { domain, dId } = await req.json();

    // Validate required parameters
    if (!domain || !domain.domainName || !domain.chainId) {
      return setCorsHeaders(
        NextResponse.json(
          { code: 400, message: "Invalid or missing domain data" },
          { status: 400 }
        )
      );
    }

    if (typeof dId !== "number") {
      return setCorsHeaders(
        NextResponse.json(
          { code: 400, message: "Invalid or missing dId parameter" },
          { status: 400 }
        )
      );
    }

    const result = await getDomain(domain as DomainType, dId);

    if (result === null) {
      return setCorsHeaders(
        NextResponse.json(
          { code: 404, message: "Domain not found or invalid data" },
          { status: 404 }
        )
      );
    }

    return setCorsHeaders(
      NextResponse.json(
        {
          code: 200,
          message: "Domain retrieved successfully",
          data: result,
        },
        { status: 200 }
      )
    );
  } catch (error) {
    console.error("Error in getDomain endpoint:", error);
    return setCorsHeaders(
      NextResponse.json({ code: 500, message: "Server error" }, { status: 500 })
    );
  }
}
