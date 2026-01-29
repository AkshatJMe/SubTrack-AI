import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import { colors } from "../theme/colors";
import { AppText, MutedText } from "../components/AppText";

export function SplashScreen() {
  const { isBootstrapping } = useAuth();

  // Keep a minimal splash for UX even if storage loads instantly
  useEffect(() => {
    // noop; bootstrapping handled by provider
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.bg,
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        gap: 14,
      }}
    >
      <View
        style={{
          width: 74,
          height: 74,
          borderRadius: 22,
          backgroundColor: colors.primary,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: colors.black,
          shadowOpacity: 0.25,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 10 },
        }}
      >
        <AppText style={{ fontSize: 28, fontWeight: "900", color: colors.white }}>S</AppText>
      </View>

      <View style={{ alignItems: "center", gap: 4 }}>
        <AppText style={{ fontSize: 18, fontWeight: "900" }}>SubTrack AI</AppText>
        <MutedText>Smart Subscription Manager</MutedText>
      </View>

      <ActivityIndicator size="small" color={colors.primary2} />
      <MutedText style={{ marginTop: 8 }}>
        {isBootstrapping ? "Loading your local data…" : "Starting…"}
      </MutedText>
    </View>
  );
}

