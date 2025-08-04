import { NextRequest, NextResponse } from "next/server";
import { sendOTPUnauthenticated } from "@/lib/api/otp";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const sent = await sendOTPUnauthenticated(email);

    if (!sent) {
      return NextResponse.json(
        { error: "Failed to send OTP" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
