import React from "react";
import { SafeAreaView, ScrollView, StyleProp, ViewStyle } from "react-native";
import { colors } from "../theme/colors";

export function Screen({
  children,
  scroll,
  contentContainerStyle,
}: {
  children: React.ReactNode;
  scroll?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
}) {
  if (scroll) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
        <ScrollView
          contentContainerStyle={[
            { padding: 16, paddingBottom: 28, backgroundColor: colors.bg },
            contentContainerStyle,
          ]}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg, padding: 16 }}>
      {children}
    </SafeAreaView>
  );
}

