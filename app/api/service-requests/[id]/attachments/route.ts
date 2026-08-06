import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { formatActor } from "@/lib/serviceRequests";

// Deliverable metadata only — actual file storage is a separate task.
// The provider supplies a URL to where the file already lives.
const schema = z.object({
  fileName: z.string().min(1).max(200),
  fileUrl: z.string().url(),
  fileType: z.string().max(100).optional(),
  fileSize: z.number().int().positive().optional(),
});

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireRole(["PROVIDER"]);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const request = await prisma.serviceRequest.findUnique({
    where: { id: params.id },
    include: { provider: true },
  });
  if (!request || request.provider.userId !== session.userId) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  if (request.status !== "IN_PROGRESS" && request.status !== "COMPLETED") {
    return NextResponse.json({ error: "Deliverables can only be added once work is in progress" }, { status: 409 });
  }

  const attachment = await prisma.attachment.create({
    data: {
      serviceRequestId: request.id,
      fileName: parsed.data.fileName,
      fileUrl: parsed.data.fileUrl,
      fileType: parsed.data.fileType || null,
      fileSize: parsed.data.fileSize || null,
      uploadedBy: formatActor("PROVIDER", request.provider.companyName),
    },
  });

  return NextResponse.json({ ok: true, attachment });
}
