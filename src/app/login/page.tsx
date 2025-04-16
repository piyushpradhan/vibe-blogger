"use client"

import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { GoogleLoginButton } from "@/components/google-login-button"

export default function LoginPage() {
  return (
    <div className="flex h-screen w-screen">
      {/* Left side - Welcome content */}
      <div className="hidden w-1/2 flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 p-8 lg:flex">
        <div className="max-w-md space-y-6">
          <h1 className="text-4xl font-bold tracking-tight">Welcome to Vibe Blogger</h1>
          <p className="text-lg text-muted-foreground">
            Join our community of writers and share your stories with the world. Connect with like-minded individuals and discover amazing content.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Share Your Stories</h3>
                <p className="text-sm text-muted-foreground">Write and publish your thoughts with our easy-to-use platform</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Connect with Others</h3>
                <p className="text-sm text-muted-foreground">Join a community of passionate writers and readers</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login card */}
      <div className="flex w-full flex-col items-center justify-center p-8 lg:w-1/2">
        <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8">
          <Button variant="ghost" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Sign in</CardTitle>
              <CardDescription>Choose your preferred sign in method</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <GoogleLoginButton />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

