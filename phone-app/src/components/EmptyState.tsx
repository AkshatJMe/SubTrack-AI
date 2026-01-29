import React from "react";
import { View } from "react-native";
import { colors } from "../theme/colors";
import { AppText, MutedText } from "./AppText";

export function EmptyState({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <View
      style={{
        padding: 18,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.card,
        gap: 6,
        alignItems: "center",
      }}
    >
      <AppText style={{ fontWeight: "900", fontSize: 16 }}>{title}</AppText>
      {subtitle ? <MutedText style={{ textAlign: "center" }}>{subtitle}</MutedText> : null}
    </View>
  );
}

