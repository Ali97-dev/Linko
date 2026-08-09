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
  provider: { companyName: string | null } | null;
  providerNameSnapshot: string | null;
};

export function RequestsList({ requests }: { requests: Row[] }) {
  const { t } = useLanguage();

  return (
    <>
      <h1 className="font-heading text-[26px] font-bold text-ink">{t("req.myRequests")}</h1>
      <p className="mt-1 text-[13.5px] text-ink-50">{t("req.myRequestsDesc")}</p>

      <div className="mt-6 flex flex-col gap-4">
        {requests.length === 0 && (
          <p className="lk-card text-center text-[13.5px] text-ink-50">{t("req.noRequests")}</p>
        )}
        {requests.map((r) => (
          <Link key={r.id} href={`/business/requests/${r.id}`} className="lk-card block hover:border-primary">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[12.5px] text-ink-50">{r.reference}</p>
                <h2 className="mt-0.5 font-heading text-[16px] font-bold text-ink">{r.title}</h2>
                <p className="mt-1 text-[13.5px] text-ink-50">
                  {t("req.provider")}: {partyDisplayName(r.provider, r.providerNameSnapshot) || t("common.deletedAccount")}
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
