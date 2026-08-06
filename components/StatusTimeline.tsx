"use client";

import { useLanguage } from "@/lib/i18n";
import type { RequestStatus } from "@prisma/client";

type StatusEventRow = {
  id: string;
  fromStatus: RequestStatus | null;
  toStatus: RequestStatus;
  actor: string;
  note: string | null;
  createdAt: Date;
};

export function StatusTimeline({ events }: { events: StatusEventRow[] }) {
  const { t } = useLanguage();
  return (
    <div className="lk-card mt-4">
      <h2 className="font-heading text-[16px] font-bold text-ink">{t("req.timeline")}</h2>
      <ol className="mt-4 flex flex-col gap-4">
        {events.map((ev) => (
          <li key={ev.id} className="border-s-2 border-line ps-4">
            <p className="text-[13.5px] font-medium text-ink">
              {ev.fromStatus ? `${t(`status.${ev.fromStatus}`)} -> ` : ""}
              {t(`status.${ev.toStatus}`)}
            </p>
            <p className="mt-0.5 text-[12.5px] text-ink-50">
              {ev.actor} · {new Date(ev.createdAt).toLocaleString()}
            </p>
            {ev.note && <p className="mt-1 text-[13px] text-ink-70">{ev.note}</p>}
          </li>
        ))}
      </ol>
    </div>
  );
}
