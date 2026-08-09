import type { RequestStatus } from "@prisma/client";
import { prisma } from "@/lib/db";

// Every allowed status transition, keyed by the actor who's allowed to make it.
// Enforced server-side in each API route — this is the single source of truth
// for "no skipping states, no re-opening a closed request".
export const TRANSITIONS: Record<"BUSINESS" | "PROVIDER" | "ADMIN", Partial<Record<RequestStatus, RequestStatus[]>>> = {
  PROVIDER: {
    SUBMITTED: ["ACCEPTED", "DECLINED"],
    ACCEPTED: ["IN_PROGRESS"],
    IN_PROGRESS: ["COMPLETED"],
  },
  BUSINESS: {
    SUBMITTED: ["CANCELLED"],
    ACCEPTED: ["CANCELLED"],
    COMPLETED: ["CLOSED"],
  },
  ADMIN: {
    SUBMITTED: ["CLOSED"],
    ACCEPTED: ["CLOSED"],
    IN_PROGRESS: ["CLOSED"],
    COMPLETED: ["CLOSED"],
  },
};

// CLOSED, DECLINED, CANCELLED have no entries above in any actor's map — they're terminal.
export function isTerminal(status: RequestStatus) {
  return status === "CLOSED" || status === "DECLINED" || status === "CANCELLED";
}

export function canTransition(actor: "BUSINESS" | "PROVIDER" | "ADMIN", from: RequestStatus, to: RequestStatus) {
  return TRANSITIONS[actor][from]?.includes(to) ?? false;
}

// A ServiceRequest's business/provider relation goes null once that
// account is deleted (see the DELETE route under /api/admin/accounts) —
// the *NameSnapshot field preserves what to display instead of losing the
// name entirely. Returns null (not a fallback string) when both are
// missing, so callers can apply their own translated fallback text.
export function partyDisplayName(
  party: { companyName: string | null } | null | undefined,
  snapshot: string | null | undefined
): string | null {
  return party?.companyName || snapshot || null;
}

export function formatActor(role: "BUSINESS" | "PROVIDER" | "ADMIN", name?: string | null) {
  if (role === "ADMIN") return "Admin";
  const label = role === "BUSINESS" ? "Business" : "Provider";
  return name ? `${label} — ${name}` : label;
}

// Generates a unique human-readable reference like REQ-2026-0001, scoped per
// calendar year. Retries a few times on the rare unique-constraint race.
export async function generateReference(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `REQ-${year}-`;

  for (let attempt = 0; attempt < 5; attempt++) {
    const count = await prisma.serviceRequest.count({
      where: { reference: { startsWith: prefix } },
    });
    const candidate = `${prefix}${String(count + 1 + attempt).padStart(4, "0")}`;
    const exists = await prisma.serviceRequest.findUnique({ where: { reference: candidate } });
    if (!exists) return candidate;
  }

  // Extremely unlikely fallback if 5 concurrent creations collided.
  return `${prefix}${Date.now().toString().slice(-6)}`;
}
