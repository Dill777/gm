import { NextRequest, NextResponse } from "next/server";
import { burnDomainWithAddress } from "@/lib/api/domain/setting";
import { setCorsHeaders } from "@/lib/api/cors";

export async function POST(req: NextRequest) {
  try {
    const { dId, chainId, address } = await req.json();

    if (!dId || !chainId || !address) {
      return setCorsHeaders(
        NextResponse.json(
          {
            code: 400,
            message:
              "Missing required parameters: dId, chainId, and address are required",
          },
          { status: 400 }
        )
      );
    }

    const result = await burnDomainWithAddress(dId, chainId, address);

    if (!result) {
      return setCorsHeaders(
        NextResponse.json(
          { code: 403, message: "Not authorized or domain not found" },
          { status: 403 }
        )
      );
    }

    return setCorsHeaders(
      NextResponse.json(
        {
          code: 200,
          message: "Domain burned successfully",
          success: true,
        },
        { status: 200 }
      )
    );
  } catch (error) {
    console.error("Error burning domain:", error);
    return setCorsHeaders(
      NextResponse.json(
        { code: 500, message: "Server error", error: String(error) },
        { status: 500 }
      )
    );
  }
}
