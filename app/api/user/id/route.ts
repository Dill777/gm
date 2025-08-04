import { NextRequest, NextResponse } from "next/server";
import { getOrCreateUserIdByAddress } from "@/lib/api/user";
import { setCorsHeaders } from "@/lib/api/cors";

// POST /api/user/id - get or create user ID by wallet address
export async function POST(req: NextRequest) {
  try {
    const { walletAddress } = await req.json();

    if (!walletAddress) {
      return setCorsHeaders(
        NextResponse.json(
          { code: 400, error: "Wallet address is required" },
          { status: 400 }
        )
      );
    }

    const userId = await getOrCreateUserIdByAddress(walletAddress);

    if (!userId) {
      return setCorsHeaders(
        NextResponse.json(
          { code: 500, error: "Failed to get or create user ID" },
          { status: 500 }
        )
      );
    }

    return setCorsHeaders(
      NextResponse.json({ code: 200, data: { id: userId } }, { status: 200 })
    );
  } catch (error) {
    console.error("Error getting or creating user ID:", error);
    return setCorsHeaders(
      NextResponse.json({ code: 500, error: "Server error" }, { status: 500 })
    );
  }
}
