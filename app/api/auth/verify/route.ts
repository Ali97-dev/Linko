import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const base = process.env.APP_URL || req.url;
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/login?error=missing_token", base));
  }

  const record = await prisma.emailVerificationToken.findUnique({ where: { token } });

  if (!record || record.expiresAt < new Date()) {
    return NextResponse.redirect(new URL("/login?error=invalid_token", base));
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { emailVerified: true, verifiedAt: new Date() },
    }),
    prisma.emailVerificationToken.delete({ where: { token } }),
  ]);

  return NextResponse.redirect(new URL("/login?verified=1", base));
}
