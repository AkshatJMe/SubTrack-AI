import { AppNotification, Preferences, Subscription } from "../types";
import { uid } from "../utils/id";
import { isoDateToday } from "../utils/date";

export const defaultPreferences: Preferences = {
  currency: "USD",
  overspendingThreshold: 60,
  renewalReminders: true,
  overspendingAlerts: true,
  compactCards: false,
};

const today = isoDateToday();
function addDaysIso(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export const defaultSubscriptions: Subscription[] = [
  {
    id: uid("sub"),
    serviceName: "Netflix",
    amount: 15.49,
    billingCycle: "monthly",
    renewalDate: addDaysIso(3),
    category: "Streaming",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uid("sub"),
    serviceName: "Spotify",
    amount: 10.99,
    billingCycle: "monthly",
    renewalDate: addDaysIso(10),
    category: "Music",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uid("sub"),
    serviceName: "Notion",
    amount: 96,
    billingCycle: "yearly",
    renewalDate: addDaysIso(22),
    category: "Productivity",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uid("sub"),
    serviceName: "Xbox Game Pass",
    amount: 16.99,
    billingCycle: "monthly",
    renewalDate: addDaysIso(1),
    category: "Gaming",
    status: "paused",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const defaultNotifications: AppNotification[] = [
  {
    id: uid("n"),
    type: "renewal_reminder",
    title: "Renewal coming up",
    body: `Netflix renews soon. Review it if you’re not using it.`,
    createdAt: new Date().toISOString(),
    read: false,
  },
  {
    id: uid("n"),
    type: "overspending_alert",
    title: "Spending check",
    body: `Your monthly subscriptions may be trending up. Consider pausing unused services.`,
    createdAt: new Date().toISOString(),
    read: true,
  },
];

