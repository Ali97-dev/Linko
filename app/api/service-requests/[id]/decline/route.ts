import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { canTransition, formatActor } from "@/lib/serviceRequests";

const schema = z.object({ reason: z.string().min(1) });

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireRole(["PROVIDER"]);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "A reason is required" }, { status: 400 });
  }

  const request = await prisma.serviceRequest.findUnique({
    where: { id: params.id },
    include: { provider: true },
  });
  if (!request || !request.provider || request.provider.userId !== session.userId) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  if (!canTransition("PROVIDER", request.status, "DECLINED")) {
    return NextResponse.json({ error: "This request can no longer be declined" }, { status: 409 });
  }

  await prisma.$transaction([
    prisma.serviceRequest.update({
      where: { id: request.id },
      data: { status: "DECLINED", declineReason: parsed.data.reason },
    }),
    prisma.statusEvent.create({
      data: {
        serviceRequestId: request.id,
        fromStatus: request.status,
        toStatus: "DECLINED",
        actor: formatActor("PROVIDER", request.provider.companyName),
        note: parsed.data.reason,
      },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
