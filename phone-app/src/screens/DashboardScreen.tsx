import React from "react";
import { View } from "react-native";
import { Screen } from "../components/Screen";
import { AppText, MutedText } from "../components/AppText";
import { Card } from "../components/Card";
import { useSubscriptions } from "../context/SubscriptionsContext";
import { usePreferences } from "../context/PreferencesContext";
import { activeCount, totalMonthlySpend, upcomingRenewals } from "../utils/subscriptions";
import { formatMoney, formatShortDate, daysUntil } from "../utils/date";
import { colors } from "../theme/colors";
import { EmptyState } from "../components/EmptyState";

export function DashboardScreen() {
  const { subscriptions } = useSubscriptions();
  const { preferences } = usePreferences();

  const monthly = totalMonthlySpend(subscriptions);
  const active = activeCount(subscriptions);
  const upcoming = upcomingRenewals(subscriptions, 7);

  const overspending = monthly > preferences.overspendingThreshold;

  return (
    <Screen scroll contentContainerStyle={{ gap: 14 }}>
      <View style={{ gap: 6 }}>
        <AppText style={{ fontSize: 22, fontWeight: "900" }}>Overview</AppText>
        <MutedText>All insights are computed locally (demo mode).</MutedText>
      </View>

      <View style={{ flexDirection: "row", gap: 12 }}>
        <Card style={{ flex: 1 }}>
          <MutedText>Total monthly</MutedText>
          <AppText style={{ fontSize: 22, fontWeight: "900", marginTop: 6 }}>
            {formatMoney(monthly, preferences.currency)}
          </AppText>
          <MutedText style={{ marginTop: 6, color: overspending ? colors.warning : colors.muted }}>
            {overspending ? "Over your limit" : "Within your limit"}
          </MutedText>
        </Card>
        <Card style={{ flex: 1 }}>
          <MutedText>Active subs</MutedText>
          <AppText style={{ fontSize: 22, fontWeight: "900", marginTop: 6 }}>{active}</AppText>
          <MutedText style={{ marginTop: 6 }}>Paused/cancelled excluded</MutedText>
        </Card>
      </View>

      <Card>
        <AppText style={{ fontSize: 16, fontWeight: "900" }}>Upcoming renewals</AppText>
        <MutedText style={{ marginTop: 4 }}>Next 7 days</MutedText>

        <View style={{ marginTop: 12, gap: 10 }}>
          {upcoming.length === 0 ? (
            <EmptyState title="No renewals soon" subtitle="You’re clear for the next week." />
          ) : (
            upcoming.map((s) => {
              const d = daysUntil(s.renewalDate);
              return (
                <View
                  key={s.id}
                  style={{
                    padding: 12,
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor: colors.border,
                    backgroundColor: colors.card2,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <AppText style={{ fontWeight: "900" }}>{s.serviceName}</AppText>
                    <MutedText style={{ marginTop: 2 }}>
                      Renews {d === 0 ? "today" : `in ${d} day${d === 1 ? "" : "s"}`} •{" "}
                      {formatShortDate(s.renewalDate)}
                    </MutedText>
                  </View>
                  <AppText style={{ fontWeight: "900" }}>
                    {formatMoney(s.amount, preferences.currency)}
                  </AppText>
                </View>
              );
            })
          )}
        </View>
      </Card>
    </Screen>
  );
}

