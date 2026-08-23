/**
 * Simple in-memory rate limiter
 * For production, use Redis-based solution like @upstash/ratelimit
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (entry.resetAt < now) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  windowMs: number;  // Time window in milliseconds
  max: number;       // Max requests per window
}

/**
 * Check rate limit for a given key
 * @param key - Unique identifier (e.g., IP address, user ID)
 * @param config - Rate limit configuration
 * @returns { success: boolean, remaining: number, resetAt: number }
 */
export function rateLimit(
  key: string,
  config: RateLimitConfig = { windowMs: 15 * 60 * 1000, max: 100 } // Default: 100 requests per 15 minutes
): { success: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || entry.resetAt < now) {
    // First request or window expired
    const resetAt = now + config.windowMs;
    rateLimitMap.set(key, { count: 1, resetAt });
    return { success: true, remaining: config.max - 1, resetAt };
  }

  if (entry.count >= config.max) {
    // Rate limit exceeded
    return { success: false, remaining: 0, resetAt: entry.resetAt };
  }

  // Increment count
  entry.count++;
  return { success: true, remaining: config.max - entry.count, resetAt: entry.resetAt };
}

/**
 * Get client IP from request headers
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return "unknown";
}

/**
 * Rate limit configurations for different endpoints
 */
export const RATE_LIMITS = {
  // Login: 5 attempts per 15 minutes
  login: { windowMs: 15 * 60 * 1000, max: 5 },
  // Upload: 20 per minute
  upload: { windowMs: 60 * 1000, max: 20 },
  // General API: 100 per 15 minutes
  api: { windowMs: 15 * 60 * 1000, max: 100 },
  // Password reset: 3 per hour
  passwordReset: { windowMs: 60 * 60 * 1000, max: 3 },
} as const;
