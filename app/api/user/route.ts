import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/api/user";
import { setCorsHeaders } from "@/lib/api/cors";

// POST /api/user (create or get a user by wallet address)
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

    const user = await getUser(walletAddress);

    if (!user) {
      return setCorsHeaders(
        NextResponse.json(
          { code: 500, error: "Failed to create or get user" },
          { status: 500 }
        )
      );
    }

    return setCorsHeaders(
      NextResponse.json({ code: 200, data: user }, { status: 200 })
    );
  } catch (error) {
    console.error("Error creating or getting user:", error);
    return setCorsHeaders(
      NextResponse.json({ code: 500, error: "Server error" }, { status: 500 })
    );
  }
}
