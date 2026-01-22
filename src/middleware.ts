import { NextRequest, NextResponse } from "next/server";

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

export function middleware(req: NextRequest) {
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
