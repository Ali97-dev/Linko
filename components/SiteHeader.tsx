import Link from "next/link";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { LogoMark } from "./LogoMark";
import { HeaderBar } from "./HeaderBar";

// This header is also reached by an already-logged-in user (e.g. clicking
// the logo from their dashboard, or the site's own "All providers" links) —
// it always rendered the guest "Log in"/"Join" nav regardless, which read
// as if navigating there had logged them out. It hadn't: the session cookie
// was untouched the whole time, the header just never checked for it. Fixed
// by checking the session here and passing it down.
export async function SiteHeader() {
  const [categories, session] = await Promise.all([
    prisma.category.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    }),
    getSession(),
  ]);

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          dir="ltr"
          className="shrink-0 font-heading text-[26px] font-black leading-none text-ink"
        >
          LINKO
          <LogoMark />
        </Link>

        <HeaderBar categories={categories} session={session ? { role: session.role, email: session.email } : null} />
      </div>
    </header>
  );
}
