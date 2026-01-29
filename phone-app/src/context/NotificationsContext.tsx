import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { defaultNotifications } from "../data/defaults";
import { STORAGE_KEYS } from "../storage/keys";
import { getJson, setJson } from "../storage/storage";
import { AppNotification, Preferences, Subscription } from "../types";
import { uid } from "../utils/id";
import { daysUntil } from "../utils/date";
import { totalMonthlySpend } from "../utils/subscriptions";

type NotificationsContextValue = {
  notifications: AppNotification[];
  isLoaded: boolean;
  addNotification: (n: Omit<AppNotification, "id" | "createdAt">) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  clearAllNotifications: () => void;
  generateFromState: (subs: Subscription[], prefs: Preferences) => void;
};

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

function makeRenewalNotifications(subs: Subscription[]): AppNotification[] {
  const upcoming = subs
    .filter((s) => s.status === "active")
    .map((s) => ({ s, d: daysUntil(s.renewalDate) }))
    .filter((x) => x.d >= 0 && x.d <= 7)
    .sort((a, b) => a.d - b.d)
    .slice(0, 3);

  return upcoming.map(({ s, d }) => ({
    id: uid("n"),
    type: "renewal_reminder",
    title: d === 0 ? "Renews today" : `Renews in ${d} day${d === 1 ? "" : "s"}`,
    body: `${s.serviceName} renews soon. Review if you still need it.`,
    createdAt: new Date().toISOString(),
    read: false,
  }));
}

function makeOverspendingNotification(subs: Subscription[], prefs: Preferences): AppNotification[] {
  const monthly = totalMonthlySpend(subs);
  if (monthly <= prefs.overspendingThreshold) return [];
  const pct = Math.round((monthly / prefs.overspendingThreshold) * 100);
  return [
    {
      id: uid("n"),
      type: "overspending_alert",
      title: "Overspending alert",
      body: `Your monthly spend is around ${pct}% of your limit. Consider pausing unused subscriptions.`,
      createdAt: new Date().toISOString(),
      read: false,
    },
  ];
}

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const stored = await getJson<AppNotification[]>(STORAGE_KEYS.notifications);
      const initial = stored && Array.isArray(stored) ? stored : defaultNotifications;
      if (!stored) await setJson(STORAGE_KEYS.notifications, initial);
      if (mounted) {
        setNotifications(initial);
        setIsLoaded(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const persist = async (next: AppNotification[]) => {
    setNotifications(next);
    await setJson(STORAGE_KEYS.notifications, next);
  };

  const value = useMemo<NotificationsContextValue>(() => {
    return {
      notifications,
      isLoaded,
      addNotification: (n) => {
        const full: AppNotification = { ...n, id: uid("n"), createdAt: new Date().toISOString() };
        void persist([full, ...notifications]);
      },
      markRead: (id) => {
        const next = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
        void persist(next);
      },
      markAllRead: () => {
        const next = notifications.map((n) => ({ ...n, read: true }));
        void persist(next);
      },
      clearAllNotifications: () => void persist([]),
      generateFromState: (subs, prefs) => {
        const next: AppNotification[] = [];
        if (prefs.renewalReminders) next.push(...makeRenewalNotifications(subs));
        if (prefs.overspendingAlerts) next.push(...makeOverspendingNotification(subs, prefs));

        if (next.length === 0) return;

        // Deduplicate by type+title+body (simple)
        const existingKeys = new Set(notifications.map((n) => `${n.type}|${n.title}|${n.body}`));
        const toAdd = next.filter((n) => !existingKeys.has(`${n.type}|${n.title}|${n.body}`));
        if (toAdd.length > 0) void persist([...toAdd, ...notifications]);
      },
    };
  }, [notifications, isLoaded]);

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationsProvider");
  return ctx;
}

