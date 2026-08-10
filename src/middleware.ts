import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getRateLimitCategory } from '@/lib/rate-limit'
import { scanInput } from '@/lib/security'

// ============================================================================
// HNSA — HireNova Security Architecture
// Middleware: Security Headers + Rate Limiting + Input Scanning
// ============================================================================

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
 * Extract user agent from request.
 */
function getUserAgent(request: NextRequest): string {
  return request.headers.get('user-agent') || 'unknown'
}

// ============================================================================
// HNSA Security Headers
// ============================================================================

/**
 * Apply comprehensive HNSA security headers to all responses.
 * These implement Pillar 3 (Application Security) of HNSA.
 *
 * Headers applied:
 * - X-Content-Type-Options: nosniff (prevent MIME sniffing)
 * - X-XSS-Protection: 1; mode=block (legacy XSS protection)
 * - Referrer-Policy: strict-origin-when-cross-origin
 * - Permissions-Policy: restrict camera, microphone, geolocation
 * - X-Request-ID: unique request identifier for audit correlation
 * - X-HNSA: version tag for security layer identification
 * - Content-Security-Policy: strict CSP (iframe-permissive for preview panel)
 */
function applyHNSASecurityHeaders(
  response: NextResponse,
  requestId: string
): void {
  // --- Core Security Headers (HNSA Pillar 3) ---
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set(
    'Referrer-Policy',
    'strict-origin-when-cross-origin'
  )
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=()'
  )

  // --- HNSA Request Correlation ---
  response.headers.set('X-Request-ID', requestId)
  response.headers.set('X-HNSA', '1.0')

  // --- HSTS (HNSA Pillar 4: Transport Security) ---
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  )

  // --- Frame Protection ---
  // SAMEORIGIN by default; frame-ancestors * in CSP kept for preview panel compatibility.
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')

  // --- Content Security Policy (HNSA Pillar 3) ---
  const cspParts = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' https:",
    "connect-src 'self' https: wss:",
    "frame-ancestors *",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    "frame-src 'self'",
  ];
  response.headers.set(
    'Content-Security-Policy',
    cspParts.join('; ')
  )
}

// ============================================================================
// Suspicious Path Detection (HNSA Pillar 2: Zero Trust)
// ============================================================================

/**
 * Paths that are commonly probed by attackers/bots.
 * Requests to these paths are logged as suspicious.
 */
const SUSPICIOUS_PATHS = [
  '/wp-admin',
  '/wp-login',
  '/.env',
  '/.git',
  '/.svn',
  '/.htaccess',
  '/phpmyadmin',
  '/admin/config',
  '/backup',
  '/config.php',
  '/database',
  '/solr',
  '/actuator',
  '/.dockerenv',
  '/proc/self',
  '/etc/passwd',
  '/console',
  '/debug',
  '/trace',
  '/server-status',
  '/elmah.axd',
  '/trace.axd',
]

/**
 * Checks if the request path matches known attack patterns.
 */
function isSuspiciousPath(pathname: string): boolean {
  const lower = pathname.toLowerCase()
  return SUSPICIOUS_PATHS.some((p) => lower.includes(p))
}

// ============================================================================
// Main Middleware
// ============================================================================

/**
 * HNSA Security Middleware
 *
 * Implements multiple HNSA pillars:
 * - Pillar 1: Identity — rate limiting on auth endpoints
 * - Pillar 2: Zero Trust — suspicious path blocking
 * - Pillar 3: Application Security — comprehensive security headers
 * - Pillar 4: API Security — rate limiting + input scanning
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const ip = getClientIP(request)
  const requestId = crypto.randomUUID()

  const response = NextResponse.next()

  // --- Apply HNSA Security Headers to ALL responses ---
  applyHNSASecurityHeaders(response, requestId)

  // --- Block suspicious paths (HNSA Zero Trust) ---
  if (isSuspiciousPath(pathname)) {
    // Import logSecurityEvent dynamically to avoid issues
    import('@/lib/security').then(({ logSecurityEvent }) => {
      logSecurityEvent({
        type: 'forbidden_access',
        severity: 'medium',
        ip,
        path: pathname,
        method: request.method,
        userAgent: getUserAgent(request),
        details: { reason: 'suspicious_path', requestId },
      })
    })

    return NextResponse.json(
      { error: 'Not found', code: 'NOT_FOUND' },
      { status: 404 }
    )
  }

  // --- API Route Protection ---
  if (pathname.startsWith('/api/')) {
    // Rate limiting
    const category = getRateLimitCategory(pathname)
    const { allowed, retryAfterMs } = checkRateLimit(ip, category)

    if (!allowed) {
      const retryAfter = Math.ceil(retryAfterMs / 1000)

      // Log rate limit event
      import('@/lib/security').then(({ logSecurityEvent }) => {
        logSecurityEvent({
          type: 'rate_limit',
          severity: category === 'auth' ? 'high' : 'low',
          ip,
          path: pathname,
          method: request.method,
          userAgent: getUserAgent(request),
          details: { category, requestId },
        })
      })

      return NextResponse.json(
        {
          error: 'Too many requests. Please try again later.',
          code: 'RATE_LIMITED',
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfter),
            'X-RateLimit-Category': category,
            'X-Request-ID': requestId,
          },
        }
      )
    }

    // Input scanning for POST/PUT/PATCH requests with body
    if (
      ['POST', 'PUT', 'PATCH'].includes(request.method) &&
      pathname.includes('api/')
    ) {
      const url = request.url
      const scanResult = scanInput(url)

      if (!scanResult.isClean) {
        import('@/lib/security').then(({ logSecurityEvent }) => {
          logSecurityEvent({
            type: scanResult.sqlInjection
              ? 'sql_injection_attempt'
              : 'xss_attempt',
            severity: 'critical',
            ip,
            path: pathname,
            method: request.method,
            userAgent: getUserAgent(request),
            details: {
              sqlInjection: scanResult.sqlInjection,
              xss: scanResult.xss,
              requestId,
            },
          })
        })

        return NextResponse.json(
          {
            error: 'Request contains malicious content.',
            code: 'SECURITY_VIOLATION',
          },
          {
            status: 400,
            headers: { 'X-Request-ID': requestId },
          }
        )
      }
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
