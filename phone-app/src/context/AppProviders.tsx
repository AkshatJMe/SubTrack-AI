import React, { useEffect } from "react";
import { AuthProvider, useAuth } from "./AuthContext";
import { PreferencesProvider, usePreferences } from "./PreferencesContext";
import { SubscriptionsProvider, useSubscriptions } from "./SubscriptionsContext";
import { NotificationsProvider, useNotifications } from "./NotificationsContext";

function SmartLocalLogicBridge({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { preferences, isLoaded: prefsLoaded } = usePreferences();
  const { subscriptions, isLoaded: subsLoaded } = useSubscriptions();
  const { generateFromState } = useNotifications();

  useEffect(() => {
    if (!user) return;
    if (!prefsLoaded || !subsLoaded) return;
    generateFromState(subscriptions, preferences);
  }, [user, prefsLoaded, subsLoaded, preferences, subscriptions, generateFromState]);

  return <>{children}</>;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <PreferencesProvider>
        <SubscriptionsProvider>
          <NotificationsProvider>
            <SmartLocalLogicBridge>{children}</SmartLocalLogicBridge>
          </NotificationsProvider>
        </SubscriptionsProvider>
      </PreferencesProvider>
    </AuthProvider>
  );
}

