import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { db } from "@/lib/db";
import { scanInput, sanitizeString, logSecurityEvent } from "@/lib/security";
import { sendEmail, emailTemplates } from "@/lib/email";

function getClientIP(request: Request): string {
  const headers = request.headers as Record<string, string | null>;
  const forwarded = headers["x-forwarded-for"];
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIP = headers["x-real-ip"];
  if (realIP) return realIP;
  return "127.0.0.1";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, password } = body;

    // Input sanitization & security scan
    if (email) {
      const scanResult = scanInput(email);
      if (!scanResult.isClean) {
        await logSecurityEvent({
          type: scanResult.sqlInjection ? "sql_injection_attempt" : "xss_attempt",
          severity: "high",
          ip: getClientIP(request),
          path: "/api/auth/register",
          method: "POST",
          userAgent: request.headers.get("user-agent") || undefined,
          email: email.toLowerCase().trim(),
          details: { field: "email", sqlInjection: scanResult.sqlInjection, xss: scanResult.xss },
        }).catch(() => {});
        return NextResponse.json(
          { success: false, error: "Invalid input detected" },
          { status: 400 }
        );
      }
    }

    if (name) {
      const scanResult = scanInput(name);
      if (!scanResult.isClean) {
        await logSecurityEvent({
          type: scanResult.sqlInjection ? "sql_injection_attempt" : "xss_attempt",
          severity: "high",
          ip: getClientIP(request),
          path: "/api/auth/register",
          method: "POST",
          userAgent: request.headers.get("user-agent") || undefined,
          email: email?.toLowerCase().trim(),
          details: { field: "name", sqlInjection: scanResult.sqlInjection, xss: scanResult.xss },
        }).catch(() => {});
        return NextResponse.json(
          { success: false, error: "Invalid input detected" },
          { status: 400 }
        );
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate password
    if (!password || password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Normalize email
    const normalizedEmail = sanitizeString(email.toLowerCase().trim());

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user
    const user = await db.user.create({
      data: {
        email: normalizedEmail,
        name: name ? sanitizeString(name.trim()) : null,
        password: hashedPassword,
      },
    });

    // Send welcome email (async, non-blocking — don't fail registration if email fails)
    const displayName = user.name || user.email.split("@")[0];
    sendEmail({
      to: user.email,
      ...emailTemplates.welcome(displayName),
    }).catch((err) => {
      console.error("[register] welcome email failed:", err instanceof Error ? err.message : String(err));
    });

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
