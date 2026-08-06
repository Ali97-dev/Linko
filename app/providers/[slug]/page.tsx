import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { RequestServiceButton } from "@/components/RequestServiceButton";
import { getSession } from "@/lib/auth";

export default async function ProviderProfile({ params }: { params: { slug: string } }) {
  const provider = await prisma.provider.findUnique({
    where: { slug: params.slug },
    include: { category: true },
  });

  if (!provider || provider.verificationState !== "APPROVED") {
    notFound();
  }

  const session = await getSession();
  let isBusiness = false;
  let needsCompanyName = false;
  let needsContactPerson = false;
  if (session?.role === "BUSINESS") {
    const business = await prisma.business.findUnique({ where: { userId: session.userId } });
    isBusiness = !!business;
    needsCompanyName = !business?.companyName;
    needsContactPerson = !business?.contactPerson;
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-6 py-10">
      <Link href="/providers" className="text-[13.5px] text-ink-50 hover:text-ink-70">
        &lt;- Back to directory
      </Link>

      <div className="lk-card mt-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-heading text-[26px] font-bold text-ink">{provider.companyName}</h1>
            <p className="mt-1 text-[13.5px] text-ink-50">
              {provider.category?.name} - {provider.city}
              {provider.yearEstablished ? ` - Est. ${provider.yearEstablished}` : ""}
            </p>
          </div>
          <span className="rounded-full bg-success-bg px-3 py-1 text-[12.5px] font-medium text-success">
            Verified
          </span>
        </div>

        <p className="mt-5 text-[15px] leading-[1.8] text-ink-70">{provider.description}</p>

        <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-5 text-[13.5px]">
          {provider.teamSize && (
            <div>
              <dt className="text-ink-50">Team size</dt>
              <dd className="mt-0.5 text-ink-70">{provider.teamSize}</dd>
            </div>
          )}
          {provider.website && (
            <div>
              <dt className="text-ink-50">Website</dt>
              <dd className="mt-0.5 text-primary">{provider.website}</dd>
            </div>
          )}
        </dl>

        <RequestServiceButton
          providerId={provider.id}
          isBusiness={isBusiness}
          needsCompanyName={needsCompanyName}
          needsContactPerson={needsContactPerson}
        />
      </div>
      </main>
    </>
  );
}
