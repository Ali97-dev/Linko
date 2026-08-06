import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { canTransition, formatActor } from "@/lib/serviceRequests";

const schema = z.object({ note: z.string().max(2000).optional() });

// Provider moves an accepted request into progress.
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireRole(["PROVIDER"]);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const request = await prisma.serviceRequest.findUnique({
    where: { id: params.id },
    include: { provider: true },
  });
  if (!request || request.provider.userId !== session.userId) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  if (!canTransition("PROVIDER", request.status, "IN_PROGRESS")) {
    return NextResponse.json({ error: "This request cannot be started right now" }, { status: 409 });
  }

  await prisma.$transaction([
    prisma.serviceRequest.update({ where: { id: request.id }, data: { status: "IN_PROGRESS" } }),
    prisma.statusEvent.create({
      data: {
        serviceRequestId: request.id,
        fromStatus: request.status,
        toStatus: "IN_PROGRESS",
        actor: formatActor("PROVIDER", request.provider.companyName),
        note: parsed.data.note || null,
      },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
