import { NextRequest, NextResponse } from "next/server";
import { updateHIPReferral } from "@/lib/api/hip";
import { setCorsHeaders } from "@/lib/api/cors";

// PUT /api/hip/referral
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { refer, mintPrice } = body;

    if (!refer || !mintPrice) {
      return setCorsHeaders(
        NextResponse.json(
          { code: 400, error: "Referrer address and mint price are required" },
          { status: 400 }
        )
      );
    }

    const referralId = await updateHIPReferral(refer, BigInt(mintPrice));

    return setCorsHeaders(
      NextResponse.json({ code: 200, data: { referralId } }, { status: 200 })
    );
  } catch (error) {
    console.error("Error updating HIP referral:", error);
    return setCorsHeaders(
      NextResponse.json({ code: 500, error: "Server error" }, { status: 500 })
    );
  }
}
