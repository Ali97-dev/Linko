"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import { AccountRow } from "./AccountRow";

export type Account = {
  id: string;
  email: string;
  status: string;
  createdAt: Date;
  business: { companyName: string | null } | null;
  provider: { companyName: string | null } | null;
};

export function AccountsList({
  accounts,
  tab,
  q,
}: {
  accounts: Account[];
  tab: "business" | "provider";
  q: string;
}) {
  const { t } = useLanguage();
  const [search, setSearch] = useState(q);

  function tabHref(nextTab: "business" | "provider") {
    const params = new URLSearchParams();
    params.set("tab", nextTab);
    if (q) params.set("q", q);
    return `/admin/accounts?${params.toString()}`;
  }

  function applySearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set("tab", tab);
    if (search.trim()) params.set("q", search.trim());
    window.location.href = `/admin/accounts?${params.toString()}`;
  }

  return (
    <>
      <h1 className="font-heading text-[26px] font-bold text-ink">{t("accounts.title")}</h1>
      <p className="mt-1 text-[13.5px] text-ink-50">{t("accounts.subtitle")}</p>

      <div className="mt-6 flex gap-2 border-b border-line">
        <Link
          href={tabHref("business")}
          className={`border-b-2 px-1 pb-3 text-[14.5px] font-medium ${
            tab === "business" ? "border-ink text-ink" : "border-transparent text-ink-50 hover:text-ink-70"
          }`}
        >
          {t("accounts.tabBusiness")}
        </Link>
        <Link
          href={tabHref("provider")}
          className={`border-b-2 px-1 pb-3 text-[14.5px] font-medium ${
            tab === "provider" ? "border-ink text-ink" : "border-transparent text-ink-50 hover:text-ink-70"
          }`}
        >
          {t("accounts.tabProvider")}
        </Link>
      </div>

      <form onSubmit={applySearch} className="mt-5 flex gap-3">
        <input
          className="lk-input"
          placeholder={t("accounts.searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="lk-btn-secondary w-auto px-5">
          {t("accounts.search")}
        </button>
      </form>

      <div className="mt-6 overflow-hidden rounded-xl border border-line">
        <div className="hidden grid-cols-[2fr_1.5fr_1fr_1fr_auto] gap-3 border-b border-line bg-canvas px-4 py-2.5 text-[12px] font-semibold uppercase tracking-wide text-ink-50 sm:grid">
          <span>{t("accounts.email")}</span>
          <span>{t("accounts.companyName")}</span>
          <span>{t("accounts.status")}</span>
          <span>{t("accounts.dateJoined")}</span>
          <span />
        </div>

        {accounts.length === 0 && (
          <p className="px-4 py-8 text-center text-[13.5px] text-ink-50">{t("accounts.noResults")}</p>
        )}

        {accounts.map((account) => (
          <AccountRow key={account.id} account={account} />
        ))}
      </div>
    </>
  );
}
