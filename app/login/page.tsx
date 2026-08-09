import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { LoginPanel } from "@/components/LoginPanel";
import { getSession } from "@/lib/auth";

// An already-logged-in user hitting /login (e.g. via the browser back
// button after signing in) should land on their dashboard, not see the
// login form again.
export default async function LoginPage() {
  const session = await getSession();
  if (session) {
    const redirectTo =
      session.role === "BUSINESS" ? "/business" : session.role === "PROVIDER" ? "/provider" : "/admin";
    redirect(redirectTo);
  }

  return (
    <>
      <SiteHeader />
      <LoginPanel />
    </>
  );
}
