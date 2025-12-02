import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Let Next.js handle /sitemap.xml automatically via sitemap.ts
  // No rewrite needed - Next.js will serve it correctly

  return NextResponse.next();
}

// Apply middleware to specific paths if needed
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
