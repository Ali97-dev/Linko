"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import { StatusBadge } from "@/components/StatusBadge";
import { partyDisplayName } from "@/lib/serviceRequests";
import type { RequestStatus } from "@prisma/client";

type Row = {
  id: string;
  reference: string;
  title: string;
  status: RequestStatus;
  updatedAt: Date;
  business: { companyName: string | null } | null;
  businessNameSnapshot: string | null;
};

export function InboxList({ requests, categoryName }: { requests: Row[]; categoryName: string | null }) {
  const { t } = useLanguage();

  return (
    <>
      <h1 className="font-heading text-[26px] font-bold text-ink">{t("req.inbox")}</h1>
      <p className="mt-1 text-[13.5px] text-ink-50">
        {t("req.inboxDesc")}
        {categoryName ? ` · ${t("req.category")}: ${categoryName}` : ""}
      </p>

      <div className="mt-6 flex flex-col gap-4">
        {requests.length === 0 && (
          <p className="lk-card text-center text-[13.5px] text-ink-50">{t("req.noInboxRequests")}</p>
        )}
        {requests.map((r) => (
          <Link key={r.id} href={`/provider/requests/${r.id}`} className="lk-card block hover:border-primary">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[12.5px] text-ink-50">{r.reference}</p>
                <h2 className="mt-0.5 font-heading text-[16px] font-bold text-ink">{r.title}</h2>
                <p className="mt-1 text-[13.5px] text-ink-50">
                  {t("req.business")}: {partyDisplayName(r.business, r.businessNameSnapshot) || t("common.deletedAccount")}
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
