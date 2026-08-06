"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n";

export function HeaderSearch() {
  const [visible, setVisible] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 220);
    }
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <form
      action="/providers"
      className={`overflow-hidden transition-all duration-300 ${
        visible ? "w-72 opacity-100" : "w-0 opacity-0"
      }`}
    >
      <input
        name="q"
        placeholder={t("search.placeholder")}
        className="w-72 rounded-lg border border-line-strong bg-canvas px-3.5 py-2 text-[13.5px] text-ink outline-none focus:border-primary"
      />
    </form>
  );
}
