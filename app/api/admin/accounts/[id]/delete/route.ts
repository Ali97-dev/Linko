import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";

const schema = z.object({ confirmEmail: z.string() });

// Permanently deletes a Business or Provider account. Enforced server
// side, not just in the UI: the request body must include the account's
// exact email as confirmation, or this refuses to proceed.
//
// The account (User row, and its Business/Provider profile) is genuinely
// removed from the database. What it must NOT do is destroy the *other*
// party's history of any service requests it was involved in — so before
// deleting, every affected ServiceRequest gets a name snapshot written
// (businessNameSnapshot / providerNameSnapshot), then the delete cascades:
// User -> Business/Provider (onDelete: Cascade) -> ServiceRequest.businessId
// /providerId is SetNull (not Cascade — see prisma/schema.prisma), so the
// request row itself, its statusEvents, and its attachments all survive
// untouched. StatusEvent.actor and Attachment.uploadedBy are already
// plain-string snapshots taken at the time of each action, so that history
// was never at risk either way.
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireRole(["ADMIN"]);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Confirmation is required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: { business: true, provider: true },
  });
  if (!user) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }
  if (user.role === "ADMIN") {
    return NextResponse.json({ error: "Admin accounts cannot be deleted this way" }, { status: 400 });
  }
  if (parsed.data.confirmEmail !== user.email) {
    return NextResponse.json({ error: "Confirmation email does not match" }, { status: 400 });
  }

  await prisma.$transaction(async (tx) => {
    if (user.business) {
      await tx.serviceRequest.updateMany({
        where: { businessId: user.business.id },
        data: { businessNameSnapshot: user.business.companyName },
      });
    }
    if (user.provider) {
      await tx.serviceRequest.updateMany({
        where: { providerId: user.provider.id },
        data: { providerNameSnapshot: user.provider.companyName },
      });
    }
    await tx.user.delete({ where: { id: user.id } });
  });

  return NextResponse.json({ ok: true });
}
