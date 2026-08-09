"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n";
import { StatusBadge } from "@/components/StatusBadge";
import { StatusTimeline } from "@/components/StatusTimeline";
import { AttachmentsList } from "@/components/AttachmentsList";
import { partyDisplayName } from "@/lib/serviceRequests";
import type { RequestStatus } from "@prisma/client";

type RequestRow = {
  id: string;
  reference: string;
  title: string;
  description: string;
  budget: number | null;
  requiredByDate: Date | null;
  status: RequestStatus;
  declineReason: string | null;
  business: { companyName: string | null } | null;
  businessNameSnapshot: string | null;
  provider: { companyName: string | null; category: { name: string } | null } | null;
  providerNameSnapshot: string | null;
  statusEvents: { id: string; fromStatus: RequestStatus | null; toStatus: RequestStatus; actor: string; note: string | null; createdAt: Date }[];
  attachments: { id: string; fileName: string }[];
};

export function RequestDetail({ request }: { request: RequestRow }) {
  const router = useRouter();
  const { t } = useLanguage();
  const [closing, setClosing] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const terminal = request.status === "CLOSED" || request.status === "DECLINED" || request.status === "CANCELLED";

  async function confirmClose() {
    if (!reason.trim()) return;
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/service-requests/${request.id}/close`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });
    setLoading(false);
    if (res.ok) {
      setClosing(false);
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(typeof data.error === "string" ? data.error : "Something went wrong");
    }
  }

  return (
    <>
      <Link href="/admin/requests" className="text-[13.5px] text-ink-50 hover:text-ink-70">
        &lt;- {t("req.backToAllRequests")}
      </Link>

      <div className="lk-card mt-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[12.5px] text-ink-50">{request.reference}</p>
            <h1 className="mt-0.5 font-heading text-[22px] font-bold text-ink">{request.title}</h1>
            <p className="mt-1 text-[13.5px] text-ink-50">
              {t("req.business")}: {partyDisplayName(request.business, request.businessNameSnapshot) || t("common.deletedAccount")}{" "}
              · {t("req.provider")}: {partyDisplayName(request.provider, request.providerNameSnapshot) || t("common.deletedAccount")}
              {request.provider?.category ? ` · ${request.provider.category.name}` : ""}
            </p>
          </div>
          <StatusBadge status={request.status} />
        </div>

        <p className="mt-5 whitespace-pre-line text-[15px] leading-[1.8] text-ink-70">{request.description}</p>

        <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-5 text-[13.5px]">
          {request.budget != null && (
            <div>
              <dt className="text-ink-50">{t("req.budget")}</dt>
              <dd className="mt-0.5 text-ink-70">{request.budget}</dd>
            </div>
          )}
          {request.requiredByDate && (
            <div>
              <dt className="text-ink-50">{t("req.requiredBy")}</dt>
              <dd className="mt-0.5 text-ink-70">{new Date(request.requiredByDate).toLocaleDateString()}</dd>
            </div>
          )}
        </dl>

        {request.status === "DECLINED" && request.declineReason && (
          <p className="mt-4 rounded-lg bg-danger-bg px-3 py-2 text-[13.5px] text-danger">
            {t("req.declineReason")}: {request.declineReason}
          </p>
        )}

        {error && <p className="mt-4 rounded-lg bg-danger-bg px-3 py-2 text-[13.5px] text-danger">{error}</p>}

        {!terminal && !closing && (
          <div className="mt-6 border-t border-line pt-5">
            <button
              onClick={() => setClosing(true)}
              className="lk-btn-secondary w-auto px-6 !border-danger !text-danger"
            >
              {t("req.closeRequest")}
            </button>
          </div>
        )}
        {!terminal && closing && (
          <div className="mt-6 flex flex-col gap-2 border-t border-line pt-5">
            <label className="lk-label">{t("req.closeReason")}</label>
            <input className="lk-input" value={reason} onChange={(e) => setReason(e.target.value)} />
            <div className="mt-1 flex gap-3">
              <button
                onClick={confirmClose}
                disabled={loading || !reason.trim()}
                className="lk-btn-primary w-auto px-5"
              >
                {loading ? t("req.closing") : t("req.confirmClose")}
              </button>
              <button onClick={() => setClosing(false)} className="lk-btn-secondary w-auto px-5">
                {t("req.cancel")}
              </button>
            </div>
          </div>
        )}
        {terminal && (
          <p className="mt-6 border-t border-line pt-5 text-[13.5px] text-ink-50">{t("req.readOnlyClosed")}</p>
        )}
      </div>

      <AttachmentsList requestId={request.id} attachments={request.attachments} />
      <StatusTimeline events={request.statusEvents} />
    </>
  );
}
