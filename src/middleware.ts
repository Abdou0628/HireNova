import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getRateLimitCategory } from '@/lib/rate-limit'
import { logSecurityEvent } from '@/lib/security'

/**
 * Helper to extract client IP from request headers.
 */
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  const realIP = request.headers.get('x-real-ip')
  if (realIP) return realIP
  return '127.0.0.1'
}

/**
 * In-memory rate limiter + security headers middleware.
 * Rate limiting: /api/* routes only.
 * Security headers: all responses, but iframe-friendly for non-API routes.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const response = NextResponse.next()

  // Security headers (safe for all routes)
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  // Allow the Preview Panel iframe to embed the site (Caddy proxy on port 81)
  // X-Frame-Options and frame-ancestors must allow embedding from the gateway
  response.headers.set('X-Frame-Options', 'ALLOWALL')
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' https:; connect-src 'self' https: wss:; frame-ancestors *;"
  )

  // Rate limiting only for /api/* routes
  if (pathname.startsWith('/api/')) {
    const ip = getClientIP(request)
    const category = getRateLimitCategory(pathname)
    const { allowed, retryAfterMs } = checkRateLimit(ip, category)

    if (!allowed) {
      logSecurityEvent({
        type: 'rate_limit',
        severity: 'medium',
        ip,
        path: pathname,
        method: request.method,
        userAgent: request.headers.get('user-agent') || undefined,
        details: { category, retryAfterMs },
      }).catch(() => {})

      const retryAfter = Math.ceil(retryAfterMs / 1000)
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.', code: 'RATE_LIMITED' },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfter),
            'X-RateLimit-Category': category,
          },
        }
      )
    }
  }

  return response
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico|images/).*)',
  ],
}
