"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
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

// condensed = header is in its "scrolled" state (search bar visible) — this
// only ever applies at md+ widths (see HeaderBar). Below md, the condensed
// (hamburger) nav is used unconditionally regardless of scroll, via the
// "hidden md:flex" / "flex md:hidden" pairing below — there's simply never
// room for the full nav on a phone-width screen, scrolled or not.
export function HeaderNav({ categories, condensed }: { categories: Category[]; condensed: boolean }) {
  const { t } = useLanguage();
  const [modal, setModal] = useState<"login" | "signup" | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Collapsing back to the full nav (scrolling up past the threshold, at
  // md+ widths) should close any open condensed menu rather than leave it
  // stranded.
  useEffect(() => {
    if (!condensed) setMenuOpen(false);
  }, [condensed]);

  useEffect(() => {
    if (!menuOpen) return;

    function onPointerDown(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const exploreLinks = (
    <>
      <Link
        href="/providers"
        className="block px-4 py-2.5 text-[14.5px] font-medium text-ink hover:bg-canvas"
        onClick={() => setMenuOpen(false)}
      >
        {t("nav.allProviders")}
      </Link>
      <div className="my-1 border-t border-line" />
      {categories.map((c) => (
        <Link
          key={c.id}
          href={`/providers?category=${c.slug}`}
          className="block px-4 py-2.5 text-[14.5px] text-ink-70 hover:bg-canvas hover:text-ink"
          onClick={() => setMenuOpen(false)}
        >
          {categoryKeyMap[c.slug] ? t(categoryKeyMap[c.slug] as Parameters<typeof t>[0]) : c.name}
        </Link>
      ))}
    </>
  );

  const joinButton = (
    <button
      onClick={() => setModal("signup")}
      className="rounded-lg bg-ink px-5 py-2.5 text-[15px] font-bold text-white hover:bg-ink-70 sm:px-7 sm:py-3 sm:text-[16px]"
    >
      {t("nav.join")}
    </button>
  );

  return (
    <>
      {/* Full nav — only ever shown at md+ widths, and only while not
          scrolled past the condense threshold there. */}
      {!condensed && (
        <nav className="hidden items-center gap-9 md:flex">
          <div className="group relative">
            <button className="flex items-center gap-1.5 text-[16px] font-medium text-ink-70 hover:text-ink">
              {t("nav.explore")}
              <span className="text-[11px]">v</span>
            </button>
            <div className="invisible absolute left-0 top-full z-20 w-60 rounded-lg border border-line bg-surface py-2 opacity-0 shadow-lg transition-opacity group-hover:visible group-hover:opacity-100">
              {exploreLinks}
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
          {joinButton}
        </nav>
      )}

      {/* Condensed (hamburger) nav — the default below md regardless of
          scroll; also used at md+ once scrolled past the threshold. */}
      <nav className={`items-center gap-3 sm:gap-4 ${condensed ? "flex" : "flex md:hidden"}`}>
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? t("nav.closeMenu") : t("nav.menu")}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-line-strong text-ink-70 hover:bg-canvas hover:text-ink"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          {menuOpen && (
            <div
              role="menu"
              aria-label={t("nav.menu")}
              className="absolute end-0 top-full z-20 mt-2 w-64 max-w-[calc(100vw-2rem)] rounded-lg border border-line bg-surface py-2 shadow-lg"
            >
              <p className="px-4 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wide text-ink-50">
                {t("nav.explore")}
              </p>
              {exploreLinks}
              <div className="my-1 border-t border-line" />
              <div className="px-4 py-2">
                <LanguageToggle />
              </div>
              <Link
                href="/become-a-provider"
                className="block px-4 py-2.5 text-[14.5px] font-medium text-ink-70 hover:bg-canvas hover:text-ink"
                onClick={() => setMenuOpen(false)}
              >
                {t("nav.becomeProvider")}
              </Link>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setModal("login");
                }}
                className="block w-full px-4 py-2.5 text-start text-[14.5px] font-medium text-ink-70 hover:bg-canvas hover:text-ink"
              >
                {t("nav.login")}
              </button>
            </div>
          )}
        </div>

        {joinButton}
      </nav>

      {modal && <AuthModal initialMode={modal} onClose={() => setModal(null)} />}
    </>
  );
}
