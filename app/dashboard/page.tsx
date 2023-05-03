import { Metadata } from "next";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { Activity, Eye, Heart, Stars, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Views from "@/components/Dashboard/Views";
import Likes from "@/components/Dashboard/Likes";
import Edit from "@/components/Dashboard/Edit";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app using the components.",
};

export default async function DashboardPage() {
  const videos = await prisma.videos.findMany();

  const videoCount = videos.length;

  const videoCountPreviousMonth = videos.filter((video) => {
    const videoDate = new Date(video.date);
    const now = new Date();
    const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
    return videoDate > monthAgo;
  }).length;

  const viewCount = videos.reduce((a, b) => a + (b.views || 0), 0);
  const likeCount = videos.reduce((a, b) => a + (b.likes || 0), 0);

  return (
    <>
      <div className="flex-col md:flex">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <div className="flex items-center space-x-2">
              <Link href="/dashboard/upload">
                <Button size="sm">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </Button>
              </Link>
            </div>
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics" disabled>
                Analytics <Badge className="ml-1">WIP</Badge>
              </TabsTrigger>
              <TabsTrigger value="reports" disabled>
                Reports <Badge className="ml-1">WIP</Badge>
              </TabsTrigger>
              <TabsTrigger value="notifications" disabled>
                Notifications <Badge className="ml-1">WIP</Badge>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Upload Count for{" "}
                      {new Date().toLocaleString("default", { month: "long" })}
                    </CardTitle>
                    <Stars className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      +{videoCountPreviousMonth}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Total videos {videoCount}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Views</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{viewCount}</div>
                    <p className="text-xs text-muted-foreground">
                      Total view count
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Likes</CardTitle>
                    <Heart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{likeCount}</div>
                    <p className="text-xs text-muted-foreground">
                      Total like count
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Active Now
                    </CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1</div>
                    <p className="text-xs text-muted-foreground">
                      Currently active users
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-8">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Highest View Counts</CardTitle>
                    <CardDescription>
                      Videos with the most total views.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* @ts-expect-error Server Component */}
                    <Views />
                  </CardContent>
                </Card>
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Highest Like Counts</CardTitle>
                    <CardDescription>
                      Videos with the most total likes.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* @ts-expect-error Server Component */}
                    <Likes />
                  </CardContent>
                </Card>
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Video Management</CardTitle>
                    <CardDescription>
                      Manage your videos and their metadata.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {videos.map((video) => (
                      <Edit
                        key={video.asset_id}
                        assetId={video.asset_id}
                        title={video.title}
                        description={video.description}
                        tag={video.tag}
                        visibility={video.public}
                      />
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
