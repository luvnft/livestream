import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export async function POST(request: NextRequest) {
  const res = await request.json();

  const { userId } = auth();

  if (userId !== process.env.ADMIN_ID) {
    redirect("/unauthorised");
  }

  try {
    await prisma.videos.update({
      where: {
        asset_id: res.asset_id,
      },
      data: {
        title: res.title,
        description: res.description,
        tag: res.tag,
        public: res.visibility,
        date: res.date,
      },
    });
  } catch (error) {
    return NextResponse.json({ message: `Error updating video.` });
  }

  return NextResponse.json({ message: `Video updated.` });
}
