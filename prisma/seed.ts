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
  {
    email: "hello@qout8.example.com",
    categorySlug: "technology",
    companyName: "Qout8 Software Solutions",
    tradeLicenceNumber: "KW-TEC-50234",
    description:
      "Custom software development and IT infrastructure support for SMEs and enterprises across Kuwait.",
    city: "Kuwait City",
    address: "Al Soor Street, Kuwait City",
    website: "https://qout8.example.com",
    yearEstablished: 2016,
    teamSize: "11-50",
    contactPerson: "Ahmad Al Kandari",
    phone: "+965 2222 5050",
  },
  {
    email: "support@nova-cloud.example.com",
    categorySlug: "technology",
    companyName: "Nova Cloud Systems",
    tradeLicenceNumber: "KW-TEC-60789",
    description: "Cloud migration, managed IT, and cybersecurity services for growing businesses.",
    city: "Farwaniya",
    address: "Al Farwaniya, Block 3",
    website: "https://nova-cloud.example.com",
    yearEstablished: 2019,
    teamSize: "1-10",
    contactPerson: "Dana Al Mutairi",
    phone: "+965 2222 6060",
  },
  {
    email: "hello@brightwave.example.com",
    categorySlug: "marketing",
    companyName: "Bright Wave Marketing",
    tradeLicenceNumber: "KW-MKT-70456",
    description: "Digital marketing agency specializing in social media, SEO, and paid campaigns for Kuwaiti brands.",
    city: "Salmiya",
    address: "Baghdad Street, Salmiya",
    website: "https://brightwave.example.com",
    yearEstablished: 2017,
    teamSize: "11-50",
    contactPerson: "Rania Al Sultan",
    phone: "+965 2222 7070",
  },
  {
    email: "studio@pixelpalm.example.com",
    categorySlug: "marketing",
    companyName: "Pixel & Palm Creative Studio",
    tradeLicenceNumber: "KW-MKT-80912",
    description: "Branding, content production, and creative design studio for retail and hospitality clients.",
    city: "Kuwait City",
    address: "Sharq, Fahad Al Salem Street",
    website: "https://pixelpalm.example.com",
    yearEstablished: 2020,
    teamSize: "1-10",
    contactPerson: "Omar Al Fahad",
    phone: "+965 2222 8080",
  },
  {
    email: "info@alwatanpro.example.com",
    categorySlug: "government-pro-services",
    companyName: "Al Watan PRO Services",
    tradeLicenceNumber: "KW-GOV-90345",
    description: "Licensing, visa processing, and government liaison services for businesses setting up in Kuwait.",
    city: "Hawalli",
    address: "Beirut Street, Hawalli",
    website: "https://alwatanpro.example.com",
    yearEstablished: 2012,
    teamSize: "11-50",
    contactPerson: "Saad Al Ajmi",
    phone: "+965 2222 9090",
  },
  {
    email: "contact@fasttrackgov.example.com",
    categorySlug: "government-pro-services",
    companyName: "Fast Track Government Relations",
    tradeLicenceNumber: "KW-GOV-10567",
    description:
      "End-to-end PRO and municipality liaison services, from trade licence renewals to civil ID processing.",
    city: "Kuwait City",
    address: "Mirqab, Kuwait City",
    website: "https://fasttrackgov.example.com",
    yearEstablished: 2014,
    teamSize: "1-10",
    contactPerson: "Huda Al Enezi",
    phone: "+965 2222 1111",
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
