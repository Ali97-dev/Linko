import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { UPLOAD_ROOT, isValidStorageKey, contentDispositionHeader } from "@/lib/attachments";

// Streams a deliverable back to whoever is authorized to see it: the
// business on this specific request, the provider on this specific
// request, or an Admin — the exact same ownership shape already enforced
// (and tested) on the business/provider/admin request-detail pages, just
// applied here instead of trusting the raw fileUrl the old placeholder
// rendered directly as a link.
//
// Anyone else — including a different business or a different provider —
// gets a 404, matching the existing convention on the attachments POST
// route and the request-detail pages: don't confirm the resource exists.
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string; attachmentId: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const request = await prisma.serviceRequest.findUnique({
    where: { id: params.id },
    include: { business: true, provider: true },
  });
  if (!request) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const authorized =
    session.role === "ADMIN" ||
    (session.role === "BUSINESS" && request.business.userId === session.userId) ||
    (session.role === "PROVIDER" && request.provider.userId === session.userId);

  if (!authorized) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const attachment = await prisma.attachment.findUnique({ where: { id: params.attachmentId } });
  if (!attachment || attachment.serviceRequestId !== request.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (!isValidStorageKey(attachment.fileUrl)) {
    return NextResponse.json({ error: "File unavailable" }, { status: 404 });
  }

  let fileBuffer: Buffer;
  try {
    fileBuffer = await fs.readFile(path.join(UPLOAD_ROOT, attachment.fileUrl));
  } catch {
    return NextResponse.json({ error: "File unavailable" }, { status: 404 });
  }

  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": attachment.fileType || "application/octet-stream",
      "Content-Disposition": contentDispositionHeader(attachment.fileName),
      "Content-Length": String(fileBuffer.length),
      "Cache-Control": "private, no-store",
    },
  });
}
