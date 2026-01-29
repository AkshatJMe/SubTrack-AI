import type { Subscription } from "../types";

export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  Signup: undefined;
};

export type SubscriptionsStackParamList = {
  SubscriptionList: undefined;
  AddSubscription: undefined;
  SubscriptionDetail: { id: string };
};

export type FaqStackParamList = {
  FaqHome: undefined;
  FaqFlow: { startId?: string } | undefined;
  FaqAnswer: { title: string; body: string; tips?: string[] };
};

export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
};

