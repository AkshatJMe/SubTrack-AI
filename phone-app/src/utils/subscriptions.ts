import { Subscription } from "../types";
import { daysUntil, parseIsoDate } from "./date";

export function monthlyCostFor(sub: Subscription): number {
  if (sub.status !== "active") return 0;
  if (sub.billingCycle === "monthly") return sub.amount;
  if (sub.billingCycle === "yearly") return sub.amount / 12;
  if (sub.billingCycle === "weekly") return (sub.amount * 52) / 12;
  return sub.amount;
}

export function totalMonthlySpend(subs: Subscription[]): number {
  return subs.reduce((sum, s) => sum + monthlyCostFor(s), 0);
}

export function activeCount(subs: Subscription[]): number {
  return subs.filter((s) => s.status === "active").length;
}

export function upcomingRenewals(subs: Subscription[], withinDays = 7): Subscription[] {
  const active = subs.filter((s) => s.status === "active");
  return active
    .filter((s) => {
      const d = daysUntil(s.renewalDate);
      return d >= 0 && d <= withinDays;
    })
    .sort((a, b) => parseIsoDate(a.renewalDate).getTime() - parseIsoDate(b.renewalDate).getTime());
}

export function categoryBreakdownMonthly(subs: Subscription[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const s of subs) {
    const v = monthlyCostFor(s);
    if (v <= 0) continue;
    out[s.category] = (out[s.category] ?? 0) + v;
  }
  return out;
}

