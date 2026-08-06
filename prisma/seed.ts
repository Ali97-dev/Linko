import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { slugify } from "../lib/slugify";

const prisma = new PrismaClient();

const categories = [
  { name: "Accounting", slug: "accounting" },
  { name: "Legal", slug: "legal" },
  { name: "Technology", slug: "technology" },
  { name: "Marketing", slug: "marketing" },
  { name: "Government / PRO Services", slug: "government-pro-services" },
];

// Example, already-approved providers so the directory (/providers) and
// category pages have something real to browse in a fresh environment.
// All emails/websites are fictional .example.com placeholders.
const exampleProviders = [
  {
    email: "info@alrashed-accounting.example.com",
    categorySlug: "accounting",
    companyName: "Al Rashed Accounting & Audit",
    tradeLicenceNumber: "KW-ACC-10456",
    description:
      "Full-service accounting, bookkeeping, and audit firm serving SMEs and family businesses across Kuwait since 2011.",
    city: "Kuwait City",
    address: "Sharq, Ahmed Al Jaber Street, Kuwait City",
    website: "https://alrashed-accounting.example.com",
    yearEstablished: 2011,
    teamSize: "11-50",
    contactPerson: "Fahad Al Rashed",
    phone: "+965 2222 1010",
  },
  {
    email: "hello@gulfledger.example.com",
    categorySlug: "accounting",
    companyName: "Gulf Ledger Partners",
    tradeLicenceNumber: "KW-ACC-20981",
    description:
      "Cloud-based bookkeeping and VAT compliance for growing businesses, with a dedicated CFO-advisory arm.",
    city: "Hawalli",
    address: "Tunis Street, Hawalli",
    website: "https://gulfledger.example.com",
    yearEstablished: 2018,
    teamSize: "1-10",
    contactPerson: "Mona Al Ansari",
    phone: "+965 2222 2020",
  },
  {
    email: "contact@alsabahlaw.example.com",
    categorySlug: "legal",
    companyName: "Al Sabah & Partners Law Firm",
    tradeLicenceNumber: "KW-LGL-30772",
    description:
      "Corporate and commercial law firm advising on company formation, contracts, and regulatory compliance for local and international clients.",
    city: "Kuwait City",
    address: "Al Hamra Tower, Abdulaziz Al Saqr Street, Kuwait City",
    website: "https://alsabahlaw.example.com",
    yearEstablished: 2005,
    teamSize: "51-200",
    contactPerson: "Yousef Al Sabah",
    phone: "+965 2222 3030",
  },
  {
    email: "info@nourlegal.example.com",
    categorySlug: "legal",
    companyName: "Nour Legal Consultants",
    tradeLicenceNumber: "KW-LGL-40113",
    description:
      "Boutique legal practice specializing in labour law, commercial disputes, and government liaison services for SMEs.",
    city: "Salmiya",
    address: "Salem Al Mubarak Street, Salmiya",
    website: "https://nourlegal.example.com",
    yearEstablished: 2015,
    teamSize: "11-50",
    contactPerson: "Nour Al Fadhli",
    phone: "+965 2222 4040",
  },
];

async function main() {
  const categoryIds: Record<string, string> = {};
  for (const [i, c] of categories.entries()) {
    const category = await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: { ...c, sortOrder: i },
    });
    categoryIds[c.slug] = category.id;
  }
  console.log(`Seeded ${categories.length} categories.`);

  const providerPasswordHash = await bcrypt.hash("ProviderDemo123!", 12);
  for (const p of exampleProviders) {
    const user = await prisma.user.upsert({
      where: { email: p.email },
      update: {},
      create: {
        email: p.email,
        passwordHash: providerPasswordHash,
        role: "PROVIDER",
        emailVerified: true,
        verifiedAt: new Date(),
      },
    });

    const provider = await prisma.provider.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        companyName: p.companyName,
        tradeLicenceNumber: p.tradeLicenceNumber,
        categoryId: categoryIds[p.categorySlug],
        description: p.description,
        city: p.city,
        address: p.address,
        website: p.website,
        yearEstablished: p.yearEstablished,
        teamSize: p.teamSize,
        contactPerson: p.contactPerson,
        phone: p.phone,
        verificationState: "APPROVED",
        approvedAt: new Date(),
      },
    });

    if (!provider.slug) {
      await prisma.provider.update({
        where: { id: provider.id },
        data: { slug: slugify(p.companyName, provider.id) },
      });
    }
  }
  console.log(
    `Seeded ${exampleProviders.length} example providers (login password for all: ProviderDemo123!).`
  );

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
