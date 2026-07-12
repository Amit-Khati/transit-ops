
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// import jwt from "jsonwebtoken";

export function proxy(request: NextRequest) {
  // const token = request.cookies.get("auth_token")?.value;
  // const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this-in-production";

  // JWT auth is disabled while the project is being worked on locally.
  return NextResponse.next();

  /*
  // If the user is accessing dashboard routes without a token, redirect to login
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      // Verify token
      jwt.verify(token, JWT_SECRET);
      return NextResponse.next();
    } catch (error) {
      // Invalid token, redirect to login
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // If user is already logged in and tries to access login/signup, redirect to dashboard
  if (
    (request.nextUrl.pathname === "/login" ||
      request.nextUrl.pathname === "/signup") &&
    token
  ) {
    try {
      jwt.verify(token, JWT_SECRET);
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } catch (error) {
      // Invalid token, let them stay on login/signup
      return NextResponse.next();
    }
  }

  return NextResponse.next();
  */
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
