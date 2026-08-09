"use client";

import { useLanguage } from "@/lib/i18n";

type Props = {
  businessCount: number;
  providerCount: number;
  totalRequests: number;
  providersByState: Record<string, number>;
  requestsByStatus: Record<string, number>;
  requestsByCategory: { slug: string; name: string; count: number }[];
  uncategorizedCount: number;
};

const VERIFICATION_STATE_KEYS: Record<string, string> = {
  DRAFT: "reports.stateDraft",
  PENDING: "reports.statePending",
  APPROVED: "reports.stateApproved",
  REJECTED: "reports.stateRejected",
};

const REQUEST_STATUS_ORDER = ["SUBMITTED", "ACCEPTED", "IN_PROGRESS", "COMPLETED", "CLOSED", "DECLINED", "CANCELLED"];

const categoryKeyMap: Record<string, string> = {
  accounting: "category.accounting",
  legal: "category.legal",
  technology: "category.technology",
  marketing: "category.marketing",
  "government-pro-services": "category.government-pro-services",
};

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="lk-card text-center">
      <p className="font-heading text-[30px] font-bold text-ink">{value}</p>
      <p className="mt-1 text-[13px] text-ink-50">{label}</p>
    </div>
  );
}

function BreakdownTable({
  title,
  rows,
}: {
  title: string;
  rows: { label: string; count: number }[];
}) {
  const max = Math.max(1, ...rows.map((r) => r.count));

  return (
    <div className="lk-card">
      <h2 className="font-heading text-[16px] font-bold text-ink">{title}</h2>
      <div className="mt-4 flex flex-col gap-3">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center gap-3">
            <span className="w-40 shrink-0 truncate text-[13.5px] text-ink-70">{r.label}</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-canvas">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${(r.count / max) * 100}%` }}
              />
            </div>
            <span className="w-8 shrink-0 text-end text-[13.5px] font-medium text-ink">{r.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ReportsContent({
  businessCount,
  providerCount,
  totalRequests,
  providersByState,
  requestsByStatus,
  requestsByCategory,
  uncategorizedCount,
}: Props) {
  const { t } = useLanguage();

  const statusRows = REQUEST_STATUS_ORDER.map((s) => ({
    label: t(`status.${s}` as Parameters<typeof t>[0]),
    count: requestsByStatus[s] ?? 0,
  }));

  const categoryRows = [
    ...requestsByCategory.map((c) => ({
      label: categoryKeyMap[c.slug] ? t(categoryKeyMap[c.slug] as Parameters<typeof t>[0]) : c.name,
      count: c.count,
    })),
    ...(uncategorizedCount > 0 ? [{ label: t("reports.uncategorized"), count: uncategorizedCount }] : []),
  ];

  return (
    <>
      <h1 className="font-heading text-[26px] font-bold text-ink">{t("reports.title")}</h1>
      <p className="mt-1 text-[13.5px] text-ink-50">{t("reports.subtitle")}</p>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <StatCard label={t("reports.totalBusinesses")} value={businessCount} />
        <StatCard label={t("reports.totalProviders")} value={providerCount} />
        <StatCard label={t("reports.totalRequests")} value={totalRequests} />
      </div>

      <div className="mt-4">
        <div className="lk-card">
          <h2 className="font-heading text-[16px] font-bold text-ink">{t("reports.providersByState")}</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Object.entries(VERIFICATION_STATE_KEYS).map(([state, key]) => (
              <div key={state} className="rounded-lg bg-canvas px-3 py-3 text-center">
                <p className="font-heading text-[22px] font-bold text-ink">{providersByState[state] ?? 0}</p>
                <p className="mt-0.5 text-[12.5px] text-ink-50">{t(key as Parameters<typeof t>[0])}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <BreakdownTable title={t("reports.requestsByStatus")} rows={statusRows} />
        <BreakdownTable title={t("reports.requestsByCategory")} rows={categoryRows} />
      </div>
    </>
  );
}
