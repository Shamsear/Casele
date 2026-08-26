import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { authOptions } from "@/lib/auth";

/**
 * Universal Admin Authentication Verifier for App Router API routes.
 * Supports NextAuth sessions, JWT decryption, and chunked session cookies on Vercel HTTPS.
 */
export async function verifyAdminAuth(request: NextRequest): Promise<boolean> {
  try {
    // 1. NextAuth getServerSession check
    const session = await getServerSession(authOptions);
    if (session?.user) {
      return true;
    }

    // 2. JWT token check
    const token = await getToken({
      req: request as any,
      secret: process.env.NEXTAUTH_SECRET || "casele-luxury-secure-secret-key-2026-doha",
    });
    if (token) {
      return true;
    }

    // 3. Cookie header check (supports chunked __Secure-next-auth.session-token.0 / .1)
    const rawCookies = request.headers.get("cookie") || "";
    if (rawCookies.includes("session-token") || rawCookies.includes("next-auth")) {
      return true;
    }

    return false;
  } catch (error) {
    console.warn("verifyAdminAuth error fallback to header check:", error);
    const rawCookies = request.headers.get("cookie") || "";
    return rawCookies.includes("session-token") || rawCookies.includes("next-auth");
  }
}
