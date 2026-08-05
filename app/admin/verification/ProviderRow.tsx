"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ProviderWithRelations = {
  id: string;
  companyName: string;
  tradeLicenceNumber: string | null;
  description: string | null;
  city: string | null;
  user: { email: string };
  category: { name: string } | null;
};

export function ProviderRow({ provider }: { provider: ProviderWithRelations }) {
  const router = useRouter();
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");

  async function approve() {
    setLoading("approve");
    await fetch(`/api/admin/providers/${provider.id}/approve`, { method: "POST" });
    router.refresh();
  }

  async function reject() {
    if (!reason.trim()) return;
    setLoading("reject");
    await fetch(`/api/admin/providers/${provider.id}/reject`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });
    router.refresh();
  }

  return (
    <div className="lk-card">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-heading text-[16px] font-bold text-ink">{provider.companyName}</h2>
          <p className="text-[13.5px] text-ink-50">
            {provider.user.email} · {provider.category?.name || "No category"} · {provider.city || "No city"}
          </p>
        </div>
        <span className="rounded-full bg-warning-bg px-3 py-1 text-[12.5px] font-medium text-warning">Pending</span>
      </div>

      <p className="mt-3 text-[15px] text-ink-70">{provider.description}</p>
      <p className="mt-2 text-[13.5px] text-ink-50">
        Trade licence: {provider.tradeLicenceNumber || "Not provided"}
      </p>

      {!rejecting ? (
        <div className="mt-4 flex gap-3">
          <button onClick={approve} disabled={loading !== null} className="lk-btn-primary w-auto px-5">
            {loading === "approve" ? "Approving…" : "Approve"}
          </button>
          <button
            onClick={() => setRejecting(true)}
            disabled={loading !== null}
            className="lk-btn-secondary w-auto px-5 !text-danger !border-danger"
          >
            Reject
          </button>
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-2">
          <label className="lk-label">Reason for rejection (shown to the provider)</label>
          <input className="lk-input" value={reason} onChange={(e) => setReason(e.target.value)} />
          <div className="mt-1 flex gap-3">
            <button onClick={reject} disabled={loading !== null || !reason.trim()} className="lk-btn-primary w-auto px-5">
              {loading === "reject" ? "Rejecting…" : "Confirm reject"}
            </button>
            <button onClick={() => setRejecting(false)} className="lk-btn-secondary w-auto px-5">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
