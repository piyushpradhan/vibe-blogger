"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Send, Zap, MessageSquare, Sparkles } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard-header";
import { MicroPost } from "@/components/micro-post";
import { AIModelSelector } from "@/components/ai-model-selector";
import { api } from "@/trpc/react";

// Mock data for a session
const mockSession = {
  id: "1",
  title: "Web Development Best Practices",
  posts: [
    {
      id: "p1",
      content:
        "Just realized how important proper error handling is in production apps. Users should never see a stack trace!",
      createdAt: "2025-03-28T12:00:00Z",
    },
    {
      id: "p2",
      content:
        "Thinking about the tradeoffs between client-side and server-side rendering. Each has its place depending on the use case.",
      createdAt: "2025-03-28T12:15:00Z",
    },
    {
      id: "p3",
      content:
        "Accessibility shouldn't be an afterthought. It should be baked into the development process from day one.",
      createdAt: "2025-03-28T12:30:00Z",
    },
  ],
};

export default function SessionPage({ params }: { params: { id: string } }) {
  const [session, setSession] = useState(mockSession);
  const [newPost, setNewPost] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAIOptions, setShowAIOptions] = useState(false);

  const handleAddPost = () => {
    if (!newPost.trim()) return;

    const post = {
      id: `p${Date.now()}`,
      content: newPost,
      createdAt: new Date().toISOString(),
    };

    setSession({
      ...session,
      posts: [...session.posts, post],
    });

    setNewPost("");
  };

  const handleGenerateBlog = () => {
    setIsGenerating(true);

    // Simulate AI processing
    setTimeout(() => {
      setIsGenerating(false);
      // Here you would redirect to the generated blog
      window.location.href = `/dashboard/generated/${session.id}`;
    }, 2000);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 mx-auto px-4 sm:px-8 lg:px-12 max-w-[1400px] py-8">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sessions
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{session.title}</h1>
              <p className="text-muted-foreground mt-2">
                {session.posts.length} {session.posts.length === 1 ? 'thought' : 'thoughts'} captured
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <Textarea
                  placeholder="What's on your mind? Add a new thought to this session..."
                  className="min-h-[120px] resize-none border-0 p-0 focus-visible:ring-0 text-lg"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                />
                <div className="mt-4 flex justify-end">
                  <Button 
                    onClick={handleAddPost} 
                    className="gap-1.5"
                    disabled={!newPost.trim()}
                  >
                    <Send className="h-4 w-4" />
                    Post Thought
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {session.posts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-muted/30 rounded-lg">
                  <div className="rounded-full bg-primary/10 p-4 mb-6">
                    <MessageSquare className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold mb-2">Start Your Thought Journey</h2>
                  <p className="text-muted-foreground max-w-md mb-6">
                    Your first thought is just a click away. Share your ideas, insights, or questions above and watch your session come to life.
                  </p>
                </div>
              ) : (
                session.posts.map((post) => (
                  <MicroPost key={post.id} post={post} />
                ))
              )}
            </div>
          </div>

          <div className="space-y-6">
            <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Generate Blog Post</h3>
                </div>
                <p className="text-muted-foreground mb-6 text-sm">
                  Transform your thoughts into a polished blog post using AI. Select your preferred model and let the magic happen.
                </p>

                {showAIOptions ? (
                  <AIModelSelector onClose={() => setShowAIOptions(false)} />
                ) : (
                  <Button
                    onClick={handleGenerateBlog}
                    className="w-full gap-1.5"
                    disabled={session.posts.length === 0 || isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Generate Blog
                      </>
                    )}
                  </Button>
                )}

                <Button
                  variant="link"
                  className="mt-2 w-full text-xs"
                  onClick={() => setShowAIOptions(!showAIOptions)}
                >
                  {showAIOptions ? "Hide AI options" : "Change AI model"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
