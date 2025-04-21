"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Sparkles, Lightbulb } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard-header";
import { api } from "@/trpc/react";

export default function NewSessionPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const utils = api.useUtils();

  useEffect(() => {
    // Add a small delay to create a smooth entrance animation
    const timer = setTimeout(() => {
      setIsPageLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const createSession = api.session.create.useMutation({
    onSuccess: (session) => {
      // Invalidate the sessions list query to refresh the data
      void utils.session.getAll.invalidate();
      router.push(`/dashboard/session/${session.id}`);
    },
    onError: (error) => {
      console.error("Failed to create session:", error);
      setIsCreating(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    setIsCreating(true);

    createSession.mutate({
      title: title.trim(),
      description: description.trim(),
      model: "gemini", // Always use Gemini as the default model
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="mx-auto max-w-[1200px] flex-1 px-4 py-8 sm:px-8 lg:px-12">
        <div
          className={`mb-8 transition-opacity duration-500 ${isPageLoaded ? "opacity-100" : "opacity-0"}`}
        >
          <Link
            href="/dashboard"
            className="text-muted-foreground hover:text-foreground group mb-4 inline-flex items-center gap-1.5 text-sm transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
            Back to dashboard
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">
            Create New Session
          </h1>
          <p className="text-muted-foreground mt-2">
            Start a new session to begin your journey
          </p>
        </div>

        <div
          className={`mx-auto max-w-3xl transition-all duration-500 md:w-xl lg:w-2xl ${isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
        >
          <Card className="border-primary/10 shadow-lg transition-shadow duration-300 hover:shadow-xl">
            <form onSubmit={handleSubmit}>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 rounded-full p-2">
                    <Lightbulb className="text-primary h-5 w-5" />
                  </div>
                  <CardTitle className="text-xl">Session Details</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Session Title
                  </label>
                  <Input
                    id="title"
                    placeholder="E.g., Web Development Best Practices"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="focus-visible:ring-primary transition-colors duration-200 focus-visible:ring-2"
                    autoFocus
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description (Optional)
                  </label>
                  <Textarea
                    id="description"
                    placeholder="What's this session about?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="focus-visible:ring-primary transition-colors duration-200 focus-visible:ring-2"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-3 pt-6">
                <Link href="/dashboard">
                  <Button
                    variant="outline"
                    type="button"
                    className="hover:bg-muted/50 transition-colors duration-200"
                  >
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={!title.trim() || isCreating}
                  className="bg-primary hover:bg-primary/90 gap-1.5 transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isCreating ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Creating...
                    </span>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Create Session
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
}
