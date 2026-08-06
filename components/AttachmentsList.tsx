"use client";

import { useLanguage } from "@/lib/i18n";

type AttachmentRow = { id: string; fileName: string; fileUrl: string };

export function AttachmentsList({ attachments }: { attachments: AttachmentRow[] }) {
  const { t } = useLanguage();
  return (
    <div className="lk-card mt-4">
      <h2 className="font-heading text-[16px] font-bold text-ink">{t("req.attachments")}</h2>
      {attachments.length === 0 ? (
        <p className="mt-2 text-[13.5px] text-ink-50">{t("req.noAttachments")}</p>
      ) : (
        <ul className="mt-3 flex flex-col gap-2">
          {attachments.map((a) => (
            <li
              key={a.id}
              className="flex items-center justify-between rounded-lg border border-line px-3.5 py-2.5 text-[13.5px]"
            >
              <span className="text-ink-70">{a.fileName}</span>
              <a href={a.fileUrl} target="_blank" rel="noreferrer" className="text-primary hover:text-primary-hover">
                {t("req.download")}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
