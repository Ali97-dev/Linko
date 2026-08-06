"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/lib/i18n";

function RegisterForm() {
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const initialRole = searchParams.get("role") === "provider" ? "PROVIDER" : "BUSINESS";

  const [role, setRole] = useState<"BUSINESS" | "PROVIDER">(initialRole);
  const [form, setForm] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    password: "",
  });
  const [status, setStatus] = useState<{ type: "ok" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, ...form }),
    });

    setLoading(false);

    if (res.ok) {
      setStatus({ type: "ok", message: t("auth.checkEmail") });
    } else {
      const data = await res.json();
      setStatus({ type: "error", message: JSON.stringify(data.error) });
    }
  }

  return (
    <div className="grid min-h-[calc(100vh-73px)] md:grid-cols-2">
      <div
        className="relative hidden overflow-hidden md:flex md:flex-col md:items-center md:justify-center md:p-12"
        style={{
          background:
            "linear-gradient(#0e1526, #0e1526), radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)",
          backgroundSize: "auto, 22px 22px",
        }}
      >
        <p className="relative z-10 max-w-sm text-center font-heading text-[28px] font-bold leading-snug text-white">
          {t("auth.registerPanelTitle")}
        </p>
      </div>

      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <h1 className="font-heading text-[22px] font-bold text-ink">{t("auth.registerTitle")}</h1>
          <p className="mt-1 text-[13.5px] text-ink-50">{t("auth.registerSubtitle")}</p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole("BUSINESS")}
              className={`rounded-lg border px-4 py-3 text-left text-[15px] font-medium transition-colors ${
                role === "BUSINESS"
                  ? "border-primary bg-primary-50 text-primary"
                  : "border-line-strong bg-surface text-ink-70 hover:bg-canvas"
              }`}
            >
              {t("auth.roleBusiness")}
              <span className="mt-0.5 block text-[12.5px] font-normal text-ink-50">
                {t("auth.roleBusinessHint")}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setRole("PROVIDER")}
              className={`rounded-lg border px-4 py-3 text-left text-[15px] font-medium transition-colors ${
                role === "PROVIDER"
                  ? "border-primary bg-primary-50 text-primary"
                  : "border-line-strong bg-surface text-ink-70 hover:bg-canvas"
              }`}
            >
              {t("auth.roleProvider")}
              <span className="mt-0.5 block text-[12.5px] font-normal text-ink-50">
                {t("auth.roleProviderHint")}
              </span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="lk-label">{t("auth.companyName")}</label>
              <input
                required
                className="lk-input"
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="lk-label">{t("auth.contactPerson")}</label>
              <input
                required
                className="lk-input"
                value={form.contactPerson}
                onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="lk-label">{t("auth.workEmail")}</label>
              <input
                type="email"
                required
                className="lk-input"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="lk-label">{t("auth.phone")}</label>
              <input
                className="lk-input"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="lk-label">{t("auth.password")}</label>
              <input
                type="password"
                required
                minLength={8}
                className="lk-input"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            {status && (
              <p
                className={`rounded-lg px-3 py-2 text-[13.5px] ${
                  status.type === "ok" ? "bg-success-bg text-success" : "bg-danger-bg text-danger"
                }`}
              >
                {status.message}
              </p>
            )}

            <button type="submit" disabled={loading} className="lk-btn-primary mt-2">
              {loading ? t("auth.creatingAccount") : t("auth.createAccount")}
            </button>
          </form>

          <p className="mt-6 text-center text-[13.5px] text-ink-50">
            {t("auth.haveAccount")}{" "}
            <Link href="/login" className="text-primary hover:text-primary-hover">
              {t("auth.loginButton")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export function RegisterPanel() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}
