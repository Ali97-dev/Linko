import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import path from "path";
import fs from "fs/promises";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { formatActor } from "@/lib/serviceRequests";
import { ALLOWED_EXTENSIONS, MAX_FILE_SIZE_BYTES, UPLOAD_ROOT, extensionMimeType } from "@/lib/attachments";

// Real multipart file upload. Same provider-on-this-request ownership
// check as before (deliverables are added by the provider) — only what's
// behind that check changed: real bytes to local disk instead of trusting
// a client-supplied URL.
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

  if (request.status !== "IN_PROGRESS" && request.status !== "COMPLETED") {
    return NextResponse.json({ error: "Deliverables can only be added once work is in progress" }, { status: 409 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Expected a multipart/form-data file upload" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (file.size === 0) {
    return NextResponse.json({ error: "File is empty" }, { status: 400 });
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json({ error: "File is too large. Maximum size is 20MB." }, { status: 400 });
  }

  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return NextResponse.json(
      {
        error: `Unsupported file type "${ext || "unknown"}". Allowed types: PDF, DOC, DOCX, XLS, XLSX, PNG, JPG, ZIP.`,
      },
      { status: 400 }
    );
  }

  await fs.mkdir(UPLOAD_ROOT, { recursive: true });

  const storageKey = `${randomBytes(16).toString("hex")}${ext}`;
  const diskPath = path.join(UPLOAD_ROOT, storageKey);
  const bytes = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(diskPath, bytes);

  const attachment = await prisma.attachment.create({
    data: {
      serviceRequestId: request.id,
      fileName: file.name.slice(0, 200) || "file",
      fileUrl: storageKey,
      fileType: file.type || extensionMimeType(ext),
      fileSize: file.size,
      uploadedBy: formatActor("PROVIDER", request.provider.companyName),
    },
  });

  return NextResponse.json({ ok: true, attachment: { id: attachment.id, fileName: attachment.fileName } });
}
