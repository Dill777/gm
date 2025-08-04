import { NextRequest, NextResponse } from "next/server";
import { mintHIP } from "@/lib/api/hip";
import { setCorsHeaders } from "@/lib/api/cors";

// POST /api/hip/mint
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { walletAddress } = body;

    if (!walletAddress) {
      return setCorsHeaders(
        NextResponse.json(
          { code: 400, error: "Wallet address is required" },
          { status: 400 }
        )
      );
    }

    const hip = await mintHIP(walletAddress);

    if (!hip) {
      return setCorsHeaders(
        NextResponse.json(
          { code: 409, error: "HIP already exists" },
          { status: 409 }
        )
      );
    }

    return setCorsHeaders(
      NextResponse.json({ code: 201, data: hip }, { status: 201 })
    );
  } catch (error) {
    console.error("Error minting HIP:", error);
    return setCorsHeaders(
      NextResponse.json({ code: 500, error: "Server error" }, { status: 500 })
    );
  }
}
