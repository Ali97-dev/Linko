import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";
import { SiteHeader } from "@/components/SiteHeader";
import { ProvidersDirectoryContent } from "./ProvidersDirectoryContent";

export default async function ProvidersDirectory({
  searchParams,
}: {
  searchParams: { category?: string; q?: string };
}) {
  const { category, q } = searchParams;

  const where: Prisma.ProviderWhereInput = {
    verificationState: "APPROVED",
    ...(category ? { category: { slug: category } } : {}),
    ...(q
      ? {
          OR: [
            { companyName: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [providers, categories] = await Promise.all([
    prisma.provider.findMany({
      where,
      include: { category: true },
      orderBy: { companyName: "asc" },
    }),
    prisma.category.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <>
      <SiteHeader />
      <ProvidersDirectoryContent providers={providers} categories={categories} category={category} q={q} />
    </>
  );
}
