import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { generateReference, formatActor } from "@/lib/serviceRequests";

const schema = z.object({
  providerId: z.string().min(1),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(4000),
  budget: z.number().positive().optional(),
  requiredByDate: z.string().optional(),
  companyName: z.string().min(1).optional(),
  contactPerson: z.string().min(1).optional(),
});

// Business creates a new service request against a provider's public profile.
export async function POST(req: NextRequest) {
  const session = await requireRole(["BUSINESS"]);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { providerId, title, description, budget, requiredByDate, companyName, contactPerson } = parsed.data;

  const business = await prisma.business.findUnique({ where: { userId: session.userId } });
  if (!business) {
    return NextResponse.json({ error: "Business profile not found" }, { status: 404 });
  }

  const provider = await prisma.provider.findUnique({ where: { id: providerId } });
  if (!provider || provider.verificationState !== "APPROVED") {
    return NextResponse.json({ error: "Provider not found" }, { status: 404 });
  }

  let requiredByDateParsed: Date | undefined;
  if (requiredByDate) {
    const d = new Date(requiredByDate);
    if (Number.isNaN(d.getTime())) {
      return NextResponse.json({ error: "Invalid required-by date" }, { status: 400 });
    }
    requiredByDateParsed = d;
  }

  const reference = await generateReference();

  const created = await prisma.$transaction(async (tx) => {
    // Fill in company name / contact person on the business record if it's
    // still missing them — the business may have signed up with just
    // email/password and never visited a separate profile page.
    if ((!business.companyName && companyName) || (!business.contactPerson && contactPerson)) {
      await tx.business.update({
        where: { id: business.id },
        data: {
          companyName: business.companyName || companyName || undefined,
          contactPerson: business.contactPerson || contactPerson || undefined,
        },
      });
    }

    const request = await tx.serviceRequest.create({
      data: {
        reference,
        title,
        description,
        budget,
        requiredByDate: requiredByDateParsed,
        status: "SUBMITTED",
        businessId: business.id,
        providerId: provider.id,
      },
    });

    await tx.statusEvent.create({
      data: {
        serviceRequestId: request.id,
        fromStatus: null,
        toStatus: "SUBMITTED",
        actor: formatActor("BUSINESS", companyName || business.companyName),
      },
    });

    return request;
  });

  return NextResponse.json({ ok: true, id: created.id, reference: created.reference });
}
