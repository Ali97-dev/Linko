import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { RegisterPanel } from "@/components/RegisterPanel";
import { getSession } from "@/lib/auth";

// Same rationale as /login: don't show the register form to someone who's
// already signed in (e.g. after navigating back).
export default async function RegisterPage() {
  const session = await getSession();
  if (session) {
    const redirectTo =
      session.role === "BUSINESS" ? "/business" : session.role === "PROVIDER" ? "/provider" : "/admin";
    redirect(redirectTo);
  }

  return (
    <>
      <SiteHeader />
      <RegisterPanel />
    </>
  );
}
