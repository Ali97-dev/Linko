import { requireRole } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";

const stateCopy: Record<string, { label: string; className: string }> = {
  DRAFT: { label: "Profile incomplete", className: "bg-warning-bg text-warning" },
  PENDING: { label: "Pending review", className: "bg-warning-bg text-warning" },
  APPROVED: { label: "Verified", className: "bg-success-bg text-success" },
  REJECTED: { label: "Rejected — needs changes", className: "bg-danger-bg text-danger" },
};

export default async function ProviderDashboard() {
  const session = await requireRole(["PROVIDER"]);
  if (!session) redirect("/login");

  const provider = await prisma.provider.findUnique({ where: { userId: session.userId } });
  const state = provider ? stateCopy[provider.verificationState] : stateCopy.DRAFT;
  const newRequestsCount = provider
    ? await prisma.serviceRequest.count({ where: { providerId: provider.id, status: "SUBMITTED" } })
    : 0;

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-[26px] font-bold text-ink">
          Welcome{provider ? `, ${provider.companyName}` : ""}
        </h1>
        <span className={`rounded-full px-3 py-1 text-[12.5px] font-medium ${state.className}`}>
          {state.label}
        </span>
      </div>

      {provider?.verificationState !== "APPROVED" && (
        <div className="lk-card mt-6">
          <h2 className="font-heading text-[16px] font-bold text-ink">
            {provider?.verificationState === "REJECTED"
              ? "Update and resubmit your profile"
              : "Complete your profile to get verified"}
          </h2>
          <p className="mt-1 text-[13.5px] text-ink-50">
            You won't appear in the public directory until an Admin approves your profile.
          </p>
          {provider?.verificationState === "REJECTED" && provider.verificationNote && (
            <p className="mt-3 rounded-lg bg-danger-bg px-3 py-2 text-[13.5px] text-danger">
              Reason: {provider.verificationNote}
            </p>
          )}
          <Link href="/provider/profile" className="lk-btn-primary mt-4 inline-block w-auto px-6">
            {provider?.verificationState === "DRAFT" ? "Complete profile" : "Edit profile"}
          </Link>
        </div>
      )}

      <Link href="/provider/requests" className="lk-card mt-6 block hover:border-primary">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-[16px] font-bold text-ink">Request inbox</h2>
            <p className="mt-1 text-[13.5px] text-ink-50">Incoming service requests from businesses.</p>
          </div>
          {newRequestsCount > 0 && (
            <span className="rounded-full bg-warning-bg px-3 py-1 text-[12.5px] font-medium text-warning">
              {newRequestsCount} new
            </span>
          )}
        </div>
      </Link>
    </main>
  );
}
