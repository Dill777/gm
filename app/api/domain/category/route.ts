import { NextRequest, NextResponse } from "next/server";
import {
  fetchDomainCategories,
  updateDomainCategories,
} from "@/lib/api/domain/category";
import { setCorsHeaders } from "@/lib/api/cors";

export async function GET() {
  try {
    const categories = await fetchDomainCategories();
    return setCorsHeaders(
      NextResponse.json({ code: 200, data: categories }, { status: 200 })
    );
  } catch (error) {
    console.error("Error fetching domain categories:", error);
    return setCorsHeaders(
      NextResponse.json({ code: 500, error: "Server error" }, { status: 500 })
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    if (!data || typeof data !== "object") {
      return setCorsHeaders(
        NextResponse.json(
          { code: 400, error: "Invalid data format" },
          { status: 400 }
        )
      );
    }

    const result = await updateDomainCategories(data);

    // Handle category object return (when a new category is created)
    if ("id" in result && "key" in result && "taken" in result) {
      return setCorsHeaders(
        NextResponse.json({ code: 200, data: result }, { status: 200 })
      );
    }

    // Handle error response
    if ("isError" in result && result.isError) {
      return setCorsHeaders(
        NextResponse.json({ code: 400, error: result.error }, { status: 400 })
      );
    }

    // Handle success response
    return setCorsHeaders(
      NextResponse.json({ code: 200, data: result.data }, { status: 200 })
    );
  } catch (error) {
    console.error("Error updating domain categories:", error);
    return setCorsHeaders(
      NextResponse.json({ code: 500, error: "Server error" }, { status: 500 })
    );
  }
}
