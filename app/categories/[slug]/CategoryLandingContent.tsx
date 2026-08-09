"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { ProviderCard, type ProviderCardData } from "@/components/ProviderCard";

type Category = { id: string; slug: string; name: string; description: string | null };

const categoryKeyMap: Record<string, string> = {
  accounting: "category.accounting",
  legal: "category.legal",
  technology: "category.technology",
  marketing: "category.marketing",
  "government-pro-services": "category.government-pro-services",
};

const categoryDescKeyMap: Record<string, string> = {
  accounting: "category.accounting.desc",
  legal: "category.legal.desc",
  technology: "category.technology.desc",
  marketing: "category.marketing.desc",
  "government-pro-services": "category.government-pro-services.desc",
};

export function CategoryLandingContent({
  category,
  providers,
}: {
  category: Category;
  providers: ProviderCardData[];
}) {
  const { t } = useLanguage();

  const name = categoryKeyMap[category.slug] ? t(categoryKeyMap[category.slug] as Parameters<typeof t>[0]) : category.name;
  const description = categoryDescKeyMap[category.slug]
    ? t(categoryDescKeyMap[category.slug] as Parameters<typeof t>[0])
    : category.description;

  return (
    <>
      <section
        className="px-6 py-14"
        style={{ background: "linear-gradient(135deg, #0e1526 0%, #163a9e 100%)" }}
      >
        <div className="mx-auto max-w-6xl">
          <Link
            href="/providers"
            className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-white/70 hover:text-white"
          >
            <ArrowLeft size={14} />
            {t("categories.backToProviders")}
          </Link>
          <h1 className="mt-3 font-heading text-[32px] font-bold text-white">{name}</h1>
          {description && <p className="mt-1 max-w-2xl text-[15px] text-white/80">{description}</p>}
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
              {t("categories.noProviders")}
            </p>
          )}
        </div>
      </main>
    </>
  );
}
