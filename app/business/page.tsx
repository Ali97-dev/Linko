import { requireRole } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

export default async function BusinessDashboard() {
  const session = await requireRole(["BUSINESS"]);
  if (!session) redirect("/login");

  const business = await prisma.business.findUnique({ where: { userId: session.userId } });

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="font-heading text-[26px] font-bold text-ink">
        Welcome{business ? `, ${business.companyName}` : ""}
      </h1>
      <p className="mt-2 text-[15px] text-ink-70">
        Provider discovery and request tracking will go here next.
      </p>
    </main>
  );
}
