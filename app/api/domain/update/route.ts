import { NextRequest, NextResponse } from "next/server";
import { updateDomainProfileByAddress } from "@/lib/api/domain/profile";
import { setCorsHeaders } from "@/lib/api/cors";

export async function POST(req: NextRequest) {
  try {
    const { profileId, data, address } = await req.json();

    if (!profileId || !data) {
      return setCorsHeaders(
        NextResponse.json(
          {
            code: 400,
            message: "Missing required parameters: profileId and data",
          },
          { status: 400 }
        )
      );
    }

    const result = await updateDomainProfileByAddress(profileId, data, address);

    if (result.isError) {
      return setCorsHeaders(
        NextResponse.json({ code: 400, message: result.error }, { status: 400 })
      );
    }

    return setCorsHeaders(
      NextResponse.json(
        {
          code: 200,
          message: "Domain profile updated successfully",
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
