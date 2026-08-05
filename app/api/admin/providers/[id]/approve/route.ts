import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireRole(["ADMIN"]);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const provider = await prisma.provider.update({
    where: { id: params.id },
    data: { verificationState: "APPROVED", approvedAt: new Date(), verificationNote: null },
  });

  return NextResponse.json({ ok: true, provider });
}
