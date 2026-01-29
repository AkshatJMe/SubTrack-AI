import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { colors } from "../../theme/colors";

import { FaqHomeScreen } from "../../screens/faq/FaqHomeScreen";
import { FaqFlowScreen } from "../../screens/faq/FaqFlowScreen";
import { FaqAnswerScreen } from "../../screens/faq/FaqAnswerScreen";

const Stack = createNativeStackNavigator();

export function FaqStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        contentStyle: { backgroundColor: colors.bg },
      }}
    >
      <Stack.Screen name="FaqHome" component={FaqHomeScreen} options={{ title: "FAQ" }} />
      <Stack.Screen name="FaqFlow" component={FaqFlowScreen} options={{ title: "Help" }} />
      <Stack.Screen name="FaqAnswer" component={FaqAnswerScreen} options={{ title: "Answer" }} />
    </Stack.Navigator>
  );
}

