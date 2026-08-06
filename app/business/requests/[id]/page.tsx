import { requireRole } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { RequestDetail } from "./RequestDetail";

export default async function BusinessRequestDetail({ params }: { params: { id: string } }) {
  const session = await requireRole(["BUSINESS"]);
  if (!session) redirect("/login");

  const business = await prisma.business.findUnique({ where: { userId: session.userId } });
  if (!business) redirect("/business");

  const request = await prisma.serviceRequest.findUnique({
    where: { id: params.id },
    include: {
      provider: { select: { companyName: true } },
      statusEvents: { orderBy: { createdAt: "asc" } },
      attachments: { orderBy: { createdAt: "asc" } },
    },
  });

  // A business can only see its own requests — enforced here, not just hidden in the UI.
  if (!request || request.businessId !== business.id) notFound();

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <RequestDetail request={request} />
    </main>
  );
}
