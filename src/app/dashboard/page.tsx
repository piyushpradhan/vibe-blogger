"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Sparkles, Filter } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { EmptyState } from "@/components/empty-state"
import { SessionCard } from "@/components/session-card"
import { api } from "@/trpc/react"

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const { data: sessions = [], isLoading } = api.session.getAll.useQuery()

  const filteredSessions = sessions.filter((session) => 
    session.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 mx-auto w-full px-4 sm:px-8 lg:px-12 py-8">
        <div className="max-w-[1200px] mx-auto">
          {/* Hero Section */}
          <div className="bg-muted/40 border border-border/50 rounded-lg p-5 mb-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Your Sessions</h1>
                <p className="text-muted-foreground mt-1">
                  Organize and manage your thought sessions
                </p>
              </div>
              <Link href="/dashboard/new-session">
                <Button size="lg" className="gap-1.5 shadow-sm hover:shadow-md transition-all duration-200">
                  <Plus className="h-4 w-4" />
                  New Session
                </Button>
              </Link>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search your sessions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 bg-muted/50 focus:bg-background transition-colors duration-200"
              />
            </div>
            <Button variant="outline" className="gap-1.5">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              {filteredSessions.length} {filteredSessions.length === 1 ? 'session' : 'sessions'} found
            </p>
          </div>

          {/* Content Section */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-muted/30 rounded-lg border border-border/50">
              <div className="rounded-full bg-primary/10 p-4 mb-6">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">
                {searchQuery ? "No matching sessions found" : "Your first session awaits!"}
              </h2>
              <p className="text-muted-foreground max-w-md mb-6">
                {searchQuery 
                  ? "Try adjusting your search terms to find what you're looking for."
                  : "Start your journey by creating your first session. Capture your thoughts, organize your ideas, and watch them transform into something amazing."}
              </p>
              <Link href="/dashboard/new-session">
                <Button size="lg" className="gap-1.5">
                  <Plus className="h-4 w-4" />
                  Create Your First Session
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredSessions.map((session) => (
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

