import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { db } from "@/lib/db";
import { logSecurityEvent } from "@/lib/security";

// ---------------------------------------------------------------------------
// In-memory brute-force tracker: email → { attempts, firstAttemptAt }
// ---------------------------------------------------------------------------
interface BruteForceEntry {
  attempts: number;
  firstAttemptAt: number;
}
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const bruteForceMap = new Map<string, BruteForceEntry>();

// Clean up stale entries periodically
if (typeof setInterval === "function") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of bruteForceMap.entries()) {
      if (now - entry.firstAttemptAt > LOCKOUT_DURATION_MS * 2) {
        bruteForceMap.delete(key);
      }
    }
  }, 60_000);
}

function isLockedOut(email: string): boolean {
  const entry = bruteForceMap.get(email);
  if (!entry) return false;
  if (entry.attempts < MAX_FAILED_ATTEMPTS) return false;
  if (Date.now() - entry.firstAttemptAt > LOCKOUT_DURATION_MS) {
    bruteForceMap.delete(email);
    return false;
  }
  return true;
}

function recordFailedAttempt(email: string): void {
  const entry = bruteForceMap.get(email) || {
    attempts: 0,
    firstAttemptAt: Date.now(),
  };
  entry.attempts += 1;
  bruteForceMap.set(email, entry);
}

function resetFailedAttempts(email: string): void {
  bruteForceMap.delete(email);
}

export { isLockedOut, resetFailedAttempts };

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        ip: { label: "IP", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const email = credentials.email.toLowerCase().trim();
        const clientIp = (credentials.ip as string) || "unknown";

        // Brute-force check
        if (isLockedOut(email)) {
          await logSecurityEvent({
            type: "brute_force",
            severity: "high",
            ip: clientIp,
            path: "/api/auth/callback/credentials",
            method: "POST",
            email,
            details: { reason: "account_locked_after_5_failures" },
          }).catch(() => {});
          throw new Error("Too many failed attempts. Please try again in 15 minutes.");
        }

        const user = await db.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) {
          recordFailedAttempt(email);
          await logSecurityEvent({
            type: "invalid_auth",
            severity: "medium",
            ip: clientIp,
            path: "/api/auth/callback/credentials",
            method: "POST",
            email,
            details: { reason: "user_not_found" },
          }).catch(() => {});
          throw new Error("Invalid email or password");
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          const entry = bruteForceMap.get(email);
          const currentAttempts = (entry?.attempts || 0) + 1;
          recordFailedAttempt(email);

          const severity = currentAttempts >= MAX_FAILED_ATTEMPTS ? "high" : "medium";
          await logSecurityEvent({
            type: currentAttempts >= MAX_FAILED_ATTEMPTS ? "brute_force" : "invalid_auth",
            severity,
            ip: clientIp,
            path: "/api/auth/callback/credentials",
            method: "POST",
            email,
            details: {
              reason: "wrong_password",
              failedAttempts: currentAttempts,
            },
          }).catch(() => {});
          throw new Error("Invalid email or password");
        }

        // Successful login — check if there were prior failures to log resolution
        const priorEntry = bruteForceMap.get(email);
        if (priorEntry && priorEntry.attempts > 0) {
          await logSecurityEvent({
            type: "brute_force",
            severity: "low",
            ip: clientIp,
            path: "/api/auth/callback/credentials",
            method: "POST",
            email,
            details: {
              reason: "resolved_after_failures",
              priorAttempts: priorEntry.attempts,
            },
          }).catch(() => {});
        }
        resetFailedAttempts(email);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          plan: user.plan,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email ?? '';
        token.plan = (user as { plan?: string }).plan ?? "free";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        (session.user as { name?: string }).name = token.name as string;
        (session.user as { image?: string | null }).image =
          token.picture as string | null;
        (session.user as { plan?: string }).plan = token.plan as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
    error: "/",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Augment NextAuth types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      plan: string;
    };
  }

  interface User {
    plan?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    plan: string;
  }
}
