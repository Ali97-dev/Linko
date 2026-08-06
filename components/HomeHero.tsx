"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import { ArrowRight, Calculator, Scale, Cpu, Megaphone, Landmark, type LucideIcon } from "lucide-react";

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

export function HomeHero({ categories }: { categories: Category[] }) {
  const { t } = useLanguage();

  return (
    <>
      <section
        className="relative overflow-hidden px-6 py-28"
        style={{ background: "#0e1526" }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
          <h1 className="font-heading text-[42px] font-bold leading-[1.2] text-white sm:text-[52px]">
            {t("hero.title1")}
            <br />
            {t("hero.title2")}
          </h1>
          <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-white/75">{t("hero.subtitle")}</p>

          <form action="/providers" className="mt-9 flex w-full max-w-xl overflow-hidden rounded-xl bg-white">
            <input
              name="q"
              placeholder={t("search.placeholder")}
              className="flex-1 px-6 py-4 text-[16px] text-ink outline-none"
            />
            <button type="submit" className="bg-ink px-8 text-[15px] font-medium text-white hover:bg-ink-70">
              {t("search.button")}
            </button>
          </form>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
            {categories.map((c) => {
              const Icon = categoryIcons[c.slug] || Calculator;
              return (
                <Link
                  key={c.id}
                  href={`/providers?category=${c.slug}`}
                  className="flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-[13.5px] font-medium text-white hover:bg-white/10"
                >
                  <Icon size={15} />
                  {categoryKeyMap[c.slug] ? t(categoryKeyMap[c.slug] as Parameters<typeof t>[0]) : c.name}
                  <ArrowRight size={13} />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 text-center">
        <p className="text-[15px] text-ink-70">{t("hero.footer")}</p>
      </section>
    </>
  );
}
