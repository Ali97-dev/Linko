"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

// Same dark gradient used on the /providers hero band — deliberately
// distinct from the white/canvas sections around it, since this is the
// one part of the homepage addressing providers instead of businesses.
export function ProviderCtaBanner() {
  const { t } = useLanguage();

  return (
    <section
      className="px-6 py-16 text-center"
      style={{ background: "linear-gradient(135deg, #0e1526 0%, #163a9e 100%)" }}
    >
      <div className="mx-auto max-w-xl">
        <h2 className="font-heading text-[28px] font-bold text-white">{t("home.providerCtaTitle")}</h2>
        <p className="mt-3 text-[15px] text-white/80">{t("home.providerCtaSubtitle")}</p>
        <Link
          href="/become-a-provider"
          className="mt-7 inline-flex items-center gap-2 rounded-lg bg-white px-7 py-3 text-[15px] font-bold text-ink hover:bg-white/90"
        >
          {t("nav.becomeProvider")}
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
