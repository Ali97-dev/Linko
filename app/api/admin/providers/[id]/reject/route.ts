import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";

const schema = z.object({ reason: z.string().min(1) });

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireRole(["ADMIN"]);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "A reason is required" }, { status: 400 });
  }

  const provider = await prisma.provider.update({
    where: { id: params.id },
    data: { verificationState: "REJECTED", verificationNote: parsed.data.reason },
  });

  return NextResponse.json({ ok: true, provider });
}
