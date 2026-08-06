"use client";

import { useLanguage } from "@/lib/i18n";
import type { RequestStatus } from "@prisma/client";

const styles: Record<RequestStatus, string> = {
  SUBMITTED: "bg-warning-bg text-warning",
  ACCEPTED: "bg-primary-50 text-primary",
  IN_PROGRESS: "bg-primary-50 text-primary",
  COMPLETED: "bg-success-bg text-success",
  CLOSED: "bg-canvas text-ink-50",
  DECLINED: "bg-danger-bg text-danger",
  CANCELLED: "bg-danger-bg text-danger",
};

export function StatusBadge({ status }: { status: RequestStatus }) {
  const { t } = useLanguage();
  return (
    <span className={`shrink-0 rounded-full px-3 py-1 text-[12.5px] font-medium ${styles[status]}`}>
      {t(`status.${status}`)}
    </span>
  );
}
