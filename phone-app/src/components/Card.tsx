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
          borderRadius: 16,
          padding: 14,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

