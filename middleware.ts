import { NextRequest, NextResponse } from "next/server"

const RATE_LIMIT_WINDOW = 60_000 // 1 minute
const RATE_LIMIT_MAX = 100

// Simple in-memory rate limiter (replace with Redis in production)
const requestCounts = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = requestCounts.get(ip)

  if (!record || now > record.resetAt) {
    requestCounts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW })
    return true
  }

  if (record.count >= RATE_LIMIT_MAX) return false

  record.count++
  return true
}

const PROTECTED_ADMIN_PATHS = [
  "/admin",
  "/api/admin",
]

const PROTECTED_TECH_PATHS = [
  "/technician/jobs",
  "/technician/schedule",
]

const PROTECTED_SUPPLIER_PATHS = [
  "/supplier/dashboard",
]

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown"

  // Security headers on all responses
  const res = NextResponse.next()
  res.headers.set("X-Content-Type-Options", "nosniff")
  res.headers.set("X-Frame-Options", "DENY")
  res.headers.set("X-XSS-Protection", "1; mode=block")
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(self)")

  // Rate limiting on API routes
  if (pathname.startsWith("/api/")) {
    if (!checkRateLimit(ip)) {
      return new NextResponse(JSON.stringify({ error: "Too many requests" }), {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": "60",
          "X-RateLimit-Limit": String(RATE_LIMIT_MAX),
          "X-RateLimit-Remaining": "0",
        },
      })
    }
  }

  // Skip auth checks for OAuth callback and public routes
  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/products") ||
    pathname.startsWith("/api/rfq") ||
    pathname.startsWith("/api/services") ||
    pathname.startsWith("/api/webhook") ||
    pathname.startsWith("/api/track") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/public")
  ) {
    return res
  }

  return res
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|icons/).*)",
  ],
}
