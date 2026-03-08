import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { colors } from "../theme/colors";

export function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View
      style={[
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: 20,
          padding: 16,
          shadowColor: colors.primary,
          shadowOpacity: 0.1,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
          elevation: 5,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

