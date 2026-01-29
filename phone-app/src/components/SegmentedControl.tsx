import React from "react";
import { Pressable, View } from "react-native";
import { colors } from "../theme/colors";
import { AppText } from "./AppText";

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: Array<{ label: string; value: T }>;
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: colors.card2,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 14,
        overflow: "hidden",
      }}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <Pressable
            key={o.value}
            onPress={() => onChange(o.value)}
            style={{
              flex: 1,
              paddingVertical: 10,
              alignItems: "center",
              backgroundColor: active ? colors.primary : "transparent",
            }}
          >
            <AppText style={{ fontWeight: "800", color: active ? colors.white : colors.text }}>
              {o.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

