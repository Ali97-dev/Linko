"use client";

import { useLanguage } from "@/lib/i18n";

export function LanguageToggle() {
  const { lang, setLang, t } = useLanguage();

  return (
    <div className="group relative">
      <button className="flex items-center gap-1 rounded-lg border border-line-strong px-3 py-1.5 text-[13px] font-medium text-ink-70 hover:bg-canvas">
        {lang.toUpperCase()}
      </button>
      <div className="invisible absolute right-0 top-full z-20 w-36 rounded-lg border border-line bg-surface py-1 opacity-0 shadow-lg transition-opacity group-hover:visible group-hover:opacity-100">
        <button
          onClick={() => setLang("en")}
          className="block w-full px-3 py-2 text-left text-[13.5px] text-ink-70 hover:bg-canvas"
        >
          {t("lang.english")}
        </button>
        <button
          onClick={() => setLang("ar")}
          className="block w-full px-3 py-2 text-left text-[13.5px] text-ink-70 hover:bg-canvas"
        >
          {t("lang.arabic")}
        </button>
      </div>
    </div>
  );
}
