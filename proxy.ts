import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("_at_52")?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname === "/login" || pathname === "/register";

  // List of protected routes that require login
  const protectedRoutes = ["/dashboard", "/orders", "/user", "/products/add", "/chat", "/admin"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!token) {
    // If not logged in, redirect only when trying to access a protected route
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } else {
    // If logged in, redirect away from login/register pages to the homepage /
    if (isAuthPage) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api routes (starts with /api)
     * - static files (starts with /_next/static or /_next/image)
     * - images, favicon, icons, and other assets in public folder (contains a dot ".")
     */
    "/((?!api|_next/static|_next/image|.*\\..*).*)",
  ],
};
