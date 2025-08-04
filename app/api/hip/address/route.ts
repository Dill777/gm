import { NextRequest, NextResponse } from "next/server";
import { getHIPByAddress } from "@/lib/api/hip";
import { setCorsHeaders } from "@/lib/api/cors";

// GET /api/hip/address - expecting ?address=0x... query parameter
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

    const hip = await getHIPByAddress(walletAddress);

    if (!hip) {
      return setCorsHeaders(
        NextResponse.json(
          { code: 404, error: "HIP not found" },
          { status: 404 }
        )
      );
    }

    return setCorsHeaders(
      NextResponse.json({ code: 200, data: hip }, { status: 200 })
    );
  } catch (error) {
    console.error("Error fetching HIP by address:", error);
    return setCorsHeaders(
      NextResponse.json({ code: 500, error: "Server error" }, { status: 500 })
    );
  }
}
