"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { LanguageToggle } from "./LanguageToggle";
import { AuthModal } from "./AuthModal";
import type { Role } from "@prisma/client";

type Category = { id: string; slug: string; name: string };
type Session = { role: Role; email: string } | null;

const categoryKeyMap: Record<string, string> = {
  accounting: "category.accounting",
  legal: "category.legal",
  technology: "category.technology",
  marketing: "category.marketing",
  "government-pro-services": "category.government-pro-services",
};

const DASHBOARD_PATH: Record<Role, string> = {
  BUSINESS: "/business",
  PROVIDER: "/provider",
  ADMIN: "/admin",
};

// condensed = header is in its "scrolled" state (search bar visible) — this
// only ever applies at md+ widths (see HeaderBar). Below md, the condensed
// (hamburger) nav is used unconditionally regardless of scroll, via the
// "hidden md:flex" / "flex md:hidden" pairing below — there's simply never
// room for the full nav on a phone-width screen, scrolled or not.
//
// session: this public header is also reachable by an already-logged-in
// user (clicking the logo from their dashboard, following a directory
// link, etc). When present, the Log in / Join pair is replaced with a link
// back to their dashboard and a working Log out — previously this always
// rendered the guest nav regardless of session state, which read as if
// navigating here had logged the user out (it hadn't; only the UI ignored
// the session).
export function HeaderNav({
  categories,
  condensed,
  session,
}: {
  categories: Category[];
  condensed: boolean;
  session: Session;
}) {
  const { t } = useLanguage();
  const router = useRouter();
  const [modal, setModal] = useState<"login" | "signup" | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Collapsing back to the full nav (scrolling up past the threshold, at
  // md+ widths) should close any open condensed menu rather than leave it
  // stranded.
  useEffect(() => {
    if (!condensed) setMenuOpen(false);
  }, [condensed]);

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

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

  // Desktop account area: guest gets Log in + Join, a logged-in visitor
  // gets a link back to their dashboard + Log out instead.
  const accountArea = session ? (
    <>
      <Link href={DASHBOARD_PATH[session.role]} className="text-[16px] font-medium text-ink-70 hover:text-ink">
        {t("dash.dashboard")}
      </Link>
      <button
        onClick={handleLogout}
        disabled={loggingOut}
        className="lk-btn-secondary w-auto px-5 py-2.5 text-[15px]"
      >
        {loggingOut ? t("dash.loggingOut") : t("dash.logout")}
      </button>
    </>
  ) : (
    <>
      <button
        onClick={() => setModal("login")}
        className="text-[16px] font-medium text-ink-70 hover:text-ink"
      >
        {t("nav.login")}
      </button>
      {joinButton}
    </>
  );

  // Same idea, styled for the condensed/mobile menu list.
  const accountMenuItems = session ? (
    <>
      <Link
        href={DASHBOARD_PATH[session.role]}
        className="block px-4 py-2.5 text-[14.5px] font-medium text-ink-70 hover:bg-canvas hover:text-ink"
        onClick={() => setMenuOpen(false)}
      >
        {t("dash.dashboard")}
      </Link>
      <button
        onClick={() => {
          setMenuOpen(false);
          handleLogout();
        }}
        disabled={loggingOut}
        className="block w-full px-4 py-2.5 text-start text-[14.5px] font-medium text-danger hover:bg-canvas"
      >
        {loggingOut ? t("dash.loggingOut") : t("dash.logout")}
      </button>
    </>
  ) : (
    <button
      onClick={() => {
        setMenuOpen(false);
        setModal("login");
      }}
      className="block w-full px-4 py-2.5 text-start text-[14.5px] font-medium text-ink-70 hover:bg-canvas hover:text-ink"
    >
      {t("nav.login")}
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
          {accountArea}
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
              <div className="my-1 border-t border-line" />
              {accountMenuItems}
            </div>
          )}
        </div>

        {!session && joinButton}
      </nav>

      {modal && <AuthModal initialMode={modal} onClose={() => setModal(null)} />}
    </>
  );
}
