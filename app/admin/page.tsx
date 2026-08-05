import { requireRole } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function AdminDashboard() {
  const session = await requireRole(["ADMIN"]);
  if (!session) redirect("/login");

  const pendingCount = await prisma.provider.count({ where: { verificationState: "PENDING" } });

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="font-heading text-[26px] font-bold text-ink">Admin panel</h1>

      <Link href="/admin/verification" className="lk-card mt-6 block hover:border-primary">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-[16px] font-bold text-ink">Verification queue</h2>
            <p className="mt-1 text-[13.5px] text-ink-50">Review providers awaiting approval.</p>
          </div>
          {pendingCount > 0 && (
            <span className="rounded-full bg-warning-bg px-3 py-1 text-[12.5px] font-medium text-warning">
              {pendingCount} pending
            </span>
          )}
        </div>
      </Link>
    </main>
  );
}
