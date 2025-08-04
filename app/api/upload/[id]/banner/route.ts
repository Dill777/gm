import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import prisma from "@/lib/db";
import { isDomainOwnerByDBID } from "@/lib/api/auth";

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
        const isOwner = await isDomainOwnerByDBID(id);
        if (isOwner) {
          return {
            allowedContentTypes: [
              "image/jpeg",
              "image/png",
              "image/gif",
              "image/webp",
            ],
            tokenPayload: JSON.stringify({ id: id }),
          };
        } else {
          return {
            allowedContentTypes: [],
            tokenPayload: JSON.stringify({ id: id, restricted: true }),
          };
        }
      },
      onUploadCompleted: async ({ blob }) => {
        try {
          await prisma.domain.update({
            where: {
              id: id,
            },
            data: {
              bannerURL: blob.url,
            },
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
