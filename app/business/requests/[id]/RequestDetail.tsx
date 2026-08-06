"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n";
import { StatusBadge } from "@/components/StatusBadge";
import { StatusTimeline } from "@/components/StatusTimeline";
import { AttachmentsList } from "@/components/AttachmentsList";
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
  provider: { companyName: string | null };
  statusEvents: { id: string; fromStatus: RequestStatus | null; toStatus: RequestStatus; actor: string; note: string | null; createdAt: Date }[];
  attachments: { id: string; fileName: string; fileUrl: string }[];
};

export function RequestDetail({ request }: { request: RequestRow }) {
  const router = useRouter();
  const { t } = useLanguage();
  const [loading, setLoading] = useState<"confirm" | "cancel" | null>(null);

  async function act(action: "confirm" | "cancel") {
    setLoading(action);
    await fetch(`/api/service-requests/${request.id}/${action}`, { method: "POST" });
    setLoading(null);
    router.refresh();
  }

  return (
    <>
      <Link href="/business/requests" className="text-[13.5px] text-ink-50 hover:text-ink-70">
        &lt;- {t("req.backToRequests")}
      </Link>

      <div className="lk-card mt-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[12.5px] text-ink-50">{request.reference}</p>
            <h1 className="mt-0.5 font-heading text-[22px] font-bold text-ink">{request.title}</h1>
            <p className="mt-1 text-[13.5px] text-ink-50">
              {t("req.provider")}: {request.provider.companyName || "—"}
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

        {request.status === "COMPLETED" && (
          <div className="mt-6 border-t border-line pt-5">
            <p className="text-[13.5px] font-medium text-ink">{t("req.confirmCompletion")}</p>
            <p className="mt-1 text-[12.5px] text-ink-50">{t("req.confirmCompletionDesc")}</p>
            <button
              onClick={() => act("confirm")}
              disabled={loading !== null}
              className="lk-btn-primary mt-3 w-auto px-6"
            >
              {loading === "confirm" ? t("req.confirming") : t("req.confirmCompletion")}
            </button>
          </div>
        )}

        {(request.status === "SUBMITTED" || request.status === "ACCEPTED") && (
          <div className="mt-6 border-t border-line pt-5">
            <button
              onClick={() => act("cancel")}
              disabled={loading !== null}
              className="lk-btn-secondary w-auto px-6 !border-danger !text-danger"
            >
              {loading === "cancel" ? t("req.cancelling") : t("req.cancelRequest")}
            </button>
          </div>
        )}
      </div>

      <AttachmentsList attachments={request.attachments} />
      <StatusTimeline events={request.statusEvents} />
    </>
  );
}
