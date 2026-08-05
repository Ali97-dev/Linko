import { requireRole } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { ProviderRow } from "./ProviderRow";

export default async function VerificationQueue() {
  const session = await requireRole(["ADMIN"]);
  if (!session) redirect("/login");

  const providers = await prisma.provider.findMany({
    where: { verificationState: "PENDING" },
    include: { user: { select: { email: true } }, category: { select: { name: true } } },
    orderBy: { updatedAt: "asc" },
  });

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="font-heading text-[19px] font-bold text-ink">Verification queue</h1>
      <p className="mt-1 text-[13.5px] text-ink-50">
        {providers.length} provider{providers.length === 1 ? "" : "s"} awaiting review.
      </p>

      <div className="mt-6 flex flex-col gap-4">
        {providers.length === 0 && (
          <p className="lk-card text-center text-[13.5px] text-ink-50">Nothing to review right now.</p>
        )}
        {providers.map((provider) => (
          <ProviderRow key={provider.id} provider={provider} />
        ))}
      </div>
    </main>
  );
}
