import React from "react";
import { Text, TextProps } from "react-native";
import { colors } from "../theme/colors";

export function AppText(props: TextProps) {
  return <Text {...props} style={[{ color: colors.text }, props.style]} />;
}

export function MutedText(props: TextProps) {
  return <Text {...props} style={[{ color: colors.muted }, props.style]} />;
}

