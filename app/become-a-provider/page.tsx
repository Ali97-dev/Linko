import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { BecomeProviderContent } from "@/components/BecomeProviderContent";
import { getSession } from "@/lib/auth";

// Same pattern as /login and /register: this is a guest-only pitch page.
// An already-logged-in user (Provider, Business, or Admin) has no reason
// to see it — send them to their own dashboard instead.
export default async function BecomeProviderPage() {
  const session = await getSession();
  if (session) {
    const redirectTo =
      session.role === "BUSINESS" ? "/business" : session.role === "PROVIDER" ? "/provider" : "/admin";
    redirect(redirectTo);
  }

  return (
    <>
      <SiteHeader />
      <BecomeProviderContent />
    </>
  );
}
