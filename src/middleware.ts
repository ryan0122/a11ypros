import { NextRequest, NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function middleware(_req: NextRequest) {
  // Let Next.js handle /sitemap.xml automatically via sitemap.ts
  // No rewrite needed - Next.js will serve it correctly

  return NextResponse.next();
}

// Apply middleware to specific paths if needed
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
