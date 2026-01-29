import React from "react";
import { View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import { Screen } from "../../components/Screen";
import { AppText, MutedText } from "../../components/AppText";
import { Card } from "../../components/Card";
import { PrimaryButton } from "../../components/PrimaryButton";
import { colors } from "../../theme/colors";

export function FaqAnswerScreen() {
  const nav = useNavigation<any>();
  const route = useRoute<any>();

  const title = route.params?.title as string | undefined;
  const body = route.params?.body as string | undefined;
  const tips = (route.params?.tips as string[] | undefined) ?? [];

  return (
    <Screen scroll contentContainerStyle={{ gap: 14 }}>
      <Card>
        <AppText style={{ fontSize: 18, fontWeight: "900" }}>{title ?? "Answer"}</AppText>
        <MutedText style={{ marginTop: 10 }}>{body ?? "No answer text."}</MutedText>

        {tips.length ? (
          <View style={{ marginTop: 14, gap: 8 }}>
            <AppText style={{ fontWeight: "900" }}>Tips</AppText>
            {tips.map((t) => (
              <View key={t} style={{ flexDirection: "row", gap: 8 }}>
                <AppText style={{ color: colors.primary2, fontWeight: "900" }}>•</AppText>
                <MutedText style={{ flex: 1 }}>{t}</MutedText>
              </View>
            ))}
          </View>
        ) : null}
      </Card>

      <View style={{ flexDirection: "row", gap: 12 }}>
        <PrimaryButton title="Back to FAQ" onPress={() => nav.popToTop()} variant="secondary" style={{ flex: 1 }} />
        <PrimaryButton title="Start again" onPress={() => nav.navigate("FaqFlow")} style={{ flex: 1 }} />
      </View>
    </Screen>
  );
}

