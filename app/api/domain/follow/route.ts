import { NextRequest, NextResponse } from "next/server";
import { followDomainWithAddress } from "@/lib/api/domain/profile";
import { setCorsHeaders } from "@/lib/api/cors";

export async function POST(req: NextRequest) {
  try {
    const { domainId, userPDomainId, walletAddress } = await req.json();

    if (!domainId || !userPDomainId || !walletAddress) {
      return setCorsHeaders(
        NextResponse.json(
          {
            code: 400,
            message:
              "Missing required parameters: domainId, userPDomainId, or walletAddress",
          },
          { status: 400 }
        )
      );
    }

    const result = await followDomainWithAddress(
      domainId,
      userPDomainId,
      walletAddress
    );

    return setCorsHeaders(
      NextResponse.json(
        {
          code: 200,
          message: "Follow action completed successfully",
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
