import { NextRequest, NextResponse } from "next/server";
import { setCorsHeaders } from "@/lib/api/cors";

// GET /api/mobile/redirect
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");

    if (!code) {
      return setCorsHeaders(
        NextResponse.json(
          { code: 400, error: "Missing code parameter" },
          { status: 400 }
        )
      );
    }

    // Create the redirect URL for the mobile app
    const redirectUrl = `com.zns.app://oauth2redirect/social?code=${encodeURIComponent(
      code
    )}`;

    // Return a redirect response
    return NextResponse.redirect(redirectUrl, 302);
  } catch (error) {
    console.error("Error processing mobile redirect:", error);
    return setCorsHeaders(
      NextResponse.json({ code: 500, error: "Server error" }, { status: 500 })
    );
  }
}
