import { NextRequest, NextResponse } from "next/server";
import { verifyAccountByAddress } from "@/lib/api/domain/profile";
import { setCorsHeaders } from "@/lib/api/cors";

export async function POST(req: NextRequest) {
  try {
    const { profileId, account, accountData, address } = await req.json();

    if (!profileId || !account || !accountData) {
      return setCorsHeaders(
        NextResponse.json(
          {
            code: 400,
            message:
              "Missing required parameters: profileId, account, and accountData",
          },
          { status: 400 }
        )
      );
    }

    const result = await verifyAccountByAddress(
      profileId,
      account,
      accountData,
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
          message: "Account verified successfully",
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
