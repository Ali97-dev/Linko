"use client";

import { useRef, useState } from "react";
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
  business: { companyName: string | null };
  statusEvents: { id: string; fromStatus: RequestStatus | null; toStatus: RequestStatus; actor: string; note: string | null; createdAt: Date }[];
  attachments: { id: string; fileName: string }[];
};

export function RequestDetail({ request }: { request: RequestRow }) {
  const router = useRouter();
  const { t } = useLanguage();
  const [loading, setLoading] = useState<string | null>(null);
  const [declining, setDeclining] = useState(false);
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  async function act(action: string, body?: object) {
    setLoading(action);
    setError(null);
    const res = await fetch(`/api/service-requests/${request.id}/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body || {}),
    });
    setLoading(null);
    if (res.ok) {
      setDeclining(false);
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(typeof data.error === "string" ? data.error : "Something went wrong");
    }
  }

  async function addDeliverable(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setLoading("attachment");
    setError(null);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`/api/service-requests/${request.id}/attachments`, {
      method: "POST",
      body: formData,
    });
    setLoading(null);
    if (res.ok) {
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(typeof data.error === "string" ? data.error : "Something went wrong");
    }
  }

  const readOnly = request.status === "CLOSED" || request.status === "DECLINED" || request.status === "CANCELLED";

  return (
    <>
      <Link href="/provider/requests" className="text-[13.5px] text-ink-50 hover:text-ink-70">
        &lt;- {t("req.backToInbox")}
      </Link>

      <div className="lk-card mt-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[12.5px] text-ink-50">{request.reference}</p>
            <h1 className="mt-0.5 font-heading text-[22px] font-bold text-ink">{request.title}</h1>
            <p className="mt-1 text-[13.5px] text-ink-50">
              {t("req.business")}: {request.business.companyName || "—"}
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

        {error && <p className="mt-4 rounded-lg bg-danger-bg px-3 py-2 text-[13.5px] text-danger">{error}</p>}
        {readOnly && (
          <p className="mt-6 border-t border-line pt-5 text-[13.5px] text-ink-50">{t("req.readOnlyClosed")}</p>
        )}

        {request.status === "SUBMITTED" && !declining && (
          <div className="mt-6 flex gap-3 border-t border-line pt-5">
            <button onClick={() => act("accept")} disabled={loading !== null} className="lk-btn-primary w-auto px-6">
              {loading === "accept" ? t("req.accepting") : t("req.accept")}
            </button>
            <button
              onClick={() => setDeclining(true)}
              disabled={loading !== null}
              className="lk-btn-secondary w-auto px-6 !border-danger !text-danger"
            >
              {t("req.decline")}
            </button>
          </div>
        )}
        {request.status === "SUBMITTED" && declining && (
          <div className="mt-6 flex flex-col gap-2 border-t border-line pt-5">
            <label className="lk-label">{t("req.declineReason")}</label>
            <input className="lk-input" value={reason} onChange={(e) => setReason(e.target.value)} />
            <div className="mt-1 flex gap-3">
              <button
                onClick={() => act("decline", { reason })}
                disabled={loading !== null || !reason.trim()}
                className="lk-btn-primary w-auto px-5"
              >
                {loading === "decline" ? t("req.declining") : t("req.confirmDecline")}
              </button>
              <button onClick={() => setDeclining(false)} className="lk-btn-secondary w-auto px-5">
                {t("req.cancel")}
              </button>
            </div>
          </div>
        )}

        {request.status === "ACCEPTED" && (
          <div className="mt-6 flex flex-col gap-2 border-t border-line pt-5">
            <label className="lk-label">{t("req.noteOptional")}</label>
            <input className="lk-input" value={note} onChange={(e) => setNote(e.target.value)} />
            <button
              onClick={() => act("start", { note: note || undefined })}
              disabled={loading !== null}
              className="lk-btn-primary mt-1 w-auto px-6"
            >
              {loading === "start" ? t("req.starting") : t("req.startWork")}
            </button>
          </div>
        )}

        {request.status === "IN_PROGRESS" && (
          <div className="mt-6 flex flex-col gap-2 border-t border-line pt-5">
            <label className="lk-label">{t("req.noteOptional")}</label>
            <input className="lk-input" value={note} onChange={(e) => setNote(e.target.value)} />
            <button
              onClick={() => act("complete", { note: note || undefined })}
              disabled={loading !== null}
              className="lk-btn-primary mt-1 w-auto px-6"
            >
              {loading === "complete" ? t("req.completing") : t("req.markComplete")}
            </button>
          </div>
        )}
      </div>

      {(request.status === "IN_PROGRESS" || request.status === "COMPLETED") && (
        <div className="lk-card mt-4">
          <h2 className="font-heading text-[16px] font-bold text-ink">{t("req.addDeliverable")}</h2>
          <form onSubmit={addDeliverable} className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex flex-1 flex-col gap-1.5">
              <label className="lk-label">{t("req.chooseFile")}</label>
              <input
                ref={fileInputRef}
                type="file"
                required
                accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.zip"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="lk-input file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-canvas file:px-3 file:py-1.5 file:text-[13px] file:font-medium file:text-ink"
              />
              <p className="text-[12px] text-ink-50">{t("req.fileHint")}</p>
            </div>
            <button type="submit" disabled={loading !== null || !file} className="lk-btn-primary w-auto px-5">
              {loading === "attachment" ? t("req.adding") : t("req.addFile")}
            </button>
          </form>
        </div>
      )}

      <AttachmentsList requestId={request.id} attachments={request.attachments} />
      <StatusTimeline events={request.statusEvents} />
    </>
  );
}
