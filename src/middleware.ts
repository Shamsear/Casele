import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // If user is already logged in as admin and visits /admin/login, redirect to /admin dashboard
    if (pathname === "/admin/login") {
      if (token && (token as any).role === "admin") {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
      return NextResponse.next();
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const pathname = req.nextUrl.pathname;

        // CRITICAL: Always allow public access to /admin/login to prevent infinite redirect loops
        if (pathname === "/admin/login") {
          return true;
        }

        // All other /admin UI pages require valid authentication
        return !!token;
      },
    },
    pages: {
      signIn: "/admin/login",
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};
