import React from "react";
import { TextInput, View } from "react-native";
import { colors } from "../theme/colors";
import { AppText, MutedText } from "./AppText";

export function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  error,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric";
  error?: string | null;
}) {
  return (
    <View style={{ gap: 8 }}>
      <AppText style={{ fontWeight: "700" }}>{label}</AppText>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize="none"
        autoCorrect={false}
        style={{
          backgroundColor: colors.card2,
          borderColor: error ? colors.danger : colors.border,
          borderWidth: 1,
          borderRadius: 14,
          paddingHorizontal: 12,
          paddingVertical: 12,
          color: colors.text,
        }}
      />
      {error ? <MutedText style={{ color: colors.danger }}>{error}</MutedText> : null}
    </View>
  );
}

