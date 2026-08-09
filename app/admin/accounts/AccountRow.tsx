"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n";
import type { Account } from "./AccountsList";

export function AccountRow({ account }: { account: Account }) {
  const router = useRouter();
  const { t } = useLanguage();
  const [loading, setLoading] = useState<"suspend" | "unsuspend" | "delete" | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const companyName = account.business?.companyName || account.provider?.companyName || "—";
  const suspended = account.status !== "active";

  async function toggleSuspend() {
    const action = suspended ? "unsuspend" : "suspend";
    setLoading(action);
    setError(null);
    const res = await fetch(`/api/admin/accounts/${account.id}/${action}`, { method: "POST" });
    setLoading(null);
    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(typeof data.error === "string" ? data.error : "Something went wrong");
    }
  }

  async function confirmDelete() {
    if (confirmEmail !== account.email) return;
    setLoading("delete");
    setError(null);
    const res = await fetch(`/api/admin/accounts/${account.id}/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ confirmEmail }),
    });
    setLoading(null);
    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(typeof data.error === "string" ? data.error : "Something went wrong");
    }
  }

  return (
    <div className="border-b border-line px-4 py-3 text-[13.5px] last:border-b-0">
      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 sm:grid-cols-[2fr_1.5fr_1fr_1fr_auto] sm:items-center sm:gap-3">
        <span className="truncate text-ink" title={account.email}>
          {account.email}
        </span>
        <span className="truncate text-ink-70" title={companyName}>
          {companyName}
        </span>
        <span>
          <span
            className={`rounded-full px-2.5 py-0.5 text-[12.5px] font-medium ${
              suspended ? "bg-danger-bg text-danger" : "bg-success-bg text-success"
            }`}
          >
            {suspended ? t("accounts.statusSuspended") : t("accounts.statusActive")}
          </span>
        </span>
        {/* A fixed locale avoids a hydration mismatch — the server's
            locale and the browser's don't always agree on date format. */}
        <span className="text-ink-50">{new Date(account.createdAt).toLocaleDateString("en-GB")}</span>
        <div className="col-span-2 flex gap-2 sm:col-span-1 sm:justify-end">
          <button
            onClick={toggleSuspend}
            disabled={loading !== null}
            className="lk-btn-secondary w-auto px-3 py-1.5 text-[12.5px]"
          >
            {suspended
              ? loading === "unsuspend"
                ? t("accounts.unsuspending")
                : t("accounts.unsuspend")
              : loading === "suspend"
                ? t("accounts.suspending")
                : t("accounts.suspend")}
          </button>
          {!deleting && (
            <button
              onClick={() => setDeleting(true)}
              disabled={loading !== null}
              className="lk-btn-secondary w-auto px-3 py-1.5 text-[12.5px] !border-danger !text-danger"
            >
              {t("accounts.delete")}
            </button>
          )}
        </div>
      </div>

      {error && <p className="mt-2 rounded-lg bg-danger-bg px-3 py-2 text-[13px] text-danger">{error}</p>}

      {deleting && (
        <div className="mt-3 rounded-lg border border-danger bg-danger-bg/40 p-3">
          <p className="text-[13px] text-danger">{t("accounts.deleteWarning")}</p>
          <label className="lk-label mt-2 block">{t("accounts.deleteConfirmLabel")}</label>
          <input
            className="lk-input mt-1"
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            placeholder={account.email}
          />
          <div className="mt-2 flex gap-2">
            <button
              onClick={confirmDelete}
              disabled={loading !== null || confirmEmail !== account.email}
              className="lk-btn-primary w-auto px-4 py-1.5 text-[13px] !bg-danger hover:!opacity-90"
            >
              {loading === "delete" ? t("accounts.deleting") : t("accounts.deleteConfirmButton")}
            </button>
            <button
              onClick={() => {
                setDeleting(false);
                setConfirmEmail("");
                setError(null);
              }}
              className="lk-btn-secondary w-auto px-4 py-1.5 text-[13px]"
            >
              {t("req.cancel")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
