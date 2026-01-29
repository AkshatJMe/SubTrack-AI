import React from "react";
import { Pressable, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { Screen } from "../../components/Screen";
import { AppText, MutedText } from "../../components/AppText";
import { Card } from "../../components/Card";
import { PrimaryButton } from "../../components/PrimaryButton";
import { faqTree } from "./faqData";
import { colors } from "../../theme/colors";

export function FaqHomeScreen() {
  const nav = useNavigation<any>();

  return (
    <Screen scroll contentContainerStyle={{ gap: 14 }}>
      <View style={{ gap: 6 }}>
        <AppText style={{ fontSize: 22, fontWeight: "900" }}>FAQ Decision Tree</AppText>
        <MutedText>All questions are loaded locally from JSON.</MutedText>
      </View>

      <Card>
        <AppText style={{ fontWeight: "900" }}>How it works</AppText>
        <MutedText style={{ marginTop: 6 }}>
          Select answers step-by-step. The flow is 5–6 levels deep and ends with a final recommendation.
        </MutedText>
      </Card>

      <PrimaryButton title="Start" onPress={() => nav.navigate("FaqFlow", { startId: faqTree.rootId })} />

      <Pressable
        onPress={() => nav.navigate("FaqFlow")}
        style={{
          padding: 14,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.card,
        }}
      >
        <AppText style={{ fontWeight: "900" }}>Quick start</AppText>
        <MutedText style={{ marginTop: 6 }}>Starts from the root question.</MutedText>
      </Pressable>
    </Screen>
  );
}

