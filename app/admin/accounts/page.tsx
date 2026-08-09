import { requireRole } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import type { Prisma, Role } from "@prisma/client";
import { AccountsList } from "./AccountsList";

export default async function AdminAccountsPage({
  searchParams,
}: {
  searchParams: { tab?: string; q?: string };
}) {
  const session = await requireRole(["ADMIN"]);
  if (!session) redirect("/login");

  const tab: Role = searchParams.tab === "provider" ? "PROVIDER" : "BUSINESS";
  const q = searchParams.q?.trim();

  const where: Prisma.UserWhereInput = {
    role: tab,
    ...(q
      ? {
          OR: [
            { email: { contains: q, mode: "insensitive" } },
            tab === "BUSINESS"
              ? { business: { companyName: { contains: q, mode: "insensitive" } } }
              : { provider: { companyName: { contains: q, mode: "insensitive" } } },
          ],
        }
      : {}),
  };

  const accounts = await prisma.user.findMany({
    where,
    include: { business: true, provider: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <AccountsList
        accounts={accounts}
        tab={tab === "PROVIDER" ? "provider" : "business"}
        q={q || ""}
      />
    </main>
  );
}
