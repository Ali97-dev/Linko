import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { DashboardHeader } from "@/components/DashboardHeader";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireRole(["ADMIN"]);
  if (!session) redirect("/login");

  return (
    <>
      <DashboardHeader role="ADMIN" email={session.email} />
      {children}
    </>
  );
}
