import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { SiteHeader } from "@/components/SiteHeader";
import { CategoryLandingContent } from "./CategoryLandingContent";

// Public, server-rendered, no auth required — same as /providers.
export default async function CategoryLandingPage({ params }: { params: { slug: string } }) {
  const category = await prisma.category.findUnique({ where: { slug: params.slug } });
  if (!category || !category.active) notFound();

  const providers = await prisma.provider.findMany({
    where: { categoryId: category.id, verificationState: "APPROVED" },
    include: { category: { select: { name: true, slug: true } } },
    orderBy: { companyName: "asc" },
  });

  return (
    <>
      <SiteHeader />
      <CategoryLandingContent category={category} providers={providers} />
    </>
  );
}
