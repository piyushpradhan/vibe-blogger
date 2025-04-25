"use client";

import { DashboardHeader } from "@/components/dashboard-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/trpc/react";
import { MessageSquare, BookOpen, Brain, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="mb-2 h-8 w-16" />
        <Skeleton className="h-3 w-32" />
      </CardContent>
    </Card>
  );
}

function ActivityItemSkeleton() {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3 w-32" />
      </div>
      <Skeleton className="h-4 w-16" />
    </div>
  );
}

export default function StatisticsPage() {
  const { data: sessions, isLoading: isLoadingSessions } =
    api.session.getAll.useQuery();
  const { data: blogs, isLoading: isLoadingBlogs } = api.blog.getAll.useQuery();

  const totalSessions = sessions?.length ?? 0;
  const totalBlogs = blogs?.length ?? 0;
  const totalPosts =
    sessions?.reduce((acc, session) => acc + (session.posts?.length ?? 0), 0) ??
    0;

  const averageSessionDuration =
    sessions?.reduce((acc, session) => {
      const duration = session.posts?.length ?? 0;
      return acc + duration;
    }, 0) ?? 0 / (totalSessions || 1);

  const isLoading = isLoadingSessions || isLoadingBlogs;

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Statistics</h1>
          <p className="text-muted-foreground">
            View your activity and contributions.
          </p>
        </div>

        <div className="grid gap-6">
          {/* Overview Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            {isLoading ? (
              <>
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
              </>
            ) : (
              <>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Sessions
                    </CardTitle>
                    <MessageSquare className="text-muted-foreground h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalSessions}</div>
                    <p className="text-muted-foreground text-xs">
                      AI conversation sessions
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Published Blogs
                    </CardTitle>
                    <BookOpen className="text-muted-foreground h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalBlogs}</div>
                    <p className="text-muted-foreground text-xs">
                      Generated blog posts
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Thoughts
                    </CardTitle>
                    <Brain className="text-muted-foreground h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalPosts}</div>
                    <p className="text-muted-foreground text-xs">
                      Individual AI interactions
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Avg. Session Length
                    </CardTitle>
                    <Clock className="text-muted-foreground h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {Math.round(averageSessionDuration)}
                    </div>
                    <p className="text-muted-foreground text-xs">
                      Thoughts per session
                    </p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest sessions and generated content.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoading ? (
                  <>
                    <ActivityItemSkeleton />
                    <ActivityItemSkeleton />
                    <ActivityItemSkeleton />
                    <ActivityItemSkeleton />
                    <ActivityItemSkeleton />
                  </>
                ) : (
                  sessions?.slice(0, 5).map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{session.title}</p>
                        <p className="text-muted-foreground text-sm">
                          {session.posts?.length ?? 0} thoughts •{" "}
                          {new Date(session.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-muted-foreground text-sm">
                        {session.model}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
