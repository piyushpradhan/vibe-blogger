"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard-header";
import { api } from "@/trpc/react";
import { MarkdownPreview } from "@/components/markdown-preview";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

export default function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { toast } = useToast();
  const { id } = use(params);
  const [isPreview, setIsPreview] = useState(false);

  const { data: blog, isLoading } = api.blog.getById.useQuery({ id });
  const updateBlog = api.blog.update.useMutation({
    onSuccess: () => {
      toast({
        title: "Blog Saved!",
        description: "Your changes have been successfully saved.",
        className: "border-primary/20 bg-primary text-primary-foreground",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const [content, setContent] = useState("");

  // Set initial content when blog data is loaded
  useEffect(() => {
    if (blog?.content) {
      // Remove markdown code block markers
      const cleanContent = blog.content
        .replace(/^```markdown\n/, "")
        .replace(/\n```$/, "");
      setContent(cleanContent);
    }
  }, [blog?.content]);

  const handleSave = async () => {
    if (!blog) return;
    updateBlog.mutate({
      id: blog.id,
      content,
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <main className="mx-auto max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex h-64 items-center justify-center">
            <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
          </div>
        </main>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <main className="mx-auto max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex h-64 flex-col items-center justify-center">
            <h1 className="mb-4 text-2xl font-bold">Blog not found</h1>
            <Link href="/dashboard">
              <Button>Back to Dashboard</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href={`/dashboard/generated/${blog.id}`}
            className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1 text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to blog
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Edit {blog.title}</h1>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPreview(!isPreview)}
              >
                {isPreview ? "Edit" : "Preview"}
              </Button>
              <Button
                size="sm"
                className="gap-1"
                onClick={handleSave}
                disabled={updateBlog.isPending}
              >
                <Save className="h-4 w-4" />
                Save
              </Button>
            </div>
          </div>
        </div>

        <Card>
          <CardContent className="h-[calc(100vh-16rem)]">
            <div className="mx-auto h-full w-full overflow-scroll">
              {isPreview ? (
                <MarkdownPreview content={content} />
              ) : (
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-full w-full border-none font-mono outline-none"
                  placeholder="Write your blog content in markdown..."
                />
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
