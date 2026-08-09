"use client";

import { Search, Send, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

// Business-side counterpart to the 3-step section on /become-a-provider —
// same card treatment, different steps.
export function HowItWorks() {
  const { t } = useLanguage();

  const steps = [
    { icon: Search, title: t("home.step1Title"), desc: t("home.step1Desc") },
    { icon: Send, title: t("home.step2Title"), desc: t("home.step2Desc") },
    { icon: CheckCircle2, title: t("home.step3Title"), desc: t("home.step3Desc") },
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="mx-auto max-w-xl text-center">
        <h2 className="font-heading text-[28px] font-bold text-ink">{t("home.howItWorksTitle")}</h2>
        <p className="mt-2 text-[15px] text-ink-70">{t("home.howItWorksSubtitle")}</p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {steps.map((s, i) => (
          <div key={i} className="lk-card text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-primary-50">
              <s.icon size={20} className="text-primary" />
            </div>
            <h3 className="mt-4 font-heading text-[16px] font-bold text-ink">{s.title}</h3>
            <p className="mt-1 text-[13.5px] text-ink-70">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
