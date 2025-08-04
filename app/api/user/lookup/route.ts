import { NextRequest, NextResponse } from "next/server";
import { findUserByAddress } from "@/lib/api/user";
import { setCorsHeaders } from "@/lib/api/cors";

// GET /api/user/lookup - expecting ?address=0x... query parameter
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const walletAddress = searchParams.get("address");

    if (!walletAddress) {
      return setCorsHeaders(
        NextResponse.json(
          { code: 400, error: "Wallet address is required" },
          { status: 400 }
        )
      );
    }

    const user = await findUserByAddress(walletAddress);

    if (!user) {
      return setCorsHeaders(
        NextResponse.json(
          { code: 404, error: "User not found" },
          { status: 404 }
        )
      );
    }

    return setCorsHeaders(
      NextResponse.json({ code: 200, data: user }, { status: 200 })
    );
  } catch (error) {
    console.error("Error finding user by address:", error);
    return setCorsHeaders(
      NextResponse.json({ code: 500, error: "Server error" }, { status: 500 })
    );
  }
}
