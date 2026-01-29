import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useAuth } from "../context/AuthContext";
import { SplashScreen } from "../screens/SplashScreen";
import { AuthStack } from "./stacks/AuthStack";
import { AppTabs } from "./tabs/AppTabs";

const Root = createNativeStackNavigator();

export function RootNavigator() {
  const { user, isBootstrapping } = useAuth();

  return (
    <Root.Navigator screenOptions={{ headerShown: false }}>
      {isBootstrapping ? (
        <Root.Screen name="Splash" component={SplashScreen} />
      ) : !user ? (
        <Root.Screen name="Auth" component={AuthStack} />
      ) : (
        <Root.Screen name="App" component={AppTabs} />
      )}
    </Root.Navigator>
  );
}

