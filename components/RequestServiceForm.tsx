"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export function RequestServiceForm({
  providerId,
  needsCompanyName,
  needsContactPerson,
  onClose,
}: {
  providerId: string;
  needsCompanyName: boolean;
  needsContactPerson: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const { t } = useLanguage();
  const [form, setForm] = useState({
    title: "",
    description: "",
    budget: "",
    requiredByDate: "",
    companyName: "",
    contactPerson: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/service-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        providerId,
        title: form.title,
        description: form.description,
        budget: form.budget ? Number(form.budget) : undefined,
        requiredByDate: form.requiredByDate || undefined,
        companyName: needsCompanyName ? form.companyName : undefined,
        contactPerson: needsContactPerson ? form.contactPerson : undefined,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      router.push(`/business/requests/${data.id}`);
    } else {
      setError(typeof data.error === "string" ? data.error : JSON.stringify(data.error));
    }
  }

  const field = (key: keyof typeof form) => ({
    className: "lk-input",
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm({ ...form, [key]: e.target.value }),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={onClose}>
      <div
        className="relative w-full max-w-lg rounded-xl bg-surface p-8 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute end-5 top-5 text-ink-50 hover:text-ink">
          <X size={20} />
        </button>

        <h1 className="font-heading text-[20px] font-bold text-ink">{t("req.formTitle")}</h1>
        <p className="mt-1 text-[13.5px] text-ink-50">{t("req.formSubtitle")}</p>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="lk-label">{t("req.title")}</label>
            <input required placeholder={t("req.titlePlaceholder")} {...field("title")} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="lk-label">{t("req.description")}</label>
            <textarea required rows={4} className="lk-input" value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="lk-label">{t("req.budget")}</label>
              <input type="number" min="0" step="0.01" {...field("budget")} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="lk-label">{t("req.requiredBy")}</label>
              <input type="date" {...field("requiredByDate")} />
            </div>
          </div>

          {(needsCompanyName || needsContactPerson) && (
            <div className="flex flex-col gap-4 rounded-lg border border-line bg-canvas p-4">
              <div>
                <p className="text-[13.5px] font-medium text-ink">{t("req.yourDetails")}</p>
                <p className="mt-0.5 text-[12.5px] text-ink-50">{t("req.yourDetailsHint")}</p>
              </div>
              {needsCompanyName && (
                <div className="flex flex-col gap-1.5">
                  <label className="lk-label">{t("auth.companyName")}</label>
                  <input required {...field("companyName")} />
                </div>
              )}
              {needsContactPerson && (
                <div className="flex flex-col gap-1.5">
                  <label className="lk-label">{t("auth.contactPerson")}</label>
                  <input required {...field("contactPerson")} />
                </div>
              )}
            </div>
          )}

          {error && <p className="rounded-lg bg-danger-bg px-3 py-2 text-[13px] text-danger">{error}</p>}

          <button type="submit" disabled={loading} className="lk-btn-primary mt-1">
            {loading ? t("req.submitting") : t("req.submit")}
          </button>
        </form>
      </div>
    </div>
  );
}
