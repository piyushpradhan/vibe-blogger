"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, Zap, Sparkles } from "lucide-react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

export default function Home() {
  const { status } = useSession();

  return (
    <div className="flex min-h-screen flex-col">
      <div className="fixed inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem]">
        <div className="from-background/0 via-background/50 to-background absolute inset-0 bg-gradient-to-b" />
      </div>
      <header className="border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 border-b backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <MessageSquare className="h-6 w-6" />
              <span className="font-bold">VibeBlogger</span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link
                href="/features"
                className="hover:text-foreground/80 transition-colors"
              >
                Features
              </Link>
              <Link
                href="/docs"
                className="hover:text-foreground/80 transition-colors"
              >
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
        <section className="space-y-6 pt-12 pb-8 md:pt-24 md:pb-12 lg:py-32">
          <div className="mx-auto flex max-w-[64rem] flex-col items-center gap-4 px-4 text-center sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
                Microblog now,{" "}
                <span className="relative inline-block">
                  <span className="relative z-10">publish later</span>
                  <motion.div
                    initial={{ scale: 0.8, rotate: 0 }}
                    animate={{
                      scale: [0.8, 1.05, 1],
                      rotate: [0, 90, 180],
                      opacity: [0.6, 0.9, 0.7, 0.9, 0.7],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      times: [0, 0.3, 0.5, 0.7, 1],
                    }}
                    className="absolute -top-4 -right-4"
                  >
                    <Sparkles className="text-primary h-8 w-8" />
                  </motion.div>
                </span>
              </h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-muted-foreground max-w-[42rem] leading-normal sm:text-xl sm:leading-8"
            >
              Capture your thoughts in bite-sized pieces, then transform them
              into polished blog posts with AI assistance.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <Link href={status === "authenticated" ? "/dashboard" : "/login"}>
                <Button size="lg" className="gap-1.5">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
        <section className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 md:py-12 lg:px-8 lg:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-5xl"
            >
              How it works
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-muted-foreground max-w-[85%] leading-normal sm:text-lg sm:leading-7"
            >
              VibeBlogger makes it easy to capture ideas and transform them into
              polished content.
            </motion.p>
          </div>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-background/50 hover:border-primary/50 relative overflow-hidden rounded-lg border p-6 backdrop-blur-sm transition-colors"
            >
              <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold">Create Sessions</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                Start a new session for each topic or theme you want to explore.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-background/50 hover:border-primary/50 relative overflow-hidden rounded-lg border p-6 backdrop-blur-sm transition-colors"
            >
              <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold">Microblog Your Thoughts</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                Add short posts to your session as ideas come to you, just like
                tweets.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-background/50 hover:border-primary/50 relative overflow-hidden rounded-lg border p-6 backdrop-blur-sm transition-colors"
            >
              <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold">Convert with AI</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                Transform your collection of thoughts into a coherent,
                structured blog post with AI assistance.
              </p>
            </motion.div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:px-6 md:h-24 md:flex-row lg:px-8">
          <p className="text-muted-foreground text-center text-sm leading-loose md:text-left">
            © 2025 VibeBlogger. All rights reserved.
          </p>
          <div className="text-muted-foreground flex items-center gap-4 text-sm">
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
  );
}
