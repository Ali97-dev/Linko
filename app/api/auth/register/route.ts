import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { generateToken, tokenExpiry } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mailer";

const baseSchema = z.object({
  role: z.enum(["BUSINESS", "PROVIDER"]),
  companyName: z.string().min(1),
  contactPerson: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(8),
  categoryId: z.string().optional(), // providers only, per ACC-02
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = baseSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { role, companyName, contactPerson, email, phone, password, categoryId } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.$transaction(async (tx) => {
    const created = await tx.user.create({
      data: { email, passwordHash, role },
    });

    if (role === "BUSINESS") {
      await tx.business.create({
        data: { userId: created.id, companyName, contactPerson, phone },
      });
    } else {
      await tx.provider.create({
        data: {
          userId: created.id,
          companyName,
          contactPerson,
          phone,
          categoryId: categoryId || null,
          verificationState: "DRAFT",
        },
      });
    }

    return created;
  });

  const token = generateToken();
  await prisma.emailVerificationToken.create({
    data: { token, userId: user.id, expiresAt: tokenExpiry(24) },
  });

  await sendVerificationEmail(email, token);

  return NextResponse.json({ ok: true });
}
