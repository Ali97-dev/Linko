import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";

// Shared category card — a solid-color icon block standing in for
// photography (the site doesn't use stock photos) plus a name below.
// Used by the homepage category showcase (full size, with description)
// and the provider directory filter (compact, name only), so both stay
// visually related rather than drifting into two unrelated treatments.
export function CategoryCard({
  href,
  icon: Icon,
  label,
  description,
  active,
  actionLabel,
  compact,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  description?: string;
  active?: boolean;
  actionLabel?: string;
  compact?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group flex flex-col overflow-hidden rounded-xl border bg-surface shadow-sm transition-colors ${
        active ? "border-primary" : "border-line hover:border-primary"
      }`}
    >
      <div
        className={`flex items-center justify-center ${compact ? "h-14" : "h-24 sm:h-28"} ${
          active ? "bg-primary" : "bg-primary-50"
        }`}
      >
        <Icon size={compact ? 22 : 36} className={active ? "text-white" : "text-primary"} />
      </div>
      <div className={compact ? "px-3 py-2.5" : "p-4"}>
        <h3 className={`font-heading font-bold text-ink ${compact ? "text-[13px]" : "text-[15px]"}`}>{label}</h3>
        {description && <p className="mt-1 text-[13px] text-ink-70">{description}</p>}
        {actionLabel && (
          <span className="mt-3 flex items-center gap-1.5 text-[13px] font-medium text-primary">
            {actionLabel}
            <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
          </span>
        )}
      </div>
    </Link>
  );
}
