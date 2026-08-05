import { requireRole } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { ProfileForm } from "./ProfileForm";

export default async function ProviderProfilePage() {
  const session = await requireRole(["PROVIDER"]);
  if (!session) redirect("/login");

  const [provider, categories] = await Promise.all([
    prisma.provider.findUnique({ where: { userId: session.userId } }),
    prisma.category.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }),
  ]);

  if (!provider) redirect("/provider");

  return (
    <main className="mx-auto max-w-xl px-6 py-10">
      <h1 className="font-heading text-[19px] font-bold text-ink">Complete your profile</h1>
      <p className="mt-1 text-[13.5px] text-ink-50">
        This is what an Admin reviews before your profile goes live in the directory.
      </p>
      <div className="lk-card mt-6">
        <ProfileForm provider={provider} categories={categories} />
      </div>
    </main>
  );
}
