"use client";

import { Calculator, Scale, Cpu, Megaphone, Landmark, type LucideIcon } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { CategoryCard } from "./CategoryCard";

type Category = { id: string; slug: string; name: string };

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

const categoryDescKeyMap: Record<string, string> = {
  accounting: "category.accounting.desc",
  legal: "category.legal.desc",
  technology: "category.technology.desc",
  marketing: "category.marketing.desc",
  "government-pro-services": "category.government-pro-services.desc",
};

export function CategoryShowcase({ categories }: { categories: Category[] }) {
  const { t } = useLanguage();

  return (
    <section className="bg-canvas px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-heading text-[28px] font-bold text-ink">{t("home.categoriesTitle")}</h2>
          <p className="mt-2 text-[15px] text-ink-70">{t("home.categoriesSubtitle")}</p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((c) => (
            <CategoryCard
              key={c.id}
              href={`/providers?category=${c.slug}`}
              icon={categoryIcons[c.slug] || Calculator}
              label={categoryKeyMap[c.slug] ? t(categoryKeyMap[c.slug] as Parameters<typeof t>[0]) : c.name}
              description={
                categoryDescKeyMap[c.slug] ? t(categoryDescKeyMap[c.slug] as Parameters<typeof t>[0]) : undefined
              }
              actionLabel={t("home.viewProviders")}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
