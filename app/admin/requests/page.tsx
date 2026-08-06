import { requireRole } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import type { Prisma, RequestStatus } from "@prisma/client";
import { RequestsFilterList } from "./RequestsFilterList";

const VALID_STATUSES: RequestStatus[] = [
  "SUBMITTED",
  "ACCEPTED",
  "IN_PROGRESS",
  "COMPLETED",
  "CLOSED",
  "DECLINED",
  "CANCELLED",
];

export default async function AdminRequestsPage({
  searchParams,
}: {
  searchParams: { status?: string; category?: string; business?: string; provider?: string };
}) {
  const session = await requireRole(["ADMIN"]);
  if (!session) redirect("/login");

  const { status, category, business, provider } = searchParams;
  const validStatus = status && VALID_STATUSES.includes(status as RequestStatus) ? (status as RequestStatus) : undefined;

  const where: Prisma.ServiceRequestWhereInput = {
    ...(validStatus ? { status: validStatus } : {}),
    ...(category ? { provider: { category: { slug: category } } } : {}),
    ...(business ? { business: { companyName: { contains: business, mode: "insensitive" } } } : {}),
    ...(provider ? { provider: { companyName: { contains: provider, mode: "insensitive" } } } : {}),
  };

  const [requests, categories] = await Promise.all([
    prisma.serviceRequest.findMany({
      where,
      include: {
        business: { select: { companyName: true } },
        provider: { select: { companyName: true, category: { select: { name: true, slug: true } } } },
      },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.category.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <RequestsFilterList
        requests={requests}
        categories={categories}
        filters={{
          status: validStatus || "",
          category: category || "",
          business: business || "",
          provider: provider || "",
        }}
      />
    </main>
  );
}
