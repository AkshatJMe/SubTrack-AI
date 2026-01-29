import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { defaultSubscriptions } from "../data/defaults";
import { STORAGE_KEYS } from "../storage/keys";
import { getJson, setJson } from "../storage/storage";
import { BillingCycle, Subscription, SubscriptionStatus } from "../types";
import { uid } from "../utils/id";
import { isoDateToday } from "../utils/date";

export type SubscriptionInput = {
  serviceName: string;
  amount: number;
  billingCycle: BillingCycle;
  renewalDate: string; // yyyy-mm-dd
  category: Subscription["category"];
};

type SubscriptionsContextValue = {
  subscriptions: Subscription[];
  isLoaded: boolean;
  addSubscription: (input: SubscriptionInput) => void;
  updateStatus: (id: string, status: SubscriptionStatus) => void;
  removeSubscription: (id: string) => void;
  updateSubscription: (id: string, patch: Partial<SubscriptionInput>) => void;
  refreshFake: () => Promise<void>;
  setAll: (subs: Subscription[]) => void;
};

const SubscriptionsContext = createContext<SubscriptionsContextValue | null>(null);

export function SubscriptionsProvider({ children }: { children: React.ReactNode }) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const stored = await getJson<Subscription[]>(STORAGE_KEYS.subscriptions);
      const initial = stored && Array.isArray(stored) ? stored : defaultSubscriptions;
      if (!stored) await setJson(STORAGE_KEYS.subscriptions, initial);
      if (mounted) {
        setSubscriptions(initial);
        setIsLoaded(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const persist = async (next: Subscription[]) => {
    setSubscriptions(next);
    await setJson(STORAGE_KEYS.subscriptions, next);
  };

  const value = useMemo<SubscriptionsContextValue>(() => {
    return {
      subscriptions,
      isLoaded,
      setAll: (subs) => void persist(subs),
      addSubscription: (input) => {
        const now = new Date().toISOString();
        const sub: Subscription = {
          id: uid("sub"),
          serviceName: input.serviceName.trim(),
          amount: input.amount,
          billingCycle: input.billingCycle,
          renewalDate: input.renewalDate || isoDateToday(),
          category: input.category,
          status: "active",
          createdAt: now,
          updatedAt: now,
        };
        void persist([sub, ...subscriptions]);
      },
      updateStatus: (id, status) => {
        const now = new Date().toISOString();
        const next = subscriptions.map((s) => (s.id === id ? { ...s, status, updatedAt: now } : s));
        void persist(next);
      },
      removeSubscription: (id) => {
        const next = subscriptions.filter((s) => s.id !== id);
        void persist(next);
      },
      updateSubscription: (id, patch) => {
        const now = new Date().toISOString();
        const next = subscriptions.map((s) =>
          s.id === id
            ? {
                ...s,
                ...patch,
                serviceName: patch.serviceName ? patch.serviceName.trim() : s.serviceName,
                updatedAt: now,
              }
            : s
        );
        void persist(next);
      },
      refreshFake: async () => {
        // Fake refresh to mimic production UX
        await new Promise((r) => setTimeout(r, 800));
      },
    };
  }, [subscriptions, isLoaded]);

  return <SubscriptionsContext.Provider value={value}>{children}</SubscriptionsContext.Provider>;
}

export function useSubscriptions() {
  const ctx = useContext(SubscriptionsContext);
  if (!ctx) throw new Error("useSubscriptions must be used within SubscriptionsProvider");
  return ctx;
}

