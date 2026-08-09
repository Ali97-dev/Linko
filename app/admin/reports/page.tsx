import { requireRole } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import type { ProviderVerificationState, RequestStatus } from "@prisma/client";
import { ReportsContent } from "./ReportsContent";

const VERIFICATION_STATES: ProviderVerificationState[] = ["DRAFT", "PENDING", "APPROVED", "REJECTED"];

const REQUEST_STATUSES: RequestStatus[] = [
  "SUBMITTED",
  "ACCEPTED",
  "IN_PROGRESS",
  "COMPLETED",
  "CLOSED",
  "DECLINED",
  "CANCELLED",
];

// Real counts pulled live from the database on every load — nothing here
// is precomputed or cached, so the numbers are always current.
export default async function AdminReportsPage() {
  const session = await requireRole(["ADMIN"]);
  if (!session) redirect("/login");

  const [businessCount, providerCount, providerStateCounts, requestStatusCounts, requestCategories, categories] =
    await Promise.all([
      prisma.business.count(),
      prisma.provider.count(),
      prisma.provider.groupBy({ by: ["verificationState"], _count: { _all: true } }),
      prisma.serviceRequest.groupBy({ by: ["status"], _count: { _all: true } }),
      prisma.serviceRequest.findMany({
        select: { provider: { select: { category: { select: { slug: true } } } } },
      }),
      prisma.category.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }),
    ]);

  const providersByState: Record<string, number> = {};
  for (const s of VERIFICATION_STATES) providersByState[s] = 0;
  for (const row of providerStateCounts) providersByState[row.verificationState] = row._count._all;

  const requestsByStatus: Record<string, number> = {};
  for (const s of REQUEST_STATUSES) requestsByStatus[s] = 0;
  for (const row of requestStatusCounts) requestsByStatus[row.status] = row._count._all;

  const categoryCounts = new Map(categories.map((c) => [c.slug, { name: c.name, slug: c.slug, count: 0 }]));
  let uncategorizedCount = 0;
  for (const r of requestCategories) {
    const slug = r.provider?.category?.slug;
    const bucket = slug ? categoryCounts.get(slug) : undefined;
    if (bucket) {
      bucket.count += 1;
    } else {
      uncategorizedCount += 1;
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <ReportsContent
        businessCount={businessCount}
        providerCount={providerCount}
        totalRequests={requestCategories.length}
        providersByState={providersByState}
        requestsByStatus={requestsByStatus}
        requestsByCategory={Array.from(categoryCounts.values())}
        uncategorizedCount={uncategorizedCount}
      />
    </main>
  );
}
