import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, MessageSquare, Zap } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <MessageSquare className="h-6 w-6" />
              <span className="font-bold">ThoughtStream</span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link href="/features" className="transition-colors hover:text-foreground/80">
                Features
              </Link>
              <Link href="/pricing" className="transition-colors hover:text-foreground/80">
                Pricing
              </Link>
              <Link href="/docs" className="transition-colors hover:text-foreground/80">
                Docs
              </Link>
            </nav>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost" className="text-sm">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="text-sm">
                Sign up
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="space-y-6 pb-8 pt-12 md:pb-12 md:pt-24 lg:py-32">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-[64rem] flex flex-col items-center gap-4 text-center">
            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
              Microblog now, <span className="text-primary">publish later</span>
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Capture your thoughts in bite-sized pieces, then transform them into polished blog posts with AI
              assistance.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="gap-1.5">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline" className="gap-1.5">
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
        </section>
        <section className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl space-y-6 py-8 md:py-12 lg:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-5xl">How it works</h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              ThoughtStream makes it easy to capture ideas and transform them into polished content.
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            <div className="relative overflow-hidden rounded-lg border bg-background p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold">Create Sessions</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Start a new session for each topic or theme you want to explore.
              </p>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold">Microblog Your Thoughts</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Add short posts to your session as ideas come to you, just like tweets.
              </p>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold">Convert with AI</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Transform your collection of thoughts into a coherent, structured blog post with AI assistance.
              </p>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 ThoughtStream. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/terms" className="underline underline-offset-4">
              Terms
            </Link>
            <Link href="/privacy" className="underline underline-offset-4">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

