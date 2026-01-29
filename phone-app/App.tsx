import "react-native-gesture-handler";

import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";

import { RootNavigator } from "./src/navigation/RootNavigator";
import { AppProviders } from "./src/context/AppProviders";
import { navTheme } from "./src/theme/navTheme";

export default function App() {
  return (
    <AppProviders>
      <NavigationContainer theme={navTheme}>
        <RootNavigator />
        <StatusBar style="light" />
      </NavigationContainer>
    </AppProviders>
  );
}

