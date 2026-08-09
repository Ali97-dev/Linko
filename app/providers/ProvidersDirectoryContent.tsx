"use client";

import { LayoutGrid, Calculator, Scale, Cpu, Megaphone, Landmark, type LucideIcon } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { CategoryCard } from "@/components/CategoryCard";
import { ProviderCard, type ProviderCardData } from "@/components/ProviderCard";

type Category = { id: string; slug: string; name: string };

type Provider = ProviderCardData;

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

  function allProvidersHref() {
    return q ? `/providers?q=${encodeURIComponent(q)}` : "/providers";
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
              href={allProvidersHref()}
              icon={LayoutGrid}
              label={t("nav.allProviders")}
              active={!category}
              compact
            />
            {categories.map((c) => (
              <CategoryCard
                key={c.id}
                href={`/categories/${c.slug}`}
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
            <ProviderCard key={p.id} provider={p} />
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
