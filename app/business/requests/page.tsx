import { requireRole } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { RequestsList } from "./RequestsList";

export default async function MyRequestsPage() {
  const session = await requireRole(["BUSINESS"]);
  if (!session) redirect("/login");

  const business = await prisma.business.findUnique({ where: { userId: session.userId } });
  if (!business) redirect("/business");

  const requests = await prisma.serviceRequest.findMany({
    where: { businessId: business.id },
    include: { provider: { select: { companyName: true } } },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <RequestsList requests={requests} />
    </main>
  );
}
