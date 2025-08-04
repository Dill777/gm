import { NextRequest, NextResponse } from "next/server";
import { getAllHIPs, updateHIP } from "@/lib/api/hip";
import { setCorsHeaders } from "@/lib/api/cors";

// GET /api/hip (get all HIPs)
export async function GET(req: NextRequest) {
  try {
    const hips = await getAllHIPs();

    return setCorsHeaders(
      NextResponse.json({ code: 200, data: hips }, { status: 200 })
    );
  } catch (error) {
    console.error("Error fetching HIPs:", error);
    return setCorsHeaders(
      NextResponse.json({ code: 500, error: "Server error" }, { status: 500 })
    );
  }
}

// PUT /api/hip (update HIP)
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      return setCorsHeaders(
        NextResponse.json(
          { code: 400, error: "HIP ID is required" },
          { status: 400 }
        )
      );
    }

    const hip = await updateHIP(id, data);

    return setCorsHeaders(
      NextResponse.json({ code: 200, data: hip }, { status: 200 })
    );
  } catch (error) {
    console.error("Error updating HIP:", error);
    return setCorsHeaders(
      NextResponse.json({ code: 500, error: "Server error" }, { status: 500 })
    );
  }
}
