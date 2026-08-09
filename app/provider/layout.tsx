import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { DashboardHeader } from "@/components/DashboardHeader";

export default async function ProviderLayout({ children }: { children: React.ReactNode }) {
  const session = await requireRole(["PROVIDER"]);
  if (!session) redirect("/login");

  return (
    <>
      <DashboardHeader role="PROVIDER" email={session.email} />
      {children}
    </>
  );
}
