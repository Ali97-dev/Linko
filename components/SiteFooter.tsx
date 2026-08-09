"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import { LogoMark } from "./LogoMark";

// Static list matching the categories seeded/used elsewhere in the header
// and homepage — avoids an extra DB round-trip on every page just for the
// footer, since this list changes rarely if ever.
const categoryLinks = [
  { slug: "accounting", key: "category.accounting" },
  { slug: "legal", key: "category.legal" },
  { slug: "technology", key: "category.technology" },
  { slug: "marketing", key: "category.marketing" },
  { slug: "government-pro-services", key: "category.government-pro-services" },
] as const;

export function SiteFooter() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" dir="ltr" className="font-heading text-[22px] font-black leading-none text-ink">
              LINKO
              <LogoMark />
            </Link>
            <p className="mt-3 max-w-xs text-[13.5px] text-ink-70">{t("footer.tagline")}</p>
          </div>

          <div>
            <h3 className="text-[13px] font-semibold uppercase tracking-wide text-ink-50">
              {t("footer.exploreHeading")}
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              <li>
                <Link href="/providers" className="text-[14px] text-ink-70 hover:text-ink">
                  {t("nav.allProviders")}
                </Link>
              </li>
              {categoryLinks.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/providers?category=${c.slug}`}
                    className="text-[14px] text-ink-70 hover:text-ink"
                  >
                    {t(c.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[13px] font-semibold uppercase tracking-wide text-ink-50">
              {t("footer.companyHeading")}
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              <li>
                <Link href="/about" className="text-[14px] text-ink-70 hover:text-ink">
                  {t("footer.about")}
                </Link>
              </li>
              <li>
                <Link href="/become-a-provider" className="text-[14px] text-ink-70 hover:text-ink">
                  {t("nav.becomeProvider")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[14px] text-ink-70 hover:text-ink">
                  {t("footer.contact")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[13px] font-semibold uppercase tracking-wide text-ink-50">
              {t("footer.legalHeading")}
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              <li>
                <Link href="/terms" className="text-[14px] text-ink-70 hover:text-ink">
                  {t("footer.terms")}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-[14px] text-ink-70 hover:text-ink">
                  {t("footer.privacy")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-line pt-6 text-center text-[13px] text-ink-50">
          © {year} LINKO. {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
}
