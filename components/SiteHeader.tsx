import Link from "next/link";
import { prisma } from "@/lib/db";
import { LogoMark } from "./LogoMark";
import { HeaderBar } from "./HeaderBar";

export async function SiteHeader() {
  const categories = await prisma.category.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          dir="ltr"
          className="shrink-0 font-heading text-[26px] font-black leading-none text-ink"
        >
          LINKO
          <LogoMark />
        </Link>

        <HeaderBar categories={categories} />
      </div>
    </header>
  );
}
