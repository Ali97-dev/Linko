import { requireRole } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function BusinessDashboard() {
  const session = await requireRole(["BUSINESS"]);
  if (!session) redirect("/login");

  const business = await prisma.business.findUnique({ where: { userId: session.userId } });
  const openCount = business
    ? await prisma.serviceRequest.count({
        where: { businessId: business.id, status: { notIn: ["CLOSED", "DECLINED", "CANCELLED"] } },
      })
    : 0;

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="font-heading text-[26px] font-bold text-ink">
        Welcome{business ? `, ${business.companyName}` : ""}
      </h1>
      <p className="mt-2 text-[15px] text-ink-70">
        Browse the <Link href="/providers" className="text-primary hover:text-primary-hover">provider directory</Link> to
        request a service.
      </p>

      <Link href="/business/requests" className="lk-card mt-6 block hover:border-primary">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-[16px] font-bold text-ink">My requests</h2>
            <p className="mt-1 text-[13.5px] text-ink-50">Track the service requests you've submitted.</p>
          </div>
          {openCount > 0 && (
            <span className="rounded-full bg-primary-50 px-3 py-1 text-[12.5px] font-medium text-primary">
              {openCount} open
            </span>
          )}
        </div>
      </Link>
    </main>
  );
}
