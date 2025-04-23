import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  try {
    // Get the token from the request
    const token = await getToken({ 
      req: request,
      secret: process.env.AUTH_SECRET
    })
    
    const isAuthenticated = !!token
    const pathname = request.nextUrl.pathname

    // Debug logging
    console.log(`[Middleware] Path: ${pathname}, Authenticated: ${isAuthenticated}`, );

    // Allow all auth-related routes to pass through
    if (pathname.startsWith("/api/auth")) {
      return NextResponse.next()
    }

    // Allow access to login page
    if (pathname === "/login") {
      return NextResponse.next()
    }

    // If the user is authenticated and trying to access the landing page,
    // redirect them to the dashboard
    if (isAuthenticated && pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    // If the user is not authenticated and trying to access a protected route,
    // redirect them to the login page
    if (!isAuthenticated && pathname.startsWith("/dashboard") && !request.cookies.get("__Secure-next-auth.session-token")) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    return NextResponse.next()
  } catch (error) {
    console.error("[Middleware] Error:", error)
    // In case of error, allow the request to proceed
    return NextResponse.next()
  }
}

// Specify which paths the middleware should run on
export const config = {
  matcher: ["/", "/dashboard/:path*", "/login"],
} 