"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";

export function LoginPanel() {
  const router = useRouter();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      router.push(data.redirectTo);
    } else {
      setError(data.error);
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
          {t("auth.loginPanelTitle")}
        </p>
      </div>

      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <h1 className="font-heading text-[22px] font-bold text-ink">{t("auth.loginTitle")}</h1>
          <p className="mt-1 text-[13.5px] text-ink-50">{t("auth.loginSubtitle")}</p>

          <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="lk-label">{t("auth.email")}</label>
              <input
                type="email"
                required
                className="lk-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="lk-label">{t("auth.password")}</label>
              <input
                type="password"
                required
                className="lk-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <p className="rounded-lg bg-danger-bg px-3 py-2 text-[13.5px] text-danger">{error}</p>}

            <button type="submit" disabled={loading} className="lk-btn-primary mt-2">
              {loading ? t("auth.loggingIn") : t("auth.loginButton")}
            </button>
          </form>

          <p className="mt-6 text-center text-[13.5px] text-ink-50">
            {t("auth.noAccount")}{" "}
            <Link href="/register" className="text-primary hover:text-primary-hover">
              {t("auth.registerLink")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
