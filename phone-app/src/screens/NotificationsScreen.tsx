import React from "react";
import { Alert, Pressable, View } from "react-native";
import { Screen } from "../components/Screen";
import { AppText, MutedText } from "../components/AppText";
import { Card } from "../components/Card";
import { PrimaryButton } from "../components/PrimaryButton";
import { EmptyState } from "../components/EmptyState";
import { useNotifications } from "../context/NotificationsContext";
import { colors } from "../theme/colors";

export function NotificationsScreen() {
  const { notifications, addNotification, markRead, markAllRead, clearAllNotifications } = useNotifications();

  const generateFake = () => {
    const kinds = [
      {
        type: "renewal_reminder" as const,
        title: "Renewal reminder",
        body: "A subscription renews soon. Consider pausing if unused.",
      },
      {
        type: "overspending_alert" as const,
        title: "Overspending alert",
        body: "Your monthly spending looks high. Review your active subscriptions.",
      },
    ];
    const pick = kinds[Math.floor(Math.random() * kinds.length)];
    addNotification({ ...pick, read: false });
    Alert.alert("Generated", "A fake notification was added locally.");
  };

  return (
    <Screen scroll contentContainerStyle={{ gap: 14 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <View style={{ gap: 4 }}>
          <AppText style={{ fontSize: 22, fontWeight: "900" }}>Notifications</AppText>
          <MutedText>Stored locally (AsyncStorage).</MutedText>
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: 12 }}>
        <PrimaryButton title="Generate fake" onPress={generateFake} style={{ flex: 1 }} />
        <PrimaryButton title="Mark all read" variant="secondary" onPress={markAllRead} style={{ flex: 1 }} />
      </View>

      <PrimaryButton
        title="Clear notifications"
        variant="danger"
        onPress={() =>
          Alert.alert("Clear all?", "This removes all notifications from local storage.", [
            { text: "Cancel", style: "cancel" },
            { text: "Clear", style: "destructive", onPress: clearAllNotifications },
          ])
        }
      />

      <Card>
        <AppText style={{ fontSize: 16, fontWeight: "900" }}>Activity</AppText>
        <View style={{ marginTop: 12, gap: 10 }}>
          {notifications.length === 0 ? (
            <EmptyState title="No notifications" subtitle="Generate one to see how it looks." />
          ) : (
            notifications.map((n) => (
              <Pressable
                key={n.id}
                onPress={() => markRead(n.id)}
                style={{
                  padding: 12,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: colors.border,
                  backgroundColor: n.read ? colors.card2 : "#152B52",
                }}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 10 }}>
                  <AppText style={{ fontWeight: "900", flex: 1 }}>{n.title}</AppText>
                  {!n.read ? (
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 10,
                        backgroundColor: colors.primary2,
                        marginTop: 4,
                      }}
                    />
                  ) : null}
                </View>
                <MutedText style={{ marginTop: 6 }}>{n.body}</MutedText>
                <MutedText style={{ marginTop: 8, fontSize: 12 }}>
                  {new Date(n.createdAt).toLocaleString()}
                </MutedText>
              </Pressable>
            ))
          )}
        </View>
      </Card>
    </Screen>
  );
}

