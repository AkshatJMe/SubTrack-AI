export function isoDateToday(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function parseIsoDate(dateStr: string): Date {
  // Expect yyyy-mm-dd; fallback to Date parsing
  const [y, m, d] = dateStr.split("-").map((x) => Number(x));
  if (!y || !m || !d) return new Date(dateStr);
  return new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
}

export function daysUntil(dateStr: string): number {
  const now = new Date();
  const target = parseIsoDate(dateStr);
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function formatMoney(amount: number, currency: string): string {
  const safe = Number.isFinite(amount) ? amount : 0;
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: safe % 1 === 0 ? 0 : 2,
    }).format(safe);
  } catch {
    return `${currency} ${safe.toFixed(2)}`;
  }
}

export function formatShortDate(dateStr: string): string {
  const d = parseIsoDate(dateStr);
  try {
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).format(d);
  } catch {
    return dateStr;
  }
}

