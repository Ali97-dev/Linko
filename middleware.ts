import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const roleForPrefix: Record<string, string> = {
  "/business": "BUSINESS",
  "/provider": "PROVIDER",
  "/admin": "ADMIN",
};

export async function middleware(req: NextRequest) {
  const prefix = Object.keys(roleForPrefix).find((p) => req.nextUrl.pathname.startsWith(p));
  if (!prefix) return NextResponse.next();

  const token = req.cookies.get("linko_session")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.SESSION_SECRET);
    const { payload } = await jwtVerify(token, secret);

    if (payload.role !== roleForPrefix[prefix]) {
      // Authenticated, but wrong role for this area — never let a Business
      // account render a Provider or Admin page just because they guessed the URL.
      return NextResponse.redirect(new URL("/login", req.url));
    }
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/business/:path*", "/provider/:path*", "/admin/:path*"],
};
