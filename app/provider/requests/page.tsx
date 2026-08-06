import { requireRole } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { InboxList } from "./InboxList";

export default async function ProviderRequestsPage() {
  const session = await requireRole(["PROVIDER"]);
  if (!session) redirect("/login");

  const provider = await prisma.provider.findUnique({ where: { userId: session.userId }, include: { category: true } });
  if (!provider) redirect("/provider");

  const requests = await prisma.serviceRequest.findMany({
    where: { providerId: provider.id },
    include: { business: { select: { companyName: true } } },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <InboxList requests={requests} categoryName={provider.category?.name || null} />
    </main>
  );
}
