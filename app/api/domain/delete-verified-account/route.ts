import { NextRequest, NextResponse } from "next/server";
import { deleteVerifedAccountByAddress } from "@/lib/api/domain/profile";
import { setCorsHeaders } from "@/lib/api/cors";

export async function POST(req: NextRequest) {
  try {
    const { profileId, account, address } = await req.json();

    if (!profileId || !account) {
      return setCorsHeaders(
        NextResponse.json(
          {
            code: 400,
            message: "Missing required parameters: profileId and account",
          },
          { status: 400 }
        )
      );
    }

    const result = await deleteVerifedAccountByAddress(
      profileId,
      account,
      address
    );

    if (result.isError) {
      return setCorsHeaders(
        NextResponse.json({ code: 400, message: result.error }, { status: 400 })
      );
    }

    return setCorsHeaders(
      NextResponse.json(
        {
          code: 200,
          message: "Verified account deleted successfully",
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
