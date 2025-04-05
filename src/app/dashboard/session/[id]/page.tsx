"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Send, Zap } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { MicroPost } from "@/components/micro-post"
import { AIModelSelector } from "@/components/ai-model-selector"

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
}

export default function SessionPage({ params }: { params: { id: string } }) {
  const [session, setSession] = useState(mockSession)
  const [newPost, setNewPost] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [showAIOptions, setShowAIOptions] = useState(false)

  const handleAddPost = () => {
    if (!newPost.trim()) return

    const post = {
      id: `p${Date.now()}`,
      content: newPost,
      createdAt: new Date().toISOString(),
    }

    setSession({
      ...session,
      posts: [...session.posts, post],
    })

    setNewPost("")
  }

  const handleGenerateBlog = () => {
    setIsGenerating(true)

    // Simulate AI processing
    setTimeout(() => {
      setIsGenerating(false)
      // Here you would redirect to the generated blog
      window.location.href = `/dashboard/generated/${session.id}`
    }, 2000)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-6">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sessions
          </Link>
          <h1 className="text-2xl font-bold">{session.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{session.posts.length} posts in this session</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-4">
                <Textarea
                  placeholder="What's on your mind? Add a new thought to this session..."
                  className="min-h-[100px] resize-none border-0 p-0 focus-visible:ring-0"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                />
                <div className="flex justify-end mt-2">
                  <Button onClick={handleAddPost} className="gap-1">
                    <Send className="h-4 w-4" />
                    Post
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {session.posts.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No posts yet. Add your first thought above!</p>
              ) : (
                session.posts.map((post) => <MicroPost key={post.id} post={post} />)
              )}
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-2">Generate Blog Post</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Convert this session into a structured blog post using AI.
                </p>

                {showAIOptions ? (
                  <AIModelSelector onClose={() => setShowAIOptions(false)} />
                ) : (
                  <Button
                    onClick={handleGenerateBlog}
                    className="w-full gap-1"
                    disabled={session.posts.length === 0 || isGenerating}
                  >
                    <Zap className="h-4 w-4" />
                    {isGenerating ? "Generating..." : "Generate Blog"}
                  </Button>
                )}

                <Button variant="link" className="w-full mt-2 text-xs" onClick={() => setShowAIOptions(!showAIOptions)}>
                  {showAIOptions ? "Hide AI options" : "Change AI model"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

