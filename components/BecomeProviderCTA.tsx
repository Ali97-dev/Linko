"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n";
import { AuthModal } from "./AuthModal";

export function BecomeProviderCTA() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} className="lk-btn-primary w-auto px-8">
        {t("auth.createAccount")}
      </button>
      {open && <AuthModal initialMode="signup" initialRole="PROVIDER" onClose={() => setOpen(false)} />}
    </>
  );
}
