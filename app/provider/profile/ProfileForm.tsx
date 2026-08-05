"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Category, Provider } from "@prisma/client";

export function ProfileForm({ provider, categories }: { provider: Provider; categories: Category[] }) {
  const router = useRouter();
  const [form, setForm] = useState({
    companyName: provider.companyName || "",
    tradeLicenceNumber: provider.tradeLicenceNumber || "",
    description: provider.description || "",
    city: provider.city || "",
    address: provider.address || "",
    website: provider.website || "",
    yearEstablished: provider.yearEstablished?.toString() || "",
    teamSize: provider.teamSize || "",
    categoryId: provider.categoryId || "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/provider/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/provider");
      router.refresh();
    } else {
      const data = await res.json();
      setError(JSON.stringify(data.error));
    }
  }

  const field = (key: keyof typeof form) => ({
    className: "lk-input",
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm({ ...form, [key]: e.target.value }),
  });

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="lk-label">Company name</label>
        <input required {...field("companyName")} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="lk-label">Category</label>
        <select
          required
          className="lk-input"
          value={form.categoryId}
          onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
        >
          <option value="" disabled>Select a category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="lk-label">Trade licence number</label>
        <input required {...field("tradeLicenceNumber")} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="lk-label">Description</label>
        <textarea required rows={4} {...field("description")} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="lk-label">City</label>
          <input required {...field("city")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="lk-label">Year established</label>
          <input type="number" {...field("yearEstablished")} />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="lk-label">Address</label>
        <input {...field("address")} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="lk-label">Website</label>
          <input {...field("website")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="lk-label">Team size</label>
          <input {...field("teamSize")} />
        </div>
      </div>

      {error && <p className="rounded-lg bg-danger-bg px-3 py-2 text-[13.5px] text-danger">{error}</p>}

      <button type="submit" disabled={loading} className="lk-btn-primary mt-2">
        {loading ? "Submitting…" : "Submit for verification"}
      </button>
    </form>
  );
}
