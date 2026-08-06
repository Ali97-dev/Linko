import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { canTransition } from "@/lib/serviceRequests";

const schema = z.object({ reason: z.string().min(1) });

// Admin can close a stalled request from any non-terminal status. The reason
// is always logged to the timeline.
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

  const request = await prisma.serviceRequest.findUnique({ where: { id: params.id } });
  if (!request) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  if (!canTransition("ADMIN", request.status, "CLOSED")) {
    return NextResponse.json({ error: "This request is already closed" }, { status: 409 });
  }

  await prisma.$transaction([
    prisma.serviceRequest.update({ where: { id: request.id }, data: { status: "CLOSED" } }),
    prisma.statusEvent.create({
      data: {
        serviceRequestId: request.id,
        fromStatus: request.status,
        toStatus: "CLOSED",
        actor: "Admin",
        note: parsed.data.reason,
      },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
