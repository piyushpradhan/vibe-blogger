"use client"

import { useState } from "react"
import { use } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Copy, Download, Edit } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { api } from "@/trpc/react"

export default function GeneratedBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const [copied, setCopied] = useState(false)
  const { id } = use(params);

  const { data: blog, isLoading } = api.blog.getById.useQuery({ id })

  const handleCopy = async () => {
    if (!blog) return
    try {
      await navigator.clipboard.writeText(blog.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy text:', error)
    }
  }

  const handleDownload = () => {
    if (!blog) return
    const element = document.createElement("a")
    const file = new Blob([blog.content], { type: "text/markdown" })
    element.href = URL.createObjectURL(file)
    element.download = `${blog.title.replace(/\s+/g, "-").toLowerCase()}.md`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <main className="flex-1 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        </main>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <main className="flex-1 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-6">
          <div className="flex flex-col items-center justify-center h-64">
            <h1 className="text-2xl font-bold mb-4">Blog not found</h1>
            <Link href="/dashboard">
              <Button>Back to Dashboard</Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-6">
        <div className="mb-6">
          <Link
            href={`/dashboard/session/${blog.sessionId}`}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to session
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{blog.title}</h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1" onClick={handleCopy}>
                <Copy className="h-4 w-4" />
                {copied ? "Copied!" : "Copy"}
              </Button>
              <Button variant="outline" size="sm" className="gap-1" onClick={handleDownload}>
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
          <CardContent className="p-6">
            <div className="prose prose-sm sm:prose lg:prose-lg max-w-none">
              {blog.content.split("\n\n").map((paragraph: string, index: number) => {
                if (paragraph.startsWith("# ")) {
                  return (
                    <h1 key={index} className="text-3xl font-bold mt-6 mb-4">
                      {paragraph.substring(2)}
                    </h1>
                  )
                } else if (paragraph.startsWith("## ")) {
                  return (
                    <h2 key={index} className="text-2xl font-semibold mt-6 mb-3">
                      {paragraph.substring(3)}
                    </h2>
                  )
                } else if (paragraph.startsWith("### ")) {
                  return (
                    <h3 key={index} className="text-xl font-medium mt-5 mb-2">
                      {paragraph.substring(4)}
                    </h3>
                  )
                } else if (paragraph.startsWith("- ")) {
                  return (
                    <ul key={index} className="list-disc pl-5 my-3">
                      {paragraph.split("\n").map((item: string, i: number) => (
                        <li key={i} className="my-1">
                          {item.substring(2)}
                        </li>
                      ))}
                    </ul>
                  )
                } else {
                  return (
                    <p key={index} className="my-3">
                      {paragraph}
                    </p>
                  )
                }
              })}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

