import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import prisma from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;
  const id = params.id;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        return {
          allowedContentTypes: [
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp",
          ],
          tokenPayload: JSON.stringify({ id: id }),
        };
      },
      onUploadCompleted: async ({ blob }) => {
        try {
          await prisma.hIP.update({
            data: {
              mainImgUrl: blob.url,
            },
            where: { id },
          });
        } catch (error) {
          throw new Error("Could not update user");
        }
      },
    });
    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 } // The webhook will retry 5 times waiting for a 200
    );
  }
}
