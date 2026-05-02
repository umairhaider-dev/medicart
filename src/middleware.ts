import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "medicart-dev-secret-change-in-production"
);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const token = req.cookies.get("mc_token")?.value;

    if (!token) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/portal", req.url));
    }

    try {
      const { payload } = await jwtVerify(token, SECRET);
      if (!payload.isAdmin) {
        if (pathname.startsWith("/api/")) {
          return NextResponse.json({ error: "Forbidden — admin access required" }, { status: 403 });
        }
        return NextResponse.redirect(new URL("/portal", req.url));
      }
    } catch {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/portal", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
