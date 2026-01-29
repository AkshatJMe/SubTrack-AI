import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { colors } from "../../theme/colors";

import { SubscriptionListScreen } from "../../screens/subscriptions/SubscriptionListScreen";
import { AddSubscriptionScreen } from "../../screens/subscriptions/AddSubscriptionScreen";
import { SubscriptionDetailScreen } from "../../screens/subscriptions/SubscriptionDetailScreen";

const Stack = createNativeStackNavigator();

export function SubscriptionsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        contentStyle: { backgroundColor: colors.bg },
      }}
    >
      <Stack.Screen
        name="SubscriptionList"
        component={SubscriptionListScreen}
        options={{ title: "Subscriptions" }}
      />
      <Stack.Screen name="AddSubscription" component={AddSubscriptionScreen} options={{ title: "Add" }} />
      <Stack.Screen
        name="SubscriptionDetail"
        component={SubscriptionDetailScreen}
        options={{ title: "Details" }}
      />
    </Stack.Navigator>
  );
}

