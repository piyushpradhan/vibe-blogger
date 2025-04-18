"use client";

import { useState, useRef } from "react";
import { use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Send, Zap, MessageSquare, Sparkles, Pencil } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard-header";
import { MicroPost } from "@/components/micro-post";
import { SortableMicroPost } from "@/components/sortable-micro-post";
import { AIModelSelector } from "@/components/ai-model-selector";
import { api } from "@/trpc/react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay, defaultDropAnimation } from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { DraggablePostOverlay } from "@/components/draggable-post-overlay";
import { useClickOutside } from "@/hooks/use-click-outside";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [newPost, setNewPost] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAIOptions, setShowAIOptions] = useState(false);
  const [activePost, setActivePost] = useState<{ content: string } | null>(null);
  const titleUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const descriptionUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);

  const { data: session, isLoading } = api.session.getById.useQuery({ id });
  const addPostMutation = api.session.addPost.useMutation({
    onMutate: async (newPost) => {
      // Cancel any outgoing refetches
      await utils.session.getById.cancel({ id });
      
      // Snapshot the previous value
      const previousSession = utils.session.getById.getData({ id });
      
      // Optimistically update to the new value
      if (previousSession) {
        utils.session.getById.setData({ id }, {
          ...previousSession,
          posts: [
            ...previousSession.posts,
            {
              id: `temp-${Date.now()}`, // Temporary ID
              content: newPost.content,
              createdAt: new Date(),
              sessionId: newPost.sessionId,
              userId: previousSession.userId,
              updatedAt: new Date()
            }
          ]
        });
      }
      
      // Return a context object with the snapshotted value
      return { previousSession };
    },
    onError: (err, newPost, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousSession) {
        utils.session.getById.setData({ id }, context.previousSession);
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the correct data
      void utils.session.getById.invalidate({ id });
    },
    onSuccess: () => {
      setNewPost("");
    },
  });

  const updatePostOrderMutation = api.session.updatePostOrder.useMutation({
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await utils.session.getById.cancel({ id });
      
      // Snapshot the previous value
      const previousSession = utils.session.getById.getData({ id });
      
      // Return a context object with the snapshotted value
      return { previousSession };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousSession) {
        utils.session.getById.setData({ id }, context.previousSession);
      }
    },
  });

  const createBlogMutation = api.blog.create.useMutation({
    onSuccess: (blog) => {
      setIsGenerating(false);
      // Redirect to the generated blog
      window.location.href = `/dashboard/generated/${blog.id}`;
    },
  });

  const utils = api.useUtils();
  const updateSessionMutation = api.session.update.useMutation();

  const handleAddPost = () => {
    if (!newPost.trim() || !session) return;

    addPostMutation.mutate({
      sessionId: session.id,
      content: newPost,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Check for Cmd+Enter (Mac) or Ctrl+Enter (Windows/Linux)
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault(); // Prevent default behavior
      handleAddPost();
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activePost = session?.posts.find(post => post.id === active.id);
    if (activePost) {
      setActivePost(activePost);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActivePost(null);
    const { active, over } = event;
    
    if (over && active.id !== over.id && session) {
      const oldIndex = session.posts.findIndex(post => post.id === active.id);
      const newIndex = session.posts.findIndex(post => post.id === over.id);
      
      // Create a new array with the reordered posts
      const newPosts = [...session.posts];
      const [movedPost] = newPosts.splice(oldIndex, 1);
      
      if (movedPost) {
        newPosts.splice(newIndex, 0, movedPost);
        
        // Update the local state optimistically
        utils.session.getById.setData({ id }, {
          ...session,
          posts: newPosts
        });
        
        // Update the order on the server
        updatePostOrderMutation.mutate({
          sessionId: session.id,
          postIds: newPosts.map(post => post.id)
        });
      }
    }
  };

  // Configure sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px of movement required before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Configure drop animation
  const dropAnimation = {
    ...defaultDropAnimation,
    dragSourceOpacity: 0.5,
  };

  const handleGenerateBlog = () => {
    if (!session) return;
    setIsGenerating(true);

    // TODO: Replace this with actual AI processing
    const mockBlogContent = `# ${session.title}

## Introduction

This is a generated blog post based on your session "${session.title}". The content will be generated using AI in the future.

## Key Points

${session.posts.map((post) => `- ${post.content}`).join("\n")}

## Conclusion

Thank you for using Vibe Blogger to generate your content.`;

    createBlogMutation.mutate({
      title: session.title,
      content: mockBlogContent,
      sessionId: session.id,
    });
  };

  const handleDeletePost = () => {
    // Invalidate the session query to refresh the data
    void utils.session.getById.invalidate({ id });
  };

  useClickOutside(titleInputRef as React.RefObject<HTMLElement>, () => {
    if (titleInputRef.current) {
      titleInputRef.current.blur();
    }
  });

  useClickOutside(descriptionInputRef as React.RefObject<HTMLElement>, () => {
    if (descriptionInputRef.current) {
      descriptionInputRef.current.blur();
    }
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <main className="flex-1 mx-auto px-4 sm:px-8 lg:px-12 max-w-[1200px] py-8">
          <div className="flex items-center justify-center h-[50vh]">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        </main>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <main className="flex-1 mx-auto px-4 sm:px-8 lg:px-12 max-w-[1200px] py-8">
          <div className="flex flex-col items-center justify-center h-[50vh]">
            <h1 className="text-2xl font-bold mb-4">Session not found</h1>
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
      <main className="flex-1 mx-auto px-4 sm:px-8 lg:px-12 max-w-[1200px] py-8">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sessions
          </Link>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-full">
                      <input
                        ref={titleInputRef}
                        type="text"
                        value={session.title}
                        onChange={(e) => {
                          utils.session.getById.setData({ id }, {
                            ...session,
                            title: e.target.value
                          });
                          // Debounce the update
                          if (titleUpdateTimeoutRef.current) {
                            clearTimeout(titleUpdateTimeoutRef.current);
                          }
                          titleUpdateTimeoutRef.current = setTimeout(() => {
                            updateSessionMutation.mutate({
                              id: session.id,
                              title: e.target.value
                            });
                          }, 500);
                        }}
                        className="text-3xl font-bold tracking-tight bg-transparent border-none focus:outline-none focus:ring-0 p-0 hover:bg-muted/50 rounded px-1 -mx-1 transition-colors w-full truncate"
                        title={session.title}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{session.title}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-full">
                      <textarea
                        ref={descriptionInputRef}
                        placeholder="Add a description..."
                        value={session.description || ""}
                        onChange={(e) => {
                          utils.session.getById.setData({ id }, {
                            ...session,
                            description: e.target.value
                          });
                          // Debounce the update
                          if (descriptionUpdateTimeoutRef.current) {
                            clearTimeout(descriptionUpdateTimeoutRef.current);
                          }
                          descriptionUpdateTimeoutRef.current = setTimeout(() => {
                            updateSessionMutation.mutate({
                              id: session.id,
                              description: e.target.value
                            });
                          }, 500);
                        }}
                        className="text-muted-foreground bg-transparent border-none focus:outline-none focus:ring-0 p-0 hover:bg-muted/50 rounded px-1 -mx-1 transition-colors w-full max-w-xl resize-none overflow-hidden"
                        rows={3}
                        style={{
                          maxHeight: "4.5em", // 3 lines * 1.5em line height
                        }}
                        title={session.description || ""}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{session.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <p className="text-muted-foreground text-sm">
                {session.posts.length} {session.posts.length === 1 ? 'thought' : 'thoughts'} captured
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-8">
            <Card className="shadow-sm hover:shadow-md transition-shadow duration-200 py-0">
              <CardContent className="p-6">
                <Textarea
                  placeholder="What's on your mind? Add a new thought to this session..."
                  className="min-h-[120px] resize-none border-0 p-0 focus-visible:ring-0 text-lg"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <div className="mt-4 flex justify-end">
                  <Button 
                    onClick={handleAddPost} 
                    className="gap-1.5"
                    disabled={!newPost.trim() || addPostMutation.isPending}
                  >
                    {addPostMutation.isPending ? (
                      <>
                        <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                        Posting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Post Thought
                      </>
                    )}
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
                <div className="overflow-hidden">
                  <DndContext 
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    autoScroll={false}
                  >
                    <SortableContext 
                      items={session.posts.map(post => post.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="flex flex-col gap-3">
                        {session.posts.slice().reverse().map((post: { id: string; content: string; createdAt: Date; sessionId: string; userId: string; updatedAt: Date }) => (
                          <SortableMicroPost 
                            key={post.id} 
                            post={post}
                            sessionId={session.id}
                            onDelete={handleDeletePost}
                          />
                        ))}
                      </div>
                    </SortableContext>
                    <DragOverlay dropAnimation={dropAnimation}>
                      {activePost ? <DraggablePostOverlay post={activePost} /> : null}
                    </DragOverlay>
                  </DndContext>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <Card className="shadow-sm hover:shadow-md transition-shadow duration-200 py-0">
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
