import { PrismaClient } from "@prisma/client";
import { slugify } from "../lib/slugify";

const prisma = new PrismaClient();

async function main() {
  const providers = await prisma.provider.findMany({ where: { slug: null } });
  for (const p of providers) {
    await prisma.provider.update({
      where: { id: p.id },
      data: { slug: slugify(p.companyName || p.id, p.id) },
    });
    console.log(`Set slug for ${p.companyName}`);
  }
  console.log(`Done — updated ${providers.length} provider(s).`);
}

main().finally(() => prisma.$disconnect());
