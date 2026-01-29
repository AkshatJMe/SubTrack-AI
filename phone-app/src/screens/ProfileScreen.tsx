import React, { useMemo, useState } from "react";
import { Alert, Switch, TextInput, View } from "react-native";
import { Screen } from "../components/Screen";
import { AppText, MutedText } from "../components/AppText";
import { Card } from "../components/Card";
import { PrimaryButton } from "../components/PrimaryButton";
import { colors } from "../theme/colors";
import { useAuth } from "../context/AuthContext";
import { usePreferences } from "../context/PreferencesContext";
import { useSubscriptions } from "../context/SubscriptionsContext";
import { useNotifications } from "../context/NotificationsContext";
import { defaultSubscriptions, defaultNotifications, defaultPreferences } from "../data/defaults";
import { setJson } from "../storage/storage";
import { STORAGE_KEYS } from "../storage/keys";

const currencies = ["USD", "EUR", "GBP", "INR"] as const;

export function ProfileScreen() {
  const { user, logout } = useAuth();
  const { preferences, updatePreferences, resetPreferences } = usePreferences();
  const { setAll } = useSubscriptions();
  const { clearAllNotifications } = useNotifications();

  const [thresholdText, setThresholdText] = useState(String(preferences.overspendingThreshold));

  const threshold = useMemo(() => {
    const n = Number(thresholdText);
    return Number.isFinite(n) ? n : preferences.overspendingThreshold;
  }, [thresholdText, preferences.overspendingThreshold]);

  const applyThreshold = () => {
    updatePreferences({ overspendingThreshold: Math.max(0, Math.round(threshold)) });
    Alert.alert("Saved", "Overspending threshold updated.");
  };

  const clearAppData = async () => {
    Alert.alert(
      "Clear app data?",
      "This resets subscriptions, notifications, and preferences (stored locally). Your account stays signed in.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            // Reset in-memory
            setAll(defaultSubscriptions);
            clearAllNotifications();
            resetPreferences();

            // Reset AsyncStorage
            await setJson(STORAGE_KEYS.subscriptions, defaultSubscriptions);
            await setJson(STORAGE_KEYS.notifications, defaultNotifications);
            await setJson(STORAGE_KEYS.preferences, defaultPreferences);

            Alert.alert("Reset complete", "Local demo data was restored.");
          },
        },
      ]
    );
  };

  return (
    <Screen scroll contentContainerStyle={{ gap: 14 }}>
      <View style={{ gap: 6 }}>
        <AppText style={{ fontSize: 22, fontWeight: "900" }}>Profile</AppText>
        <MutedText>Preferences and local demo controls.</MutedText>
      </View>

      <Card>
        <AppText style={{ fontSize: 16, fontWeight: "900" }}>User</AppText>
        <MutedText style={{ marginTop: 6 }}>Email</MutedText>
        <AppText style={{ fontWeight: "800", marginTop: 2 }}>{user?.email ?? "-"}</AppText>
      </Card>

      <Card>
        <AppText style={{ fontSize: 16, fontWeight: "900" }}>Preferences</AppText>

        <View style={{ marginTop: 12, gap: 14 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <AppText style={{ fontWeight: "800" }}>Renewal reminders</AppText>
              <MutedText>Generate local reminders for renewals within 7 days.</MutedText>
            </View>
            <Switch
              value={preferences.renewalReminders}
              onValueChange={(v) => updatePreferences({ renewalReminders: v })}
            />
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <AppText style={{ fontWeight: "800" }}>Overspending alerts</AppText>
              <MutedText>Warn when monthly cost exceeds your threshold.</MutedText>
            </View>
            <Switch
              value={preferences.overspendingAlerts}
              onValueChange={(v) => updatePreferences({ overspendingAlerts: v })}
            />
          </View>

          <View style={{ gap: 8 }}>
            <AppText style={{ fontWeight: "800" }}>Overspending threshold</AppText>
            <TextInput
              value={thresholdText}
              onChangeText={setThresholdText}
              keyboardType="numeric"
              placeholder="60"
              placeholderTextColor={colors.muted}
              style={{
                backgroundColor: colors.card2,
                borderColor: colors.border,
                borderWidth: 1,
                borderRadius: 14,
                paddingHorizontal: 12,
                paddingVertical: 12,
                color: colors.text,
              }}
            />
            <PrimaryButton title="Save threshold" onPress={applyThreshold} variant="secondary" />
          </View>

          <View style={{ gap: 8 }}>
            <AppText style={{ fontWeight: "800" }}>Currency</AppText>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
              {currencies.map((c) => {
                const active = preferences.currency === c;
                return (
                  <PrimaryButton
                    key={c}
                    title={c}
                    variant={active ? "primary" : "secondary"}
                    onPress={() => updatePreferences({ currency: c })}
                    style={{ minWidth: 76 }}
                  />
                );
              })}
            </View>
          </View>
        </View>
      </Card>

      <Card>
        <AppText style={{ fontSize: 16, fontWeight: "900" }}>Danger zone</AppText>
        <MutedText style={{ marginTop: 6 }}>
          These actions affect local storage only (demo mode).
        </MutedText>

        <View style={{ marginTop: 12, gap: 10 }}>
          <PrimaryButton title="Clear all app data" variant="danger" onPress={clearAppData} />
          <PrimaryButton
            title="Logout"
            variant="secondary"
            onPress={() =>
              Alert.alert("Logout?", "This clears local storage and returns to login.", [
                { text: "Cancel", style: "cancel" },
                { text: "Logout", style: "destructive", onPress: () => void logout() },
              ])
            }
          />
        </View>
      </Card>
    </Screen>
  );
}

