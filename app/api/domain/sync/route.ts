import { NextRequest, NextResponse } from "next/server";
import { syncOnchainDomainId } from "@/lib/api/domain/profile";
import { setCorsHeaders } from "@/lib/api/cors";

export async function POST(req: NextRequest) {
  try {
    const { profileId, dId } = await req.json();

    if (!profileId || !dId) {
      return setCorsHeaders(
        NextResponse.json(
          {
            code: 400,
            message: "Missing required parameters: profileId and dId",
          },
          { status: 400 }
        )
      );
    }

    const result = await syncOnchainDomainId(profileId, dId);

    if (result.isError) {
      return setCorsHeaders(
        NextResponse.json({ code: 400, message: result.error }, { status: 400 })
      );
    }

    return setCorsHeaders(
      NextResponse.json(
        {
          code: 200,
          message: "Domain ID synchronized successfully",
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
