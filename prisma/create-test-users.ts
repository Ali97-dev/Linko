import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Fixed, well-known credentials for local/dev testing.
const TEST_PASSWORD = "TestUser123!";

async function upsertBusiness() {
  const passwordHash = await bcrypt.hash(TEST_PASSWORD, 12);
  const user = await prisma.user.upsert({
    where: { email: "business@test.com" },
    update: {
      role: "BUSINESS",
      emailVerified: true,
      status: "active",
      passwordHash,
    },
    create: {
      email: "business@test.com",
      passwordHash,
      role: "BUSINESS",
      emailVerified: true,
      verifiedAt: new Date(),
      status: "active",
    },
  });

  await prisma.business.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      companyName: "Test Business Co.",
      contactPerson: "Test Business",
      city: "Kuwait City",
      country: "Kuwait",
    },
  });

  return user;
}

async function upsertProvider() {
  const passwordHash = await bcrypt.hash(TEST_PASSWORD, 12);
  const user = await prisma.user.upsert({
    where: { email: "provider@test.com" },
    update: {
      role: "PROVIDER",
      emailVerified: true,
      status: "active",
      passwordHash,
    },
    create: {
      email: "provider@test.com",
      passwordHash,
      role: "PROVIDER",
      emailVerified: true,
      verifiedAt: new Date(),
      status: "active",
    },
  });

  await prisma.provider.upsert({
    where: { userId: user.id },
    update: {
      verificationState: "APPROVED",
      approvedAt: new Date(),
    },
    create: {
      userId: user.id,
      slug: "test-provider",
      companyName: "Test Provider Co.",
      contactPerson: "Test Provider",
      city: "Kuwait City",
      description: "A pre-approved provider account for testing.",
      verificationState: "APPROVED",
      approvedAt: new Date(),
    },
  });

  return user;
}

async function upsertAdmin() {
  const passwordHash = await bcrypt.hash(TEST_PASSWORD, 12);
  const user = await prisma.user.upsert({
    where: { email: "admin@linko.com" },
    update: {
      role: "ADMIN",
      emailVerified: true,
      status: "active",
      passwordHash,
    },
    create: {
      email: "admin@linko.com",
      passwordHash,
      role: "ADMIN",
      emailVerified: true,
      verifiedAt: new Date(),
      status: "active",
    },
  });

  return user;
}

async function main() {
  const [business, provider, admin] = await Promise.all([upsertBusiness(), upsertProvider(), upsertAdmin()]);

  console.log(`Created/updated test users (password for all: ${TEST_PASSWORD}):`);
  console.log(`  business@test.com -> role=${business.role}`);
  console.log(`  provider@test.com -> role=${provider.role}, verificationState=APPROVED`);
  console.log(`  admin@linko.com   -> role=${admin.role}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
