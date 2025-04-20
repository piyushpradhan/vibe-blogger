"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Filter, Calendar, FileText, Trash2 } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { api } from "@/trpc/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type SortOption = "newest" | "oldest"

type Blog = {
  id: string
  title: string
  content: string
  sessionId: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

export default function GeneratedBlogsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("newest")
  const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null)
  const { data: blogs = [], isLoading } = api.blog.getAll.useQuery<Blog[]>()
  const utils = api.useUtils()

  const deleteBlogMutation = api.blog.delete.useMutation({
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await utils.blog.getAll.cancel();
      
      // Snapshot the previous value
      const previousBlogs = utils.blog.getAll.getData();
      
      // Optimistically update to the new value
      if (previousBlogs) {
        utils.blog.getAll.setData(undefined, previousBlogs.filter(blog => blog.id !== variables.id));
      }
      
      // Return a context object with the snapshotted value
      return { previousBlogs };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousBlogs) {
        utils.blog.getAll.setData(undefined, context.previousBlogs);
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the correct data
      void utils.blog.getAll.invalidate();
    },
  });

  // Filter blogs by search query
  const filteredBlogs = blogs.filter((blog: Blog) => 
    blog.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Sort blogs based on selected option
  const sortedBlogs = [...filteredBlogs].sort((a: Blog, b: Blog) => {
    switch (sortBy) {
      case "newest":
        return b.createdAt.getTime() - a.createdAt.getTime()
      case "oldest":
        return a.createdAt.getTime() - b.createdAt.getTime()
      default:
        return 0
    }
  })

  const handleDelete = (blog: Blog) => {
    setBlogToDelete(blog)
  }

  const confirmDelete = () => {
    if (blogToDelete) {
      deleteBlogMutation.mutate({ id: blogToDelete.id })
      setBlogToDelete(null)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-[320px] sm:max-w-[640px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1200px] py-8">
        <div className="max-w-[1200px] mx-auto">
          {/* Hero Section */}
          <div className="bg-white border border-border/50 rounded-lg p-5 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Generated Blogs</h1>
                <p className="text-muted-foreground mt-1">
                  View and manage your AI-generated blog posts
                </p>
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search your blogs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 bg-muted/50 focus:bg-background transition-colors duration-200"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1.5">
                  <Filter className="h-4 w-4" />
                  Sort by
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
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              {sortedBlogs.length} {sortedBlogs.length === 1 ? 'blog' : 'blogs'} found
            </p>
          </div>

          {/* Content Section */}
          {isLoading ? (
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <div className="col-span-full flex items-center justify-center py-12 w-full">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            </div>
          ) : sortedBlogs.length === 0 ? (
            <div className="w-full flex flex-col items-center justify-center py-16 px-8 text-center bg-muted/30 rounded-lg border border-border/50">
              <div className="rounded-full bg-primary/10 p-4 mb-6">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">
                {searchQuery ? "No matching blogs found" : "No blogs generated yet"}
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                {searchQuery
                  ? "Try adjusting your search terms to find what you're looking for."
                  : "Generate your first blog post from one of your sessions to see it here."}
              </p>
              <Link href="/dashboard">
                <Button size="lg" className="gap-1.5">
                  Go to Sessions
                </Button>
              </Link>
            </div>
          ) : (
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedBlogs.map((blog) => (
                <div key={blog.id} className="relative group">
                  <Link href={`/dashboard/generated/${blog.id}`}>
                    <Card className="h-full hover:shadow-md transition-shadow duration-200 py-0">
                      <CardContent className="p-6">
                        <h3 className="font-semibold mb-2 line-clamp-2">{blog.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                          {blog.content}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Generated {new Date(blog.createdAt).toLocaleDateString()}</span>
                          <span>From Session</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    onClick={(e) => {
                      e.preventDefault()
                      handleDelete(blog)
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <AlertDialog open={!!blogToDelete} onOpenChange={() => setBlogToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Blog</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this blog? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 