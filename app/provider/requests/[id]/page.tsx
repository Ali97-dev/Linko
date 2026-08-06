import { requireRole } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { RequestDetail } from "./RequestDetail";

export default async function ProviderRequestDetail({ params }: { params: { id: string } }) {
  const session = await requireRole(["PROVIDER"]);
  if (!session) redirect("/login");

  const provider = await prisma.provider.findUnique({ where: { userId: session.userId } });
  if (!provider) redirect("/provider");

  const request = await prisma.serviceRequest.findUnique({
    where: { id: params.id },
    include: {
      business: { select: { companyName: true } },
      statusEvents: { orderBy: { createdAt: "asc" } },
      attachments: { orderBy: { createdAt: "asc" } },
    },
  });

  // A provider can only see requests sent to them — enforced here, not just hidden in the UI.
  if (!request || request.providerId !== provider.id) notFound();

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <RequestDetail request={request} />
    </main>
  );
}
