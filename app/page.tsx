import { prisma } from "@/lib/db";
import { SiteHeader } from "@/components/SiteHeader";
import { HomeHero } from "@/components/HomeHero";

export default async function Home() {
  const categories = await prisma.category.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <>
      <SiteHeader />
      <HomeHero categories={categories} />
    </>
  );
}
