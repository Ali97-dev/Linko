import { prisma } from "@/lib/db";
import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { LayoutGrid, Calculator, Scale, Cpu, Megaphone, Landmark, type LucideIcon } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";

const categoryIcons: Record<string, LucideIcon> = {
  accounting: Calculator,
  legal: Scale,
  technology: Cpu,
  marketing: Megaphone,
  "government-pro-services": Landmark,
};

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
      <section
        className="px-6 py-14"
        style={{ background: "linear-gradient(135deg, #0e1526 0%, #163a9e 100%)" }}
      >
        <div className="mx-auto max-w-6xl">
          <h1 className="font-heading text-[32px] font-bold text-white">Find a verified provider</h1>
          <p className="mt-1 text-[15px] text-white/80">
            Every provider listed here has been reviewed and approved by LINKO.
          </p>

          <form action="/providers" className="mt-6 flex max-w-xl overflow-hidden rounded-lg bg-white">
            {category && <input type="hidden" name="category" value={category} />}
            <input
              name="q"
              defaultValue={q || ""}
              placeholder="Search for any service..."
              className="flex-1 px-5 py-3.5 text-[15px] text-ink outline-none"
            />
            <button type="submit" className="bg-ink px-6 text-white hover:bg-ink-70">
              Search
            </button>
          </form>

          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href={q ? `/providers?q=${encodeURIComponent(q)}` : "/providers"}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-[13.5px] font-medium ${
                !category ? "border-white bg-white text-ink" : "border-white/30 text-white hover:bg-white/10"
              }`}
            >
              <LayoutGrid size={16} />
              All
            </Link>
            {categories.map((c) => {
              const Icon = categoryIcons[c.slug] || LayoutGrid;
              const params = new URLSearchParams();
              params.set("category", c.slug);
              if (q) params.set("q", q);
              return (
                <Link
                  key={c.id}
                  href={`/providers?${params.toString()}`}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 text-[13.5px] font-medium ${
                    category === c.slug
                      ? "border-white bg-white text-ink"
                      : "border-white/30 text-white hover:bg-white/10"
                  }`}
                >
                  <Icon size={16} />
                  {c.name}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <p className="text-[13.5px] text-ink-50">
          {providers.length} provider{providers.length === 1 ? "" : "s"} found
        </p>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {providers.map((p) => (
            <Link
              key={p.id}
              href={`/providers/${p.slug}`}
              className="lk-card block hover:border-primary"
            >
              <div className="flex items-start justify-between">
                <h2 className="font-heading text-[16px] font-bold text-ink">{p.companyName}</h2>
                <span className="rounded-full bg-success-bg px-2.5 py-0.5 text-[12.5px] font-medium text-success">
                  Verified
                </span>
              </div>
              <p className="mt-1 text-[13.5px] text-ink-50">
                {p.category?.name} - {p.city}
              </p>
              <p className="mt-2 line-clamp-2 text-[15px] text-ink-70">{p.description}</p>
            </Link>
          ))}

          {providers.length === 0 && (
            <p className="lk-card col-span-full text-center text-[13.5px] text-ink-50">
              No providers match your search yet.
            </p>
          )}
        </div>
      </main>
    </>
  );
}
