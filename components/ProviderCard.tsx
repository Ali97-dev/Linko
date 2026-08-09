"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n";

const categoryKeyMap: Record<string, string> = {
  accounting: "category.accounting",
  legal: "category.legal",
  technology: "category.technology",
  marketing: "category.marketing",
  "government-pro-services": "category.government-pro-services",
};

export type ProviderCardData = {
  id: string;
  slug: string | null;
  companyName: string | null;
  description: string | null;
  city: string | null;
  category: { name: string; slug: string } | null;
};

// Shared provider result card — used by both the provider directory
// (/providers) and the category landing pages (/categories/[slug]) so a
// provider looks identical wherever it's listed.
export function ProviderCard({ provider }: { provider: ProviderCardData }) {
  const { t } = useLanguage();

  return (
    <Link href={`/providers/${provider.slug}`} className="lk-card block hover:border-primary">
      <div className="flex items-start justify-between">
        <h2 className="font-heading text-[16px] font-bold text-ink">{provider.companyName}</h2>
        <span className="rounded-full bg-success-bg px-2.5 py-0.5 text-[12.5px] font-medium text-success">
          {t("providers.verified")}
        </span>
      </div>
      <p className="mt-1 text-[13.5px] text-ink-50">
        {provider.category &&
          (categoryKeyMap[provider.category.slug]
            ? t(categoryKeyMap[provider.category.slug] as Parameters<typeof t>[0])
            : provider.category.name)}
        {" - "}
        {provider.city}
      </p>
      <p className="mt-2 line-clamp-2 text-[15px] text-ink-70">{provider.description}</p>
    </Link>
  );
}
