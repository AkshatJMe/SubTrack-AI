import React, { useMemo } from "react";
import { View } from "react-native";
import { Screen } from "../components/Screen";
import { AppText, MutedText } from "../components/AppText";
import { Card } from "../components/Card";
import { useSubscriptions } from "../context/SubscriptionsContext";
import { usePreferences } from "../context/PreferencesContext";
import { categoryBreakdownMonthly, totalMonthlySpend } from "../utils/subscriptions";
import { formatMoney } from "../utils/date";
import { colors } from "../theme/colors";
import { EmptyState } from "../components/EmptyState";

function Bar({ label, value, max, currency }: { label: string; value: number; max: number; currency: string }) {
  const pct = max <= 0 ? 0 : Math.max(0, Math.min(1, value / max));
  return (
    <View style={{ gap: 6 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <MutedText>{label}</MutedText>
        <AppText style={{ fontWeight: "900" }}>{formatMoney(value, currency)}</AppText>
      </View>
      <View
        style={{
          height: 10,
          borderRadius: 10,
          backgroundColor: colors.card2,
          borderWidth: 1,
          borderColor: colors.border,
          overflow: "hidden",
        }}
      >
        <View style={{ width: `${pct * 100}%`, height: "100%", backgroundColor: colors.primary2 }} />
      </View>
    </View>
  );
}

export function AnalyticsScreen() {
  const { subscriptions } = useSubscriptions();
  const { preferences } = usePreferences();

  const monthly = totalMonthlySpend(subscriptions);
  const breakdown = useMemo(() => categoryBreakdownMonthly(subscriptions), [subscriptions]);
  const items = Object.entries(breakdown).sort((a, b) => b[1] - a[1]);
  const max = items.length ? items[0][1] : 0;

  // Fake trend: compare against a computed baseline (no network, no history)
  const lastMonth = monthly * 0.92;
  const delta = monthly - lastMonth;
  const trend = delta >= 0 ? "up" : "down";
  const trendPct = lastMonth <= 0 ? 0 : Math.round((Math.abs(delta) / lastMonth) * 100);

  return (
    <Screen scroll contentContainerStyle={{ gap: 14 }}>
      <View style={{ gap: 6 }}>
        <AppText style={{ fontSize: 22, fontWeight: "900" }}>Analytics</AppText>
        <MutedText>Charts are computed locally (demo mode).</MutedText>
      </View>

      <Card>
        <MutedText>Estimated monthly total</MutedText>
        <AppText style={{ fontSize: 26, fontWeight: "900", marginTop: 6 }}>
          {formatMoney(monthly, preferences.currency)}
        </AppText>
        <MutedText style={{ marginTop: 8 }}>
          Trend:{" "}
          <AppText style={{ fontWeight: "900", color: trend === "up" ? colors.warning : colors.success }}>
            {trend === "up" ? `Up ${trendPct}%` : `Down ${trendPct}%`}
          </AppText>{" "}
          vs last month (simulated)
        </MutedText>
      </Card>

      <Card>
        <AppText style={{ fontSize: 16, fontWeight: "900" }}>Category breakdown</AppText>
        <MutedText style={{ marginTop: 4 }}>Active subscriptions only</MutedText>
        <View style={{ marginTop: 12, gap: 12 }}>
          {items.length === 0 ? (
            <EmptyState title="No active subscriptions" subtitle="Add one to see analytics." />
          ) : (
            items.map(([label, value]) => (
              <Bar key={label} label={label} value={value} max={max} currency={preferences.currency} />
            ))
          )}
        </View>
      </Card>
    </Screen>
  );
}

