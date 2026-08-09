"use client";

import { useEffect, useState } from "react";
import { HeaderSearch } from "./HeaderSearch";
import { HeaderNav } from "./HeaderNav";
import type { Role } from "@prisma/client";

type Category = { id: string; slug: string; name: string };
type Session = { role: Role; email: string } | null;

// Matches the point in the hero where HeaderSearch used to start fading in.
const SCROLL_THRESHOLD = 220;

// Single scroll listener shared by the search bar and the nav, so both
// switch to their "scrolled" state together instead of drifting out of
// sync (which is what caused the crowded/broken layout).
export function HeaderBar({ categories, session }: { categories: Category[]; session: Session }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="flex flex-1 items-center justify-end gap-6">
      <HeaderSearch visible={scrolled} />
      <HeaderNav categories={categories} condensed={scrolled} session={session} />
    </div>
  );
}
