"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n";
import { StatusBadge } from "@/components/StatusBadge";
import type { RequestStatus } from "@prisma/client";

const STATUSES: RequestStatus[] = [
  "SUBMITTED",
  "ACCEPTED",
  "IN_PROGRESS",
  "COMPLETED",
  "CLOSED",
  "DECLINED",
  "CANCELLED",
];

type Row = {
  id: string;
  reference: string;
  title: string;
  status: RequestStatus;
  updatedAt: Date;
  business: { companyName: string | null };
  provider: { companyName: string | null; category: { name: string; slug: string } | null };
};

type Category = { id: string; slug: string; name: string };

export function RequestsFilterList({
  requests,
  categories,
  filters,
}: {
  requests: Row[];
  categories: Category[];
  filters: { status: string; category: string; business: string; provider: string };
}) {
  const router = useRouter();
  const { t } = useLanguage();
  const [form, setForm] = useState(filters);

  function applyFilters(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (form.status) params.set("status", form.status);
    if (form.category) params.set("category", form.category);
    if (form.business) params.set("business", form.business);
    if (form.provider) params.set("provider", form.provider);
    router.push(`/admin/requests?${params.toString()}`);
  }

  return (
    <>
      <h1 className="font-heading text-[26px] font-bold text-ink">{t("req.adminAll")}</h1>
      <p className="mt-1 text-[13.5px] text-ink-50">{t("req.adminAllDesc")}</p>

      <form onSubmit={applyFilters} className="lk-card mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="flex flex-col gap-1.5">
          <label className="lk-label">{t("req.filterStatus")}</label>
          <select
            className="lk-input"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="">{t("req.filterAll")}</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {t(`status.${s}`)}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="lk-label">{t("req.filterCategory")}</label>
          <select
            className="lk-input"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="">{t("req.filterAll")}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="lk-label">{t("req.filterBusiness")}</label>
          <input
            className="lk-input"
            value={form.business}
            onChange={(e) => setForm({ ...form, business: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="lk-label">{t("req.filterProvider")}</label>
          <input
            className="lk-input"
            value={form.provider}
            onChange={(e) => setForm({ ...form, provider: e.target.value })}
          />
        </div>
        <button type="submit" className="lk-btn-primary col-span-2 w-auto px-6 sm:col-span-4">
          {t("req.applyFilters")}
        </button>
      </form>

      <div className="mt-6 flex flex-col gap-4">
        {requests.length === 0 && (
          <p className="lk-card text-center text-[13.5px] text-ink-50">{t("req.noResults")}</p>
        )}
        {requests.map((r) => (
          <Link key={r.id} href={`/admin/requests/${r.id}`} className="lk-card block hover:border-primary">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[12.5px] text-ink-50">{r.reference}</p>
                <h2 className="mt-0.5 font-heading text-[16px] font-bold text-ink">{r.title}</h2>
                <p className="mt-1 text-[13.5px] text-ink-50">
                  {t("req.business")}: {r.business.companyName || "—"} · {t("req.provider")}:{" "}
                  {r.provider.companyName || "—"}
                  {r.provider.category ? ` · ${r.provider.category.name}` : ""}
                </p>
              </div>
              <StatusBadge status={r.status} />
            </div>
            <p className="mt-3 text-[12.5px] text-ink-50">
              {t("req.lastUpdated")}: {new Date(r.updatedAt).toLocaleDateString()}
            </p>
          </Link>
        ))}
      </div>
    </>
  );
}
