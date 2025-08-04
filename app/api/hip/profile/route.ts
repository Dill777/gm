import { NextRequest, NextResponse } from "next/server";
import { updateHIPProfile } from "@/lib/api/hip";
import { setCorsHeaders } from "@/lib/api/cors";

// PUT /api/hip/profile
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, bio, position } = body;

    if (!id || !name) {
      return setCorsHeaders(
        NextResponse.json(
          { code: 400, error: "HIP ID and name are required" },
          { status: 400 }
        )
      );
    }

    const hip = await updateHIPProfile(id, name, bio, position);

    return setCorsHeaders(
      NextResponse.json({ code: 200, data: hip }, { status: 200 })
    );
  } catch (error) {
    console.error("Error updating HIP profile:", error);
    return setCorsHeaders(
      NextResponse.json({ code: 500, error: "Server error" }, { status: 500 })
    );
  }
}
