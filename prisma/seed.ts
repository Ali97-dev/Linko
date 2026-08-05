import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const categories = [
  { name: "Accounting", slug: "accounting" },
  { name: "Legal", slug: "legal" },
  { name: "Technology", slug: "technology" },
  { name: "Marketing", slug: "marketing" },
  { name: "Government / PRO Services", slug: "government-pro-services" },
];

async function main() {
  for (const [i, c] of categories.entries()) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: { ...c, sortOrder: i },
    });
  }
  console.log(`Seeded ${categories.length} categories.`);

  // Admin accounts aren't self-registered (see the BRD permission matrix —
  // Guest cannot register as Admin), so create one here for local testing.
  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;

  if (adminEmail && adminPassword) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await prisma.user.upsert({
      where: { email: adminEmail },
      update: {},
      create: {
        email: adminEmail,
        passwordHash,
        role: "ADMIN",
        emailVerified: true,
        verifiedAt: new Date(),
      },
    });
    console.log(`Seeded admin user: ${adminEmail}`);
  } else {
    console.log("Skipped admin seed — set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD to create one.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
