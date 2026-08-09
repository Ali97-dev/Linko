import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { canTransition, formatActor } from "@/lib/serviceRequests";

// Business confirms a completed request, closing it out.
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireRole(["BUSINESS"]);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const request = await prisma.serviceRequest.findUnique({
    where: { id: params.id },
    include: { business: true },
  });
  if (!request || !request.business || request.business.userId !== session.userId) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  if (!canTransition("BUSINESS", request.status, "CLOSED")) {
    return NextResponse.json({ error: "This request isn't ready to be closed" }, { status: 409 });
  }

  await prisma.$transaction([
    prisma.serviceRequest.update({ where: { id: request.id }, data: { status: "CLOSED" } }),
    prisma.statusEvent.create({
      data: {
        serviceRequestId: request.id,
        fromStatus: request.status,
        toStatus: "CLOSED",
        actor: formatActor("BUSINESS", request.business.companyName),
      },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
