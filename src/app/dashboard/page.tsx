"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { EmptyState } from "@/components/empty-state"
import { SessionCard } from "@/components/session-card"

// Mock data for sessions
const mockSessions = [
  {
    id: "1",
    title: "Web Development Best Practices",
    postCount: 12,
    updatedAt: "2025-03-28T12:00:00Z",
    preview: "Thoughts on modern web development approaches and tools...",
  },
  {
    id: "2",
    title: "AI in Healthcare",
    postCount: 8,
    updatedAt: "2025-03-25T15:30:00Z",
    preview: "Exploring the potential of artificial intelligence in medical diagnostics...",
  },
  {
    id: "3",
    title: "Future of Remote Work",
    postCount: 15,
    updatedAt: "2025-03-20T09:15:00Z",
    preview: "Analyzing trends and challenges in distributed teams and virtual collaboration...",
  },
]

export default function DashboardPage() {
  const [sessions, setSessions] = useState(mockSessions)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredSessions = sessions.filter((session) => session.title.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Your Sessions</h1>
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Input
                placeholder="Search sessions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Link href="/dashboard/new-session">
              <Button className="gap-1">
                <Plus className="h-4 w-4" />
                New Session
              </Button>
            </Link>
          </div>
        </div>

        {filteredSessions.length === 0 ? (
          <EmptyState
            title="No sessions found"
            description={searchQuery ? "Try a different search term" : "Create your first session to get started"}
            action={
              <Link href="/dashboard/new-session">
                <Button className="gap-1">
                  <Plus className="h-4 w-4" />
                  New Session
                </Button>
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

