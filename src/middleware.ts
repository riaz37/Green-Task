import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(request: NextRequest) {
  // Paths that require authentication
  const protectedPaths = ["/api/webhook/"];

  // Paths that are public (no authentication required)
  const publicPaths = [
    "/api/users/", // User creation route
  ];

  // Check if the current path is public
  const isPublicPath = publicPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // If it's a public path, allow the request
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Check if the current path requires authentication
  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPath) {
    // Get the token from the Authorization header
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    // If no token is present, return an unauthorized response
    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    try {
      // Verify the token
      const JWT_SECRET = process.env.JWT_SECRET || "helloworld";
      jwt.verify(token, JWT_SECRET);

      // If token is valid, allow the request to proceed
      return NextResponse.next();
    } catch (error) {
      console.error("Token verification error:", error);

      // If token is invalid, return a forbidden response
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 403 }
      );
    }
  }

  // If the path is not protected, continue the request
  return NextResponse.next();
}

// Specify which routes this middleware should run on
export const config = {
  matcher: "/api/users/:path*",
};
