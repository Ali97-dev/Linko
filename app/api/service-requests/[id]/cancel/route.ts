import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { canTransition, formatActor } from "@/lib/serviceRequests";

// Business withdraws a request before the provider has started work on it.
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

  if (!canTransition("BUSINESS", request.status, "CANCELLED")) {
    return NextResponse.json({ error: "This request can no longer be cancelled" }, { status: 409 });
  }

  await prisma.$transaction([
    prisma.serviceRequest.update({ where: { id: request.id }, data: { status: "CANCELLED" } }),
    prisma.statusEvent.create({
      data: {
        serviceRequestId: request.id,
        fromStatus: request.status,
        toStatus: "CANCELLED",
        actor: formatActor("BUSINESS", request.business.companyName),
      },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
