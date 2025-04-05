"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"

export default function NewSessionPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) return

    setIsCreating(true)

    // Simulate API call to create session
    setTimeout(() => {
      setIsCreating(false)
      // Redirect to the new session (using a mock ID for now)
      router.push("/dashboard/session/new-session-id")
    }, 1000)
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
            Back to dashboard
          </Link>
          <h1 className="text-2xl font-bold">Create New Session</h1>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Session Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Link href="/dashboard">
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={!title.trim() || isCreating}>
                  {isCreating ? "Creating..." : "Create Session"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
    </div>
  )
}

