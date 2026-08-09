import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";

// Sets User.status to "suspended" — the login route (see
// app/api/auth/login/route.ts) already checks this field and refuses to
// sign in any account whose status isn't "active", so this takes effect
// on the account's very next login attempt.
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireRole(["ADMIN"]);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: params.id } });
  if (!user) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }
  if (user.role === "ADMIN") {
    return NextResponse.json({ error: "Admin accounts cannot be suspended" }, { status: 400 });
  }

  await prisma.user.update({ where: { id: user.id }, data: { status: "suspended" } });

  return NextResponse.json({ ok: true });
}
