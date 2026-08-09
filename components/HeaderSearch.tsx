"use client";

import { useLanguage } from "@/lib/i18n";

// Scroll state now lives in HeaderBar and is passed down, so this and
// HeaderNav's condensed state always agree.
export function HeaderSearch({ visible }: { visible: boolean }) {
  const { t } = useLanguage();

  return (
    <form
      action="/providers"
      aria-hidden={!visible}
      className={`overflow-hidden transition-all duration-300 ${
        visible ? "w-72 opacity-100" : "w-0 opacity-0"
      }`}
    >
      <input
        name="q"
        placeholder={t("search.placeholder")}
        tabIndex={visible ? 0 : -1}
        className="w-72 rounded-lg border border-line-strong bg-canvas px-3.5 py-2 text-[13.5px] text-ink outline-none focus:border-primary"
      />
    </form>
  );
}
