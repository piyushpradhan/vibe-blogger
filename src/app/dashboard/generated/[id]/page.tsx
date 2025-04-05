"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Copy, Download, Edit } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"

// Mock data for a generated blog
const mockBlog = {
  id: "1",
  title: "Web Development Best Practices: A Comprehensive Guide",
  content: `# Web Development Best Practices: A Comprehensive Guide

## Introduction

In today's rapidly evolving digital landscape, web development best practices are essential for creating robust, accessible, and maintainable applications. This guide explores key considerations for modern web developers.

## Error Handling in Production

One of the most critical aspects of production applications is proper error handling. Users should never encounter raw stack traces or technical errors that expose implementation details. Instead:

- Implement global error boundaries in frontend applications
- Use try/catch blocks with appropriate fallbacks
- Log errors on the server for debugging while showing user-friendly messages
- Consider different error states in your UI design from the beginning

## Client-Side vs. Server-Side Rendering

The decision between client-side and server-side rendering involves important tradeoffs:

### Client-Side Rendering
- Better for highly interactive applications
- Reduces server load
- Enables rich client-side interactions
- May impact initial load performance and SEO

### Server-Side Rendering
- Improves initial page load and SEO
- Better for content-focused websites
- Reduces client-side JavaScript requirements
- May increase server resource usage

The best approach often combines both techniques through hybrid rendering strategies.

## Accessibility as a Priority

Accessibility should never be an afterthought. Building accessible applications from day one:

- Ensures compliance with legal requirements
- Expands your potential user base
- Often improves the experience for all users
- Results in cleaner, more semantic code

Key accessibility practices include proper semantic HTML, keyboard navigation support, sufficient color contrast, and thorough testing with screen readers.

## Conclusion

By prioritizing error handling, making informed rendering decisions, and embedding accessibility into your development process, you can create web applications that are robust, performant, and inclusive.`,
  sessionId: "1",
  createdAt: "2025-03-28T14:30:00Z",
}

export default function GeneratedBlogPage({ params }: { params: { id: string } }) {
  const [blog, setBlog] = useState(mockBlog)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(blog.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const element = document.createElement("a")
    const file = new Blob([blog.content], { type: "text/markdown" })
    element.href = URL.createObjectURL(file)
    element.download = `${blog.title.replace(/\s+/g, "-").toLowerCase()}.md`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
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
              {blog.content.split("\n\n").map((paragraph, index) => {
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
                      {paragraph.split("\n").map((item, i) => (
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

