"use client";

import Link from "next/link";
import { LayoutGrid, Calculator, Scale, Cpu, Megaphone, Landmark, type LucideIcon } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { CategoryCard } from "@/components/CategoryCard";

type Category = { id: string; slug: string; name: string };

type Provider = {
  id: string;
  slug: string | null;
  companyName: string | null;
  description: string | null;
  city: string | null;
  category: { name: string; slug: string } | null;
};

const categoryIcons: Record<string, LucideIcon> = {
  accounting: Calculator,
  legal: Scale,
  technology: Cpu,
  marketing: Megaphone,
  "government-pro-services": Landmark,
};

const categoryKeyMap: Record<string, string> = {
  accounting: "category.accounting",
  legal: "category.legal",
  technology: "category.technology",
  marketing: "category.marketing",
  "government-pro-services": "category.government-pro-services",
};

export function ProvidersDirectoryContent({
  providers,
  categories,
  category,
  q,
}: {
  providers: Provider[];
  categories: Category[];
  category?: string;
  q?: string;
}) {
  const { t } = useLanguage();

  function categoryHref(slug?: string) {
    if (!slug) return q ? `/providers?q=${encodeURIComponent(q)}` : "/providers";
    const params = new URLSearchParams();
    params.set("category", slug);
    if (q) params.set("q", q);
    return `/providers?${params.toString()}`;
  }

  return (
    <>
      <section
        className="px-6 py-14"
        style={{ background: "linear-gradient(135deg, #0e1526 0%, #163a9e 100%)" }}
      >
        <div className="mx-auto max-w-6xl">
          <h1 className="font-heading text-[32px] font-bold text-white">{t("providers.title")}</h1>
          <p className="mt-1 text-[15px] text-white/80">{t("providers.subtitle")}</p>

          <form action="/providers" className="mt-6 flex max-w-xl overflow-hidden rounded-lg bg-white">
            {category && <input type="hidden" name="category" value={category} />}
            <input
              name="q"
              defaultValue={q || ""}
              placeholder={t("search.placeholder")}
              className="flex-1 px-5 py-3.5 text-[15px] text-ink outline-none"
            />
            <button type="submit" className="bg-ink px-6 text-white hover:bg-ink-70">
              {t("search.button")}
            </button>
          </form>
        </div>
      </section>

      <section className="bg-canvas px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-heading text-[19px] font-bold text-ink">{t("home.categoriesTitle")}</h2>

          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            <CategoryCard
              href={categoryHref()}
              icon={LayoutGrid}
              label={t("nav.allProviders")}
              active={!category}
              compact
            />
            {categories.map((c) => (
              <CategoryCard
                key={c.id}
                href={categoryHref(c.slug)}
                icon={categoryIcons[c.slug] || LayoutGrid}
                label={categoryKeyMap[c.slug] ? t(categoryKeyMap[c.slug] as Parameters<typeof t>[0]) : c.name}
                active={category === c.slug}
                compact
              />
            ))}
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <p className="text-[13.5px] text-ink-50">
          {providers.length} {providers.length === 1 ? t("providers.foundSingular") : t("providers.foundPlural")}
        </p>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {providers.map((p) => (
            <Link key={p.id} href={`/providers/${p.slug}`} className="lk-card block hover:border-primary">
              <div className="flex items-start justify-between">
                <h2 className="font-heading text-[16px] font-bold text-ink">{p.companyName}</h2>
                <span className="rounded-full bg-success-bg px-2.5 py-0.5 text-[12.5px] font-medium text-success">
                  {t("providers.verified")}
                </span>
              </div>
              <p className="mt-1 text-[13.5px] text-ink-50">
                {p.category && (categoryKeyMap[p.category.slug] ? t(categoryKeyMap[p.category.slug] as Parameters<typeof t>[0]) : p.category.name)}
                {" - "}
                {p.city}
              </p>
              <p className="mt-2 line-clamp-2 text-[15px] text-ink-70">{p.description}</p>
            </Link>
          ))}

          {providers.length === 0 && (
            <p className="lk-card col-span-full text-center text-[13.5px] text-ink-50">
              {t("providers.noResults")}
            </p>
          )}
        </div>
      </main>
    </>
  );
}
