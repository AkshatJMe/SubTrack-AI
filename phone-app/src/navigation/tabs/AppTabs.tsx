import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";

import { DashboardScreen } from "../../screens/DashboardScreen";
import { AnalyticsScreen } from "../../screens/AnalyticsScreen";
import { NotificationsScreen } from "../../screens/NotificationsScreen";
import { ProfileScreen } from "../../screens/ProfileScreen";
import { colors } from "../../theme/colors";
import { SubscriptionsStack } from "../stacks/SubscriptionsStack";
import { FaqStack } from "../stacks/FaqStack";

const Tab = createBottomTabNavigator();

export function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: colors.card, borderBottomColor: colors.border },
        headerTintColor: colors.text,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.primary2,
        tabBarInactiveTintColor: colors.muted,
        tabBarIcon: ({ color, size }) => {
          const map: Record<string, keyof typeof Ionicons.glyphMap> = {
            Dashboard: "grid-outline",
            Subscriptions: "wallet-outline",
            Analytics: "stats-chart-outline",
            Notifications: "notifications-outline",
            FAQ: "help-circle-outline",
            Profile: "person-circle-outline",
          };
          const name = map[route.name] ?? "ellipse-outline";
          return <Ionicons name={name} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Subscriptions" component={SubscriptionsStack} options={{ headerShown: false }} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="FAQ" component={FaqStack} options={{ headerShown: false }} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

