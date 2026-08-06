"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import { LanguageToggle } from "./LanguageToggle";
import { AuthModal } from "./AuthModal";

type Category = { id: string; slug: string; name: string };

const categoryKeyMap: Record<string, string> = {
  accounting: "category.accounting",
  legal: "category.legal",
  technology: "category.technology",
  marketing: "category.marketing",
  "government-pro-services": "category.government-pro-services",
};

export function HeaderNav({ categories }: { categories: Category[] }) {
  const { t } = useLanguage();
  const [modal, setModal] = useState<"login" | "signup" | null>(null);

  return (
    <>
      <nav className="flex items-center gap-9">
        <div className="group relative">
          <button className="flex items-center gap-1.5 text-[16px] font-medium text-ink-70 hover:text-ink">
            {t("nav.explore")}
            <span className="text-[11px]">v</span>
          </button>
          <div className="invisible absolute left-0 top-full z-20 w-60 rounded-lg border border-line bg-surface py-2 opacity-0 shadow-lg transition-opacity group-hover:visible group-hover:opacity-100">
            <Link
              href="/providers"
              className="block px-4 py-2.5 text-[14.5px] font-medium text-ink hover:bg-canvas"
            >
              {t("nav.allProviders")}
            </Link>
            <div className="my-1 border-t border-line" />
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/providers?category=${c.slug}`}
                className="block px-4 py-2.5 text-[14.5px] text-ink-70 hover:bg-canvas hover:text-ink"
              >
                {categoryKeyMap[c.slug] ? t(categoryKeyMap[c.slug] as Parameters<typeof t>[0]) : c.name}
              </Link>
            ))}
          </div>
        </div>
        <LanguageToggle />
        <Link href="/become-a-provider" className="text-[16px] font-medium text-ink-70 hover:text-ink">
          {t("nav.becomeProvider")}
        </Link>
        <button
          onClick={() => setModal("login")}
          className="text-[16px] font-medium text-ink-70 hover:text-ink"
        >
          {t("nav.login")}
        </button>
        <button
          onClick={() => setModal("signup")}
          className="rounded-lg bg-ink px-7 py-3 text-[16px] font-bold text-white hover:bg-ink-70"
        >
          {t("nav.join")}
        </button>
      </nav>

      {modal && <AuthModal initialMode={modal} onClose={() => setModal(null)} />}
    </>
  );
}
