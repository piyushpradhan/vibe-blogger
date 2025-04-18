"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Sparkles, Filter, ArrowRight, Calendar, MessageSquare, Zap } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { EmptyState } from "@/components/empty-state"
import { SessionCard } from "@/components/session-card"
import { api } from "@/trpc/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type SortOption = "newest" | "oldest" | "most-posts" | "least-posts"
type ModelFilter = "all" | "gemini" | "gpt" | "claude"

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("newest")
  const [modelFilter, setModelFilter] = useState<ModelFilter>("all")
  const { data: sessions = [], isLoading } = api.session.getAll.useQuery()

  // Filter sessions by search query and model
  const filteredSessions = sessions.filter((session) => {
    const matchesSearch = session.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesModel = modelFilter === "all" || session.model === modelFilter
    return matchesSearch && matchesModel
  })

  // Sort sessions based on selected option
  const sortedSessions = [...filteredSessions].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      case "oldest":
        return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
      case "most-posts":
        return b.posts.length - a.posts.length
      case "least-posts":
        return a.posts.length - b.posts.length
      default:
        return 0
    }
  })

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-[320px] sm:max-w-[640px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1200px] py-8">
        <div className="max-w-[1200px] mx-auto">
          {/* Hero Section */}
          <div className="bg-white border border-border/50 rounded-lg p-5 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Your Sessions</h1>
                <p className="text-muted-foreground mt-1">
                  Organize and manage your thought sessions
                </p>
              </div>
              <Link href="/dashboard/new-session" className="group">
                <Button size="lg" className="gap-1.5 shadow-sm hover:shadow-md transition-all duration-200 group-hover:translate-x-1">
                  <div className="relative w-4 h-4">
                    <Plus className="h-4 w-4 group-hover:opacity-0 transition-opacity duration-200" />
                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute inset-0" />
                  </div>
                  New Session
                </Button>
              </Link>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search your sessions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 bg-muted/50 focus:bg-background transition-colors duration-200"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1.5">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                  <DropdownMenuRadioItem value="newest" className="gap-2">
                    <Calendar className="h-4 w-4" />
                    Newest first
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="oldest" className="gap-2">
                    <Calendar className="h-4 w-4" />
                    Oldest first
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="most-posts" className="gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Most posts
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="least-posts" className="gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Least posts
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>AI Model</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={modelFilter} onValueChange={(value) => setModelFilter(value as ModelFilter)}>
                  <DropdownMenuRadioItem value="all" className="gap-2">
                    <Zap className="h-4 w-4" />
                    All models
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="gemini" className="gap-2">
                    <Zap className="h-4 w-4" />
                    Gemini
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="gpt" className="gap-2">
                    <Zap className="h-4 w-4" />
                    GPT
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="claude" className="gap-2">
                    <Zap className="h-4 w-4" />
                    Claude
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              {sortedSessions.length} {sortedSessions.length === 1 ? 'session' : 'sessions'} found
            </p>
          </div>

          {/* Content Section */}
          {isLoading ? (
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <div className="col-span-full flex items-center justify-center py-12 w-full">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            </div>
          ) : sortedSessions.length === 0 ? (
            <div className="w-full flex flex-col items-center justify-center py-16 px-8 text-center bg-muted/30 rounded-lg border border-border/50">
              <div className="rounded-full bg-primary/10 p-4 mb-6">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">
                {searchQuery || modelFilter !== "all" ? "No matching sessions found" : "Your first session awaits!"}
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                {searchQuery || modelFilter !== "all"
                  ? "Try adjusting your search terms or filters to find what you're looking for."
                  : "Start your journey by creating your first session. Capture your thoughts, organize your ideas, and watch them transform into something amazing."}
              </p>
              <Link href="/dashboard/new-session" className="group">
                <Button size="lg" className="gap-1.5 group-hover:translate-x-1 transition-transform duration-200">
                  <div className="relative w-4 h-4">
                    <Plus className="h-4 w-4 group-hover:opacity-0 transition-opacity duration-200" />
                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute inset-0" />
                  </div>
                  Create Your First Session
                </Button>
              </Link>
            </div>
          ) : (
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedSessions.map((session) => (
                <SessionCard 
                  key={session.id} 
                  session={{
                    id: session.id,
                    title: session.title,
                    postCount: session.posts.length,
                    updatedAt: session.updatedAt.toISOString(),
                    preview: session.description || "No description provided",
                  }} 
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

