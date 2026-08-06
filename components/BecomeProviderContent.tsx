"use client";

import { useLanguage } from "@/lib/i18n";
import { UserPlus, ShieldCheck, Inbox } from "lucide-react";
import { BecomeProviderCTA } from "./BecomeProviderCTA";

export function BecomeProviderContent() {
  const { t } = useLanguage();

  const steps = [
    { icon: UserPlus, title: t("provider.step1Title"), desc: t("provider.step1Desc") },
    { icon: ShieldCheck, title: t("provider.step2Title"), desc: t("provider.step2Desc") },
    { icon: Inbox, title: t("provider.step3Title"), desc: t("provider.step3Desc") },
  ];

  return (
    <>
      <section
        className="px-6 py-24 text-center"
        style={{ background: "#0e1526" }}
      >
        <h1 className="mx-auto max-w-2xl font-heading text-[40px] font-bold leading-tight text-white sm:text-[48px]">
          {t("provider.title")}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-[17px] text-white/80">{t("provider.subtitle")}</p>
        <div className="mt-8">
          <BecomeProviderCTA />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {steps.map((s, i) => (
            <div key={i} className="lk-card text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-primary-50">
                <s.icon size={20} className="text-primary" />
              </div>
              <h2 className="mt-4 font-heading text-[16px] font-bold text-ink">{s.title}</h2>
              <p className="mt-1 text-[13.5px] text-ink-70">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
