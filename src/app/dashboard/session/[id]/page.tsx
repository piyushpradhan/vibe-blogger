"use client";

import { useState, useRef } from "react";
import { use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Send, Zap, MessageSquare, Sparkles } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard-header";
import { SortableMicroPost } from "@/components/sortable-micro-post";
import { AIModelSelector } from "@/components/ai-model-selector";
import { api } from "@/trpc/react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimation,
} from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { DraggablePostOverlay } from "@/components/draggable-post-overlay";
import { useClickOutside } from "@/hooks/use-click-outside";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

export default function SessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const { data: session, isLoading } = api.session.getById.useQuery({ id });
  const utils = api.useUtils();
  const addPostMutation = api.session.addPost.useMutation({
    onMutate: async (newPost) => {
      // Cancel any outgoing refetches
      await utils.session.getById.cancel({ id });

      // Snapshot the previous value
      const previousSession = utils.session.getById.getData({ id });

      // Optimistically update to the new value
      if (previousSession) {
        utils.session.getById.setData(
          { id },
          {
            ...previousSession,
            posts: [
              ...previousSession.posts,
              {
                id: `temp-${Date.now()}`, // Temporary ID
                content: newPost.content,
                createdAt: new Date(),
                sessionId: newPost.sessionId,
                userId: previousSession.userId,
                updatedAt: new Date(),
              },
            ],
          },
        );
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
    onMutate: async () => {
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
    onError: (error) => {
      setIsGenerating(false);
      console.error("Error generating blog:", error);
      // You might want to show a toast or alert here
      alert(error.message || "Failed to generate blog");
    },
  });

  const updateSessionMutation = api.session.update.useMutation();

  const [newPost, setNewPost] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAIOptions, setShowAIOptions] = useState(false);
  const [selectedModel, setSelectedModel] = useState<
    "gemini" | "gpt" | "claude"
  >((session?.model as "gemini" | "gpt" | "claude") || "gemini");
  const [activePost, setActivePost] = useState<{ content: string } | null>(
    null,
  );
  const titleUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const descriptionUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);

  // Configure sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px of movement required before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Configure drop animation
  const dropAnimation = {
    ...defaultDropAnimation,
    dragSourceOpacity: 0.5,
  };

  // Set up click outside handlers
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

  const handleAddPost = () => {
    if (!newPost.trim() || !session) return;

    addPostMutation.mutate({
      sessionId: session.id,
      content: newPost,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Check for Cmd+Enter (Mac) or Ctrl+Enter (Windows/Linux)
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault(); // Prevent default behavior
      handleAddPost();
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activePost = session?.posts.find((post) => post.id === active.id);
    if (activePost) {
      setActivePost(activePost);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActivePost(null);
    const { active, over } = event;

    if (over && active.id !== over.id && session) {
      const oldIndex = session.posts.findIndex((post) => post.id === active.id);
      const newIndex = session.posts.findIndex((post) => post.id === over.id);

      // Create a new array with the reordered posts
      const newPosts = [...session.posts];
      const [movedPost] = newPosts.splice(oldIndex, 1);

      if (movedPost) {
        newPosts.splice(newIndex, 0, movedPost);

        // Update the local state optimistically
        utils.session.getById.setData(
          { id },
          {
            ...session,
            posts: newPosts,
          },
        );

        // Update the order on the server
        updatePostOrderMutation.mutate({
          sessionId: session.id,
          postIds: newPosts.map((post) => post.id),
        });
      }
    }
  };

  const handleModelChange = (model: "gemini" | "gpt" | "claude") => {
    setSelectedModel(model);
    if (session) {
      updateSessionMutation.mutate({
        id: session.id,
        model: model,
      });
    }
  };

  const handleGenerateBlog = () => {
    if (!session) return;
    setIsGenerating(true);

    createBlogMutation.mutate({
      sessionId: session.id,
      model: selectedModel,
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <main className="mx-auto max-w-[1200px] flex-1 px-4 py-8 sm:px-8 lg:px-12">
          <div className="flex h-[50vh] items-center justify-center">
            <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
          </div>
        </main>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <main className="mx-auto max-w-[1200px] flex-1 px-4 py-8 sm:px-8 lg:px-12">
          <div className="flex h-[50vh] flex-col items-center justify-center">
            <h1 className="mb-4 text-2xl font-bold">Session not found</h1>
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
      <main className="mx-auto max-w-[1200px] flex-1 px-4 py-8 sm:px-8 lg:px-12">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1.5 text-sm transition-colors duration-200"
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
                          utils.session.getById.setData(
                            { id },
                            {
                              ...session,
                              title: e.target.value,
                            },
                          );
                          // Debounce the update
                          if (titleUpdateTimeoutRef.current) {
                            clearTimeout(titleUpdateTimeoutRef.current);
                          }
                          titleUpdateTimeoutRef.current = setTimeout(() => {
                            updateSessionMutation.mutate({
                              id: session.id,
                              title: e.target.value,
                            });
                          }, 500);
                        }}
                        className="hover:bg-muted/50 -mx-1 w-full truncate rounded border-none bg-transparent p-0 px-1 text-3xl font-bold tracking-tight transition-colors focus:ring-0 focus:outline-none"
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
                          utils.session.getById.setData(
                            { id },
                            {
                              ...session,
                              description: e.target.value,
                            },
                          );
                          // Debounce the update
                          if (descriptionUpdateTimeoutRef.current) {
                            clearTimeout(descriptionUpdateTimeoutRef.current);
                          }
                          descriptionUpdateTimeoutRef.current = setTimeout(
                            () => {
                              updateSessionMutation.mutate({
                                id: session.id,
                                description: e.target.value,
                              });
                            },
                            500,
                          );
                        }}
                        className="text-muted-foreground hover:bg-muted/50 -mx-1 w-full max-w-xl resize-none overflow-hidden rounded border-none bg-transparent p-0 px-1 transition-colors focus:ring-0 focus:outline-none"
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
                {session.posts.length}{" "}
                {session.posts.length === 1 ? "thought" : "thoughts"} captured
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-8">
            <Card className="py-0 shadow-sm transition-shadow duration-200 hover:shadow-md">
              <CardContent className="p-6">
                <Textarea
                  placeholder="What's on your mind? Add a new thought to this session..."
                  className="min-h-[120px] resize-none border-0 p-0 text-lg focus-visible:ring-0"
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
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
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
                <div className="bg-muted/30 flex flex-col items-center justify-center rounded-lg px-4 py-16 text-center">
                  <div className="bg-primary/10 mb-6 rounded-full p-4">
                    <MessageSquare className="text-primary h-8 w-8" />
                  </div>
                  <h2 className="mb-2 text-2xl font-semibold">
                    Start Your Thought Journey
                  </h2>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    Your first thought is just a click away. Share your ideas,
                    insights, or questions above and watch your session come to
                    life.
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
                      items={session.posts.map((post) => post.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="flex flex-col gap-3">
                        {session.posts
                          .slice()
                          .reverse()
                          .map(
                            (post: {
                              id: string;
                              content: string;
                              createdAt: Date;
                              sessionId: string;
                              userId: string;
                              updatedAt: Date;
                            }) => (
                              <SortableMicroPost
                                key={post.id}
                                post={post}
                                sessionId={session.id}
                              />
                            ),
                          )}
                      </div>
                    </SortableContext>
                    <DragOverlay dropAnimation={dropAnimation}>
                      {activePost ? (
                        <DraggablePostOverlay post={activePost} />
                      ) : null}
                    </DragOverlay>
                  </DndContext>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6 lg:col-span-4">
            <Card className="py-0 shadow-sm transition-shadow duration-200 hover:shadow-md">
              <CardContent className="p-6">
                <div className="mb-2 flex items-center gap-2">
                  <Zap className="text-primary h-5 w-5" />
                  <h3 className="font-semibold">Generate Blog Post</h3>
                </div>
                <p className="text-muted-foreground mb-6 text-sm">
                  Transform your thoughts into a polished blog post using AI.
                  Select your preferred model and let the magic happen.
                </p>
                <div className="mb-4 flex items-center gap-2">
                  <span className="text-muted-foreground text-sm">
                    Current model:
                  </span>
                  <Badge variant="outline" className="font-medium">
                    {selectedModel === "gemini"
                      ? "Gemini"
                      : selectedModel === "gpt"
                        ? "ChatGPT"
                        : "Claude"}
                  </Badge>
                </div>

                {showAIOptions ? (
                  <AIModelSelector
                    onClose={() => setShowAIOptions(false)}
                    currentModel={selectedModel}
                    onModelChange={handleModelChange}
                  />
                ) : (
                  <Button
                    onClick={handleGenerateBlog}
                    className="w-full gap-1.5"
                    disabled={!session?.posts?.length || isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        {session?.posts?.length
                          ? "Generate Blog"
                          : "Add thoughts to generate blog"}
                      </>
                    )}
                  </Button>
                )}

                <Button
                  variant="link"
                  className="mt-2 w-full text-xs"
                  onClick={() => setShowAIOptions(!showAIOptions)}
                  disabled={!session?.posts?.length}
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
