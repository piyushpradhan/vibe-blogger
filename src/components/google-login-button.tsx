"use client"

import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"

export function GoogleLoginButton() {
  const handleGoogleLogin = async () => {
    await signIn("google", { callbackUrl: "/dashboard" })
  }

  return (
    <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mr-2 h-4 w-4"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v8" />
        <path d="M8 12h8" />
      </svg>
      Sign in with Google
    </Button>
  )
}

