"use client";

import { useState } from "react";
import { use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Copy, Download, Edit } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard-header";
import { api } from "@/trpc/react";
import hljs from "highlight.js";
import "highlight.js/styles/vs2015.css";
import { MarkdownPreview } from "@/components/markdown-preview";
import type { ReactNode } from "react";

export default function GeneratedBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [copied, setCopied] = useState(false);
  const { id } = use(params);

  const { data: blog, isLoading } = api.blog.getById.useQuery({ id });

  const cleanMarkdownContent = (content: string) => {
    // Remove initial backticks and language specification if present
    return content.replace(/^```[a-zA-Z]*\n/, "").replace(/\n```$/, "");
  };

  const handleCopy = async () => {
    if (!blog) return;
    try {
      await navigator.clipboard.writeText(blog.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  const handleDownload = () => {
    if (!blog) return;
    const element = document.createElement("a");
    const file = new Blob([blog.content], { type: "text/markdown" });
    element.href = URL.createObjectURL(file);
    element.download = `${blog.title.replace(/\s+/g, "-").toLowerCase()}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="mx-auto max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href={`/dashboard/session/${blog.sessionId}`}
            className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1 text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to session
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{blog.title}</h1>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={handleCopy}
              >
                <Copy className="h-4 w-4" />
                {copied ? "Copied!" : "Copy"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Link href={`/dashboard/edit/${blog.id}`}>
                <Button size="sm" className="gap-1">
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="py-0">
            <MarkdownPreview content={cleanMarkdownContent(blog.content)} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
