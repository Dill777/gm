import { NextRequest, NextResponse } from "next/server";
import { verifyOTPUnauthenticated } from "@/lib/api/otp";

export async function POST(req: NextRequest) {
  try {
    const { email, otp, userId } = await req.json();

    if (!email || !otp || !userId) {
      return NextResponse.json(
        { error: "Email, OTP and userId are required" },
        { status: 400 }
      );
    }

    const isVerified = await verifyOTPUnauthenticated(email, otp, userId);

    if (!isVerified) {
      return NextResponse.json(
        { error: "Invalid OTP or OTP expired" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
