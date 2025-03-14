import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Ensure that /sitemap.xml and /robots.txt are NOT processed by the catch-all [...slug] route
  if (pathname === "/sitemap.xml") {
    return NextResponse.rewrite(new URL("/sitemap", req.url));
  }

  if (pathname === "/robots.txt") {
    return NextResponse.rewrite(new URL("/robots", req.url));
  }

  return NextResponse.next();
}

// Apply middleware to both /sitemap.xml and /robots.txt
export const config = {
  matcher: ["/sitemap.xml", "/robots.txt"],
};
