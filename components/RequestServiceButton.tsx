"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n";
import { AuthModal } from "./AuthModal";
import { RequestServiceForm } from "./RequestServiceForm";

export function RequestServiceButton({
  providerId,
  isBusiness,
  needsCompanyName,
  needsContactPerson,
}: {
  providerId: string;
  isBusiness: boolean;
  needsCompanyName: boolean;
  needsContactPerson: boolean;
}) {
  const { t } = useLanguage();
  const [showAuth, setShowAuth] = useState(false);
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <button
        onClick={() => (isBusiness ? setShowForm(true) : setShowAuth(true))}
        className="lk-btn-primary mt-6 inline-block w-auto px-8"
      >
        {t("req.requestService")}
      </button>
      {!isBusiness && <p className="mt-2 text-[12.5px] text-ink-50">{t("req.businessOnly")}</p>}

      {showAuth && <AuthModal initialMode="login" onClose={() => setShowAuth(false)} />}
      {showForm && (
        <RequestServiceForm
          providerId={providerId}
          needsCompanyName={needsCompanyName}
          needsContactPerson={needsContactPerson}
          onClose={() => setShowForm(false)}
        />
      )}
    </>
  );
}
