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
  const border = variant === "secondary" ? colors.border : "transparent";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        {
          backgroundColor: bg,
          borderColor: border,
          borderWidth: variant === "secondary" ? 1 : 0,
          opacity: disabled ? 0.6 : pressed ? 0.9 : 1,
          paddingVertical: 14,
          paddingHorizontal: 16,
          borderRadius: 16,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          gap: 10,
          shadowColor: variant === "primary" ? colors.primary : colors.black,
          shadowOpacity: variant === "primary" ? 0.3 : 0.15,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 3 },
          elevation: variant === "primary" ? 6 : 3,
        },
        style,
      ]}
    >
      {loading ? <ActivityIndicator color={colors.white} /> : null}
      <Text style={{ color: colors.white, fontWeight: "800", fontSize: 16 }}>{title}</Text>
    </Pressable>
  );
}

