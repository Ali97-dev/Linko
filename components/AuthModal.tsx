"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Check } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

type Mode = "login" | "signup";

export function AuthModal({
  initialMode,
  initialRole,
  onClose,
}: {
  initialMode: Mode;
  initialRole?: "BUSINESS" | "PROVIDER";
  onClose: () => void;
}) {
  const router = useRouter();
  const { t } = useLanguage();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [role] = useState<"BUSINESS" | "PROVIDER">(initialRole || "BUSINESS");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [socialNote, setSocialNote] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStatus(null);
    setLoading(true);

    if (mode === "login") {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      setLoading(false);
      if (res.ok) {
        onClose();
        router.push(data.redirectTo);
      } else {
        setError(data.error);
      }
    } else {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, email, password }),
      });
      setLoading(false);
      if (res.ok) {
        setStatus(t("auth.checkEmail"));
      } else {
        const data = await res.json();
        setError(JSON.stringify(data.error));
      }
    }
  }

  const points = [t("auth.modalPoint1"), t("auth.modalPoint2"), t("auth.modalPoint3")];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={onClose}>
      <div
        className="grid w-full max-w-3xl grid-cols-1 overflow-hidden rounded-xl bg-surface shadow-lg md:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="relative hidden overflow-hidden p-9 md:flex md:flex-col md:justify-center"
          style={{
            background:
              "linear-gradient(#0e1526, #0e1526), radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)",
            backgroundSize: "auto, 22px 22px",
          }}
        >
          <div className="relative z-10">
            <h2 className="font-heading text-[26px] font-bold text-white">{t("auth.modalHeadline")}</h2>
            <ul className="mt-5 flex flex-col gap-2.5">
              {points.map((p, i) => (
                <li key={i} className="flex items-start gap-2 text-[14.5px] text-white/90">
                  <Check size={16} className="mt-0.5 shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative p-8">
          <button onClick={onClose} className="absolute end-5 top-5 text-ink-50 hover:text-ink">
            <X size={20} />
          </button>

          <h1 className="font-heading text-[20px] font-bold text-ink">
            {mode === "login" ? t("auth.loginTitle") : t("auth.registerTitle")}
          </h1>
          <p className="mt-1 text-[13.5px] text-ink-50">
            {mode === "login" ? (
              <>
                {t("auth.noAccount")}{" "}
                <button onClick={() => setMode("signup")} className="text-primary underline hover:text-primary-hover">
                  {t("nav.join")}
                </button>
              </>
            ) : (
              <>
                {t("auth.haveAccount")}{" "}
                <button onClick={() => setMode("login")} className="text-primary underline hover:text-primary-hover">
                  {t("auth.loginButton")}
                </button>
              </>
            )}
          </p>

          <div className="mt-6 flex flex-col gap-2.5">
            {["Google", "Apple", "Facebook"].map((provider) => (
              <button
                key={provider}
                type="button"
                onClick={() => setSocialNote(true)}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-line-strong py-2.5 text-[14px] font-medium text-ink-70 hover:bg-canvas"
              >
                {t("auth.continueWith")} {provider}
              </button>
            ))}
          </div>
          {socialNote && (
            <p className="mt-2 text-center text-[12.5px] text-ink-50">
              {t("auth.continueWith")}: {t("auth.comingSoon")}
            </p>
          )}

          {!showEmailForm ? (
            <p className="mt-5 text-center">
              <button
                onClick={() => setShowEmailForm(true)}
                className="text-[13.5px] text-primary underline hover:text-primary-hover"
              >
                {mode === "login" ? t("auth.orLoginEmail") : t("auth.orSignupEmail")}
              </button>
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
              <input
                type="email"
                required
                placeholder={t("auth.email")}
                className="lk-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                required
                minLength={mode === "signup" ? 8 : undefined}
                placeholder={t("auth.password")}
                className="lk-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {error && <p className="rounded-lg bg-danger-bg px-3 py-2 text-[13px] text-danger">{error}</p>}
              {status && <p className="rounded-lg bg-success-bg px-3 py-2 text-[13px] text-success">{status}</p>}

              <button type="submit" disabled={loading} className="lk-btn-primary">
                {loading
                  ? mode === "login"
                    ? t("auth.loggingIn")
                    : t("auth.creatingAccount")
                  : mode === "login"
                    ? t("auth.loginButton")
                    : t("nav.join")}
              </button>
            </form>
          )}

          {mode === "signup" && (
            <p className="mt-6 text-center text-[11.5px] leading-relaxed text-ink-50">{t("auth.termsNote")}</p>
          )}
        </div>
      </div>
    </div>
  );
}
