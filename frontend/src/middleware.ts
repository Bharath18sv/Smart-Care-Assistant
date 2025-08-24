import { NextRequest, NextResponse } from "next/server";
import { ROUTES, PUBLIC_PATHS } from "@/utils/routes";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // ✅ Public paths (accessible without token)
  const isPublicPath = PUBLIC_PATHS.includes(path as any);

  // ✅ Check if user has a role stored (from localStorage, but middleware runs on server)
  // Since middleware runs on server, we can't access localStorage directly
  // Instead, we'll let the components handle authentication redirects
  // This middleware will only handle basic route protection

  // ✅ Allow all public paths
  if (isPublicPath) {
    return NextResponse.next();
  }

  // ✅ For protected paths, let the components handle authentication
  // The components will check auth state and redirect accordingly
  return NextResponse.next();
}

// ✅ Apply middleware on protected + public routes
export const config = {
  matcher: ["/", "/admin/:path*", "/doctor/:path*", "/patient/:path*"],
};
