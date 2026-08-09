import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { DashboardHeader } from "@/components/DashboardHeader";

export default async function BusinessLayout({ children }: { children: React.ReactNode }) {
  const session = await requireRole(["BUSINESS"]);
  if (!session) redirect("/login");

  return (
    <>
      <DashboardHeader role="BUSINESS" email={session.email} />
      {children}
    </>
  );
}
