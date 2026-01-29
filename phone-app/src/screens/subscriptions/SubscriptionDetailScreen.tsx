import React, { useMemo } from "react";
import { Alert, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import { Screen } from "../../components/Screen";
import { AppText, MutedText } from "../../components/AppText";
import { Card } from "../../components/Card";
import { PrimaryButton } from "../../components/PrimaryButton";
import { EmptyState } from "../../components/EmptyState";
import { useSubscriptions } from "../../context/SubscriptionsContext";
import { usePreferences } from "../../context/PreferencesContext";
import { colors } from "../../theme/colors";
import { formatMoney, formatShortDate } from "../../utils/date";

export function SubscriptionDetailScreen() {
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const { subscriptions, updateStatus, removeSubscription } = useSubscriptions();
  const { preferences } = usePreferences();

  const id = route.params?.id as string | undefined;
  const sub = useMemo(() => subscriptions.find((s) => s.id === id) ?? null, [subscriptions, id]);

  if (!sub) {
    return (
      <Screen scroll contentContainerStyle={{ gap: 14 }}>
        <EmptyState title="Not found" subtitle="This subscription no longer exists." />
        <PrimaryButton title="Go back" onPress={() => nav.goBack()} />
      </Screen>
    );
  }

  const isPaused = sub.status === "paused";
  const isCancelled = sub.status === "cancelled";

  return (
    <Screen scroll contentContainerStyle={{ gap: 14 }}>
      <Card>
        <AppText style={{ fontSize: 20, fontWeight: "900" }}>{sub.serviceName}</AppText>
        <MutedText style={{ marginTop: 6 }}>{sub.category}</MutedText>

        <View style={{ marginTop: 14, gap: 10 }}>
          <Row label="Amount" value={formatMoney(sub.amount, preferences.currency)} />
          <Row label="Billing cycle" value={sub.billingCycle} />
          <Row label="Renewal date" value={formatShortDate(sub.renewalDate)} />
          <Row label="Status" value={sub.status.toUpperCase()} valueColor={statusColor(sub.status)} />
        </View>
      </Card>

      <Card>
        <AppText style={{ fontSize: 16, fontWeight: "900" }}>Actions</AppText>

        <View style={{ marginTop: 12, gap: 10 }}>
          {isCancelled ? (
            <PrimaryButton
              title="Resume (set Active)"
              onPress={() => updateStatus(sub.id, "active")}
              variant="primary"
            />
          ) : (
            <PrimaryButton
              title={isPaused ? "Resume" : "Pause"}
              onPress={() => updateStatus(sub.id, isPaused ? "active" : "paused")}
              variant={isPaused ? "primary" : "secondary"}
            />
          )}

          {!isCancelled ? (
            <PrimaryButton
              title="Cancel subscription"
              variant="secondary"
              onPress={() =>
                Alert.alert(
                  "Cancel?",
                  "This marks the subscription as cancelled (local demo).",
                  [
                    { text: "Keep", style: "cancel" },
                    { text: "Cancel", style: "destructive", onPress: () => updateStatus(sub.id, "cancelled") },
                  ]
                )
              }
            />
          ) : null}

          <PrimaryButton
            title="Delete"
            variant="danger"
            onPress={() =>
              Alert.alert("Delete?", "This removes the subscription from local storage.", [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: () => {
                    removeSubscription(sub.id);
                    nav.goBack();
                  },
                },
              ])
            }
          />
        </View>
      </Card>
    </Screen>
  );
}

function Row({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
      <MutedText>{label}</MutedText>
      <AppText style={{ fontWeight: "900", color: valueColor ?? colors.text }}>{value}</AppText>
    </View>
  );
}

function statusColor(status: string) {
  if (status === "active") return colors.success;
  if (status === "paused") return colors.warning;
  return colors.muted;
}

