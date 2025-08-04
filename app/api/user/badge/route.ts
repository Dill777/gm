import { NextRequest, NextResponse } from "next/server";
import { claimBadgeById } from "@/lib/api/user/badge";
import { Badges } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const { userId, badge } = await req.json();

    if (!userId || !badge) {
      return NextResponse.json(
        { error: "Missing userId or badge type" },
        { status: 400 }
      );
    }

    // Validate badge type
    if (!Object.values(Badges).includes(badge as Badges)) {
      return NextResponse.json(
        { error: "Invalid badge type" },
        { status: 400 }
      );
    }

    const updatedUser = await claimBadgeById(userId, badge as Badges);

    if (!updatedUser) {
      return NextResponse.json(
        { error: "Failed to claim badge or user not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error claiming badge:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
