"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [role, setRole] = useState<"BUSINESS" | "PROVIDER">("BUSINESS");
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
      setStatus({ type: "ok", message: "Check your email for a verification link." });
    } else {
      const data = await res.json();
      setStatus({ type: "error", message: JSON.stringify(data.error) });
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="lk-card w-full max-w-md">
        <h1 className="font-heading text-[19px] font-bold text-ink">Create an account</h1>
        <p className="mt-1 text-[13.5px] text-ink-50">Choose how you'll use LINKO.</p>

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
            Business
            <span className="mt-0.5 block text-[12.5px] font-normal text-ink-50">Hire providers</span>
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
            Provider
            <span className="mt-0.5 block text-[12.5px] font-normal text-ink-50">Offer services</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="lk-label">Company name</label>
            <input
              required
              className="lk-input"
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="lk-label">Contact person</label>
            <input
              required
              className="lk-input"
              value={form.contactPerson}
              onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="lk-label">Work email</label>
            <input
              type="email"
              required
              className="lk-input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="lk-label">Phone</label>
            <input
              className="lk-input"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="lk-label">Password</label>
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
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-[13.5px] text-ink-50">
          Already have an account? <Link href="/login" className="text-primary hover:text-primary-hover">Log in</Link>
        </p>
      </div>
    </main>
  );
}
