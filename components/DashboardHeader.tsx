"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { LogoMark } from "./LogoMark";
import { LanguageToggle } from "./LanguageToggle";
import type { Role } from "@prisma/client";

type NavLink = { href: string; labelKey: Parameters<ReturnType<typeof useLanguage>["t"]>[0] };

const NAV_LINKS: Record<Role, NavLink[]> = {
  BUSINESS: [
    { href: "/business", labelKey: "dash.dashboard" },
    { href: "/business/requests", labelKey: "dash.myRequests" },
  ],
  PROVIDER: [
    { href: "/provider", labelKey: "dash.dashboard" },
    { href: "/provider/requests", labelKey: "dash.requests" },
    { href: "/provider/profile", labelKey: "dash.myServices" },
  ],
  ADMIN: [
    { href: "/admin", labelKey: "dash.dashboard" },
    { href: "/admin/verification", labelKey: "dash.verificationQueue" },
    { href: "/admin/requests", labelKey: "dash.allRequests" },
  ],
};

// Separate from the public SiteHeader — "Log in" / "Join" don't apply to an
// already-authenticated user. This is what gives a logged-in user any way
// back to the homepage and any visible way to log out, on every page under
// /business, /provider, and /admin (wired up via each role's layout.tsx).
export function DashboardHeader({ role, email }: { role: Role; email: string }) {
  const { t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  const links = NAV_LINKS[role];

  function isActive(href: string) {
    return href === `/${role.toLowerCase()}` ? pathname === href : pathname.startsWith(href);
  }

  const linkClass = (href: string) =>
    `text-[15px] font-medium ${isActive(href) ? "text-ink" : "text-ink-70 hover:text-ink"}`;

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" dir="ltr" className="shrink-0 font-heading text-[24px] font-black leading-none text-ink">
          LINKO
          <LogoMark />
        </Link>

        {/* Desktop — full row, always at md+ (no scroll-based condensing needed here) */}
        <nav className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass(link.href)}>
              {t(link.labelKey)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <LanguageToggle />
          <span className="max-w-[220px] truncate text-[13px] text-ink-50" title={email}>
            {email}
          </span>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="lk-btn-secondary w-auto px-4 py-2 text-[13.5px]"
          >
            {loggingOut ? t("dash.loggingOut") : t("dash.logout")}
          </button>
        </div>

        {/* Mobile — hamburger regardless of scroll, same pattern as the public header */}
        <div className="relative md:hidden" ref={menuRef}>
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
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-4 py-2.5 text-[14.5px] font-medium ${
                    isActive(link.href) ? "text-ink" : "text-ink-70 hover:bg-canvas hover:text-ink"
                  }`}
                >
                  {t(link.labelKey)}
                </Link>
              ))}
              <div className="my-1 border-t border-line" />
              <div className="px-4 py-2">
                <LanguageToggle />
              </div>
              <p className="truncate px-4 py-1.5 text-[12.5px] text-ink-50" title={email}>
                {email}
              </p>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="block w-full px-4 py-2.5 text-start text-[14.5px] font-medium text-danger hover:bg-canvas"
              >
                {loggingOut ? t("dash.loggingOut") : t("dash.logout")}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
