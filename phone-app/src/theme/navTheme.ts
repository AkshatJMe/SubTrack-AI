import { DefaultTheme, Theme } from "@react-navigation/native";
import { colors } from "./colors";

export const navTheme: Theme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.bg,
    card: colors.card,
    text: colors.text,
    border: colors.border,
    notification: colors.primary2,
  },
};

