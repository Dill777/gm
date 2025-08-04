import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("photo");
    const userId = formData.get("userId") as string;
    const type = formData.get("type") as string;

    if (
      !file ||
      typeof file !== "object" ||
      !("name" in file) ||
      !("type" in file)
    ) {
      return NextResponse.json(
        { error: "No file or invalid file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 }
      );
    }

    // Validate upload type
    if (type && !["avatar", "banner", "hip"].includes(type)) {
      return NextResponse.json(
        { error: "Type must be either 'avatar', 'banner', or 'hip'" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Vercel Blob
    const blob = await put(file.name, buffer, {
      access: "public",
      contentType: file.type,
    });

    // Update user record in database
    if (userId) {
      if (type === "hip") {
        await prisma.hIP.update({
          where: {
            id: userId,
          },
          data: {
            mainImgUrl: blob.url,
          },
        });
      } else {
        // Determine which field to update based on type parameter
        const updateData =
          type === "banner"
            ? { bannerURL: blob.url }
            : { mainImgUrl: blob.url };

        await prisma.domain.update({
          where: {
            id: userId,
          },
          data: updateData,
        });
      }
    }

    // Return the URL of the uploaded blob
    return NextResponse.json({
      success: true,
      url: blob.url,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to upload file" },
      { status: 500 }
    );
  }
}
