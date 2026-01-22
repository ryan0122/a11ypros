import { NextRequest, NextResponse } from "next/server";

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 60; // 60 requests per minute

// In-memory store for rate limiting (IP -> array of timestamps)
const rateLimitStore = new Map<string, number[]>();

// Bot patterns to block
const BLOCKED_BOT_PATTERNS = [
  /AhrefsBot/i,
  /SemrushBot/i,
  /MJ12bot/i,
  /DotBot/i,
  /BLEXBot/i,
  /DataForSeoBot/i,
  /PetalBot/i,
  /YandexBot/i,
  /Baiduspider/i,
  /SeznamBot/i,
  /serpstatbot/i,
  /ZoominfoBot/i,
  /BrightEdge/i,
  /python-requests/i,
  /curl/i,
  /wget/i,
  /scrapy/i,
  /Go-http-client/i,
];

// Allowed good bots (Google, Bing, etc.)
const ALLOWED_BOT_PATTERNS = [
  /Googlebot/i,
  /bingbot/i,
  /Slackbot/i,
  /LinkedInBot/i,
  /facebookexternalhit/i,
  /Twitterbot/i,
  /WhatsApp/i,
];

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitStore.get(ip) || [];

  // Filter out timestamps outside the current window
  const recentTimestamps = timestamps.filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW
  );

  // Check if limit exceeded
  if (recentTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return false; // Rate limit exceeded
  }

  // Add current timestamp and update store
  recentTimestamps.push(now);
  rateLimitStore.set(ip, recentTimestamps);

  // Cleanup old entries periodically
  if (rateLimitStore.size > 10000) {
    const cutoff = now - RATE_LIMIT_WINDOW;
    for (const [key, value] of rateLimitStore.entries()) {
      const filtered = value.filter((t) => now - t < RATE_LIMIT_WINDOW);
      if (filtered.length === 0 || filtered[0] < cutoff) {
        rateLimitStore.delete(key);
      }
    }
  }

  return true; // Within rate limit
}

export function middleware(req: NextRequest) {
  // Get IP address
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    req.headers.get("x-real-ip") ||
    "unknown";

  // Rate limiting check
  if (!checkRateLimit(ip)) {
    return new NextResponse("Too Many Requests", {
      status: 429,
      headers: {
        "Retry-After": "60",
      },
    });
  }

  const userAgent = req.headers.get("user-agent") || "";

  // Check if it's an allowed bot first
  const isAllowedBot = ALLOWED_BOT_PATTERNS.some((pattern) =>
    pattern.test(userAgent)
  );

  if (!isAllowedBot) {
    // Check if it's a blocked bot
    const isBlockedBot = BLOCKED_BOT_PATTERNS.some((pattern) =>
      pattern.test(userAgent)
    );

    if (isBlockedBot) {
      return new NextResponse("Access Denied", { status: 403 });
    }
  }

  // Let Next.js handle /sitemap.xml automatically via sitemap.ts
  // No rewrite needed - Next.js will serve it correctly

  return NextResponse.next();
}

// Apply middleware to specific paths if needed
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
