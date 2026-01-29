import React from "react";
import { ActivityIndicator, Pressable, StyleProp, Text, ViewStyle } from "react-native";
import { colors } from "../theme/colors";

export function PrimaryButton({
  title,
  onPress,
  disabled,
  loading,
  variant = "primary",
  style,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary" | "danger";
  style?: StyleProp<ViewStyle>;
}) {
  const bg =
    variant === "primary" ? colors.primary : variant === "danger" ? colors.danger : colors.card2;
  const border = variant === "secondary" ? colors.border : bg;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        {
          backgroundColor: bg,
          borderColor: border,
          borderWidth: 1,
          opacity: disabled ? 0.6 : pressed ? 0.85 : 1,
          paddingVertical: 12,
          paddingHorizontal: 14,
          borderRadius: 14,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          gap: 10,
        },
        style,
      ]}
    >
      {loading ? <ActivityIndicator color={colors.white} /> : null}
      <Text style={{ color: colors.white, fontWeight: "700", fontSize: 15 }}>{title}</Text>
    </Pressable>
  );
}

