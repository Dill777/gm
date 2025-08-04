import { NextRequest, NextResponse } from "next/server";
import { getReferrals, updateRefer } from "@/lib/api/referral";
import { setCorsHeaders } from "@/lib/api/cors";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const chainId = Number(url.searchParams.get("chain"));
  const address = url.searchParams.get("address") || undefined;

  if (!chainId) {
    return setCorsHeaders(
      NextResponse.json(
        { code: 400, message: "Invalid Chain" },
        { status: 400 }
      )
    );
  }

  try {
    const referrals = await getReferrals(chainId, address);

    return setCorsHeaders(
      NextResponse.json(
        {
          code: 200,
          data: referrals,
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

export async function POST(req: NextRequest) {
  try {
    const { refer, chainId } = await req.json();

    if (!refer || !chainId) {
      return setCorsHeaders(
        NextResponse.json(
          { code: 400, message: "Missing required parameters" },
          { status: 400 }
        )
      );
    }

    await updateRefer(refer, chainId);

    return setCorsHeaders(
      NextResponse.json(
        { code: 200, message: "Referral updated successfully" },
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
