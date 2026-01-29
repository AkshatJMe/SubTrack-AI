import React, { useMemo, useState } from "react";
import { FlatList, Pressable, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { useSubscriptions } from "../../context/SubscriptionsContext";
import { usePreferences } from "../../context/PreferencesContext";
import { Card } from "../../components/Card";
import { AppText, MutedText } from "../../components/AppText";
import { SegmentedControl } from "../../components/SegmentedControl";
import { EmptyState } from "../../components/EmptyState";
import { colors } from "../../theme/colors";
import { formatMoney, formatShortDate } from "../../utils/date";
import { Subscription, SubscriptionStatus } from "../../types";

type Filter = "all" | SubscriptionStatus;

export function SubscriptionListScreen() {
  const nav = useNavigation<any>();
  const { subscriptions, refreshFake } = useSubscriptions();
  const { preferences } = usePreferences();

  const [filter, setFilter] = useState<Filter>("all");
  const [refreshing, setRefreshing] = useState(false);

  const filtered = useMemo(() => {
    if (filter === "all") return subscriptions;
    return subscriptions.filter((s) => s.status === filter);
  }, [subscriptions, filter]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshFake();
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: Subscription }) => {
    const statusColor =
      item.status === "active" ? colors.success : item.status === "paused" ? colors.warning : colors.muted;
    return (
      <Pressable onPress={() => nav.navigate("SubscriptionDetail", { id: item.id })}>
        <Card style={{ marginBottom: 12 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
            <View style={{ flex: 1 }}>
              <AppText style={{ fontSize: 16, fontWeight: "900" }}>{item.serviceName}</AppText>
              <MutedText style={{ marginTop: 4 }}>
                {item.category} • {item.billingCycle} • Renews {formatShortDate(item.renewalDate)}
              </MutedText>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <AppText style={{ fontWeight: "900" }}>{formatMoney(item.amount, preferences.currency)}</AppText>
              <MutedText style={{ marginTop: 4, color: statusColor, fontWeight: "800" }}>
                {item.status.toUpperCase()}
              </MutedText>
            </View>
          </View>
        </Card>
      </Pressable>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: 16, gap: 12 }}>
      <SegmentedControl
        options={[
          { label: "All", value: "all" },
          { label: "Active", value: "active" },
          { label: "Paused", value: "paused" },
          { label: "Cancelled", value: "cancelled" },
        ]}
        value={filter}
        onChange={setFilter}
      />

      <Pressable
        onPress={() => nav.navigate("AddSubscription")}
        style={{
          backgroundColor: colors.primary,
          borderRadius: 14,
          paddingVertical: 12,
          alignItems: "center",
          borderWidth: 1,
          borderColor: colors.primary,
        }}
      >
        <AppText style={{ fontWeight: "900", color: colors.white }}>+ Add subscription</AppText>
      </Pressable>

      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        refreshing={refreshing}
        onRefresh={onRefresh}
        contentContainerStyle={{ paddingTop: 4, paddingBottom: 18 }}
        ListEmptyComponent={
          <EmptyState
            title="No subscriptions"
            subtitle="Add your first subscription. Everything is stored locally."
          />
        }
      />
    </View>
  );
}

