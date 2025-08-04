import { NextRequest, NextResponse } from "next/server";
import { createDomainWithoutAuth, DomainType } from "@/lib/api/domain";
import { setCorsHeaders } from "@/lib/api/cors";

export async function POST(req: NextRequest) {
  try {
    const { domains } = await req.json();

    if (!domains || !Array.isArray(domains)) {
      return setCorsHeaders(
        NextResponse.json(
          { code: 400, message: "Invalid or missing domains array" },
          { status: 400 }
        )
      );
    }

    const result = await createDomainWithoutAuth(domains as DomainType[]);

    if (result.isError) {
      return setCorsHeaders(
        NextResponse.json({ code: 400, message: result.error }, { status: 400 })
      );
    }

    return setCorsHeaders(
      NextResponse.json(
        {
          code: 200,
          message: "Domains created successfully",
          data: result.data,
        },
        { status: 200 }
      )
    );
  } catch (error) {
    console.error("Error:", error);
    return setCorsHeaders(
      NextResponse.json({ error: "Server error" }, { status: 500 })
    );
  }
}
