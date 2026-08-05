import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { verifyPassword, createSession } from "@/lib/auth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Very basic in-memory rate limiting per process. Fine for a single small
// deployment at launch volumes; swap for a real rate limiter if you scale
// past one instance.
const attempts = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(email: string) {
  const now = Date.now();
  const entry = attempts.get(email);
  if (!entry || entry.resetAt < now) {
    attempts.set(email, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return false;
  }
  entry.count += 1;
  return entry.count > 10;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { email, password } = parsed.data;

  if (isRateLimited(email)) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.status !== "active") {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  if (!user.emailVerified) {
    return NextResponse.json({ error: "Please verify your email before logging in" }, { status: 403 });
  }

  await createSession({ userId: user.id, role: user.role, email: user.email });

  const redirectTo = user.role === "BUSINESS" ? "/business" : user.role === "PROVIDER" ? "/provider" : "/admin";

  return NextResponse.json({ ok: true, redirectTo });
}
