import { NextRequest, NextResponse } from "next/server";
import {
  fetchFollowersByDomain,
  fetchFollowByDomainId,
} from "@/lib/api/domain/follow";
import { setCorsHeaders } from "@/lib/api/cors";

export async function POST(req: NextRequest) {
  try {
    const { domainIds } = await req.json();

    if (!domainIds || !Array.isArray(domainIds)) {
      return setCorsHeaders(
        NextResponse.json(
          { code: 400, message: "Invalid or missing domainIds array" },
          { status: 400 }
        )
      );
    }

    const followers = await fetchFollowersByDomain(domainIds);

    return setCorsHeaders(
      NextResponse.json(
        {
          code: 200,
          message: "Followers fetched successfully",
          data: followers,
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

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const domainId = url.searchParams.get("domainId");

    if (!domainId) {
      return setCorsHeaders(
        NextResponse.json(
          { code: 400, message: "Missing domainId parameter" },
          { status: 400 }
        )
      );
    }

    const followData = await fetchFollowByDomainId(domainId);

    return setCorsHeaders(
      NextResponse.json(
        {
          code: 200,
          message: "Follow data fetched successfully",
          data: followData,
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
