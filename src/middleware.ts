import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Ensure that /sitemap.xml is NOT processed by the catch-all [...slug] route
  if (pathname === "/sitemap.xml") {
    return NextResponse.rewrite(new URL("/sitemap", req.url));
  }

  return NextResponse.next();
}

// Apply middleware to all routes
export const config = {
  matcher: "/sitemap.xml",
};
