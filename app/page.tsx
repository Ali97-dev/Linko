import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 text-center">
      <h1 className="font-heading text-[26px] font-bold text-ink">LINKO</h1>
      <p className="mt-3 text-[15px] leading-[1.8] text-ink-70">
        Discover verified providers, submit a request, track it through to delivery.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/register" className="lk-btn-primary w-auto px-6">
          Register
        </Link>
        <Link href="/login" className="lk-btn-secondary w-auto px-6">
          Log in
        </Link>
      </div>
    </main>
  );
}
