import { requireRole } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { RequestDetail } from "./RequestDetail";

export default async function AdminRequestDetail({ params }: { params: { id: string } }) {
  const session = await requireRole(["ADMIN"]);
  if (!session) redirect("/login");

  const request = await prisma.serviceRequest.findUnique({
    where: { id: params.id },
    include: {
      business: { select: { companyName: true } },
      provider: { select: { companyName: true, category: { select: { name: true } } } },
      statusEvents: { orderBy: { createdAt: "asc" } },
      attachments: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!request) notFound();

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <RequestDetail request={request} />
    </main>
  );
}
