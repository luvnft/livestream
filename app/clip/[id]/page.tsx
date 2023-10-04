import prisma from "@/lib/prisma";
import Player from "@/components/player";
import CopyLink from "@/components/copy-link";
import { DateTime } from "luxon";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Likes from "@/components/likes";
import { redirect } from "next/navigation";

export async function generateMetadata({ params }: any) {
  const { id } = params;

  const video = await prisma.videos.findUnique({
    where: { asset_id: decodeURIComponent(id) },
  });

  return {
    title: video?.title,
    description: video?.description,
    openGraph: {
      title: video?.title,
      description: video?.description,
      url: `https://sdelta.xyz/clip/${video?.asset_id}`,
      siteName: "sdelta.xyz",
      images: [
        {
          url: `https://image.mux.com/${video?.playback_id}/thumbnail.png`,
          width: 800,
          height: 600,
          alt: `${video?.title} Thumbnail`,
        },
        {
          url: `https://image.mux.com/${video?.playback_id}/thumbnail.png`,
          width: 1800,
          height: 1600,
          alt: `${video?.title} Thumbnail`,
        },
      ],
      videos: {
        url: `https://stream.mux.com/${video?.playback_id}/medium.mp4`,
        width: 1280,
        height: 720,
      },
      locale: "en-US",
      type: "video.other",
      author: "sdelta",
      uploadDate: video?.date,
      tags: [`${video?.tag}`],
      duration: video?.duration,
      twitter: {
        card: "player",
        site: "@zpuckeridge",
        title: video?.title,
        description: video?.description,
        image: [
          {
            url: `https://image.mux.com/${video?.playback_id}/twitter_card.png`,
            width: 1200,
            height: 630,
            alt: `${video?.title} Twitter Card`,
          },
        ],
      },
    },
  };
}

export default async function Clip({ params }: any) {
  const { id } = params;

  const video = await prisma.videos.findFirst({
    where: { asset_id: decodeURIComponent(id) },
  });

  if (!video) {
    redirect("/404");
  }

  // increment view count on page load
  await prisma.videos.update({
    where: { asset_id: decodeURIComponent(id) },
    data: { views: video.views + 1 },
  });

  return (
    <>
      <main>
        <div className="max-w-6xl p-4 mx-auto">
          <Player playbackId={video.playback_id} />
          <div className="flex justify-between">
            <h1 className="text-2xl font-bold mt-2">{video.title}</h1>
            <div className="inline-flex space-x-2">
              <Likes assetId={video.asset_id} likes={video.likes ?? 0} />
              <CopyLink />
            </div>
          </div>
          <div className="flex justify-between">
            <div>{video.views + 1} views</div>
            <div>
              {DateTime.fromJSDate(video.date).toFormat("MMMM d, yyyy")}
            </div>
          </div>
          <Link href="/clips">
            <Button className="mt-4" variant="secondary">
              <ArrowLeft className="mr-1 h-4 w-4" /> Back to Clips
            </Button>
          </Link>
        </div>
      </main>
    </>
  );
}
