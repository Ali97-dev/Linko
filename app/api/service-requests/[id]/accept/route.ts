import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { canTransition, formatActor } from "@/lib/serviceRequests";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireRole(["PROVIDER"]);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const request = await prisma.serviceRequest.findUnique({
    where: { id: params.id },
    include: { provider: true },
  });
  if (!request || request.provider.userId !== session.userId) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  if (!canTransition("PROVIDER", request.status, "ACCEPTED")) {
    return NextResponse.json({ error: "This request can no longer be accepted" }, { status: 409 });
  }

  await prisma.$transaction([
    prisma.serviceRequest.update({ where: { id: request.id }, data: { status: "ACCEPTED" } }),
    prisma.statusEvent.create({
      data: {
        serviceRequestId: request.id,
        fromStatus: request.status,
        toStatus: "ACCEPTED",
        actor: formatActor("PROVIDER", request.provider.companyName),
      },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
