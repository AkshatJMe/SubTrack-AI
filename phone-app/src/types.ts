export type User = {
  id: string;
  email: string;
  password: string; // fake auth only (demo)
  createdAt: string;
};

export type SubscriptionStatus = "active" | "paused" | "cancelled";
export type BillingCycle = "monthly" | "yearly" | "weekly";

export type Subscription = {
  id: string;
  serviceName: string;
  amount: number; // in user's currency units
  billingCycle: BillingCycle;
  renewalDate: string; // ISO string date (yyyy-mm-dd)
  category:
    | "Streaming"
    | "Music"
    | "Productivity"
    | "Gaming"
    | "Utilities"
    | "Other";
  status: SubscriptionStatus;
  createdAt: string;
  updatedAt: string;
};

export type AppNotificationType = "renewal_reminder" | "overspending_alert";

export type AppNotification = {
  id: string;
  type: AppNotificationType;
  title: string;
  body: string;
  createdAt: string; // ISO
  read: boolean;
};

export type Preferences = {
  currency: "USD" | "EUR" | "GBP" | "INR";
  overspendingThreshold: number; // monthly threshold
  renewalReminders: boolean;
  overspendingAlerts: boolean;
  compactCards: boolean;
};

export type FaqNode =
  | {
      id: string;
      type: "question";
      prompt: string;
      options: Array<{ label: string; nextId: string }>;
    }
  | {
      id: string;
      type: "answer";
      title: string;
      body: string;
      tips?: string[];
    };

export type FaqTree = {
  rootId: string;
  nodes: Record<string, FaqNode>;
};

