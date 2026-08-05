"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
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
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="lk-card w-full max-w-sm">
        <h1 className="font-heading text-[19px] font-bold text-ink">Log in</h1>
        <p className="mt-1 text-[13.5px] text-ink-50">Welcome back to LINKO.</p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="lk-label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              className="lk-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="lk-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              className="lk-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className="rounded-lg bg-danger-bg px-3 py-2 text-[13.5px] text-danger">{error}</p>
          )}

          <button type="submit" disabled={loading} className="lk-btn-primary mt-2">
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-center text-[13.5px] text-ink-50">
          No account? <Link href="/register" className="text-primary hover:text-primary-hover">Register</Link>
        </p>
      </div>
    </main>
  );
}
