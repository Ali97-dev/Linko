import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { slugify } from "@/lib/slugify";

const schema = z.object({
  companyName: z.string().min(1),
  tradeLicenceNumber: z.string().min(1),
  description: z.string().min(1),
  city: z.string().min(1),
  address: z.string().optional(),
  website: z.string().optional(),
  yearEstablished: z.coerce.number().optional(),
  teamSize: z.string().optional(),
  categoryId: z.string().min(1),
});

export async function PATCH(req: NextRequest) {
  const session = await requireRole(["PROVIDER"]);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await prisma.provider.findUnique({ where: { userId: session.userId } });

  const provider = await prisma.provider.update({
    where: { userId: session.userId },
    data: {
      ...parsed.data,
      slug: slugify(parsed.data.companyName, existing!.id),
      verificationState: "PENDING",
      verificationNote: null,
    },
  });

  return NextResponse.json({ ok: true, provider });
}
