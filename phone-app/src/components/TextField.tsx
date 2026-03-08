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
  const [focused, setFocused] = React.useState(false);

  return (
    <View style={{ gap: 8 }}>
      <AppText style={{ fontWeight: "800", fontSize: 14 }}>{label}</AppText>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize="none"
        autoCorrect={false}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          backgroundColor: colors.card2,
          borderColor: error ? colors.danger : focused ? colors.primary : colors.border,
          borderWidth: 1.5,
          borderRadius: 14,
          paddingHorizontal: 14,
          paddingVertical: 13,
          color: colors.text,
          fontSize: 15,
          fontWeight: "500",
        }}
      />
      {error ? <MutedText style={{ color: colors.danger, fontSize: 12, fontWeight: "600" }}>{error}</MutedText> : null}
    </View>
  );
}

