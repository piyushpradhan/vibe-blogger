import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const token = await getToken({ 
    req: request,
    secret: process.env.AUTH_SECRET
  })
  const isAuthenticated = !!token

  // If the user is authenticated and trying to access the landing page,
  // redirect them to the dashboard
  if (isAuthenticated && request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

// Specify which paths the middleware should run on
export const config = {
  matcher: ["/"],
} 