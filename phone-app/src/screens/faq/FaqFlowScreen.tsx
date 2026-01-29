import React, { useMemo, useState } from "react";
import { Pressable, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import { Screen } from "../../components/Screen";
import { AppText, MutedText } from "../../components/AppText";
import { Card } from "../../components/Card";
import { PrimaryButton } from "../../components/PrimaryButton";
import { colors } from "../../theme/colors";
import { faqTree, getNode } from "./faqData";

export function FaqFlowScreen() {
  const nav = useNavigation<any>();
  const route = useRoute<any>();

  const startId = (route.params?.startId as string | undefined) ?? faqTree.rootId;
  const [path, setPath] = useState<string[]>([startId]);
  const currentId = path[path.length - 1];

  const node = useMemo(() => getNode(currentId), [currentId]);

  const goBack = () => {
    if (path.length <= 1) {
      nav.goBack();
      return;
    }
    setPath((p) => p.slice(0, -1));
  };

  const selectNext = (nextId: string) => {
    const next = getNode(nextId);
    if (next.type === "answer") {
      nav.navigate("FaqAnswer", { title: next.title, body: next.body, tips: next.tips });
      return;
    }
    setPath((p) => [...p, nextId]);
  };

  if (node.type === "answer") {
    // Shouldn't happen (answers navigate to a different screen), but handle gracefully
    return (
      <Screen scroll contentContainerStyle={{ gap: 14 }}>
        <Card>
          <AppText style={{ fontSize: 18, fontWeight: "900" }}>{node.title}</AppText>
          <MutedText style={{ marginTop: 10 }}>{node.body}</MutedText>
        </Card>
        <PrimaryButton title="Back" onPress={goBack} variant="secondary" />
      </Screen>
    );
  }

  return (
    <Screen scroll contentContainerStyle={{ gap: 14 }}>
      <View style={{ gap: 6 }}>
        <AppText style={{ fontSize: 18, fontWeight: "900" }}>Question {path.length}</AppText>
        <MutedText>Choose the option that fits best.</MutedText>
      </View>

      <Card>
        <AppText style={{ fontSize: 18, fontWeight: "900" }}>{node.prompt}</AppText>
        <View style={{ marginTop: 12, gap: 10 }}>
          {node.options.map((o) => (
            <Pressable
              key={o.label}
              onPress={() => selectNext(o.nextId)}
              style={{
                padding: 12,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: colors.border,
                backgroundColor: colors.card2,
              }}
            >
              <AppText style={{ fontWeight: "900" }}>{o.label}</AppText>
              <MutedText style={{ marginTop: 4 }}>Tap to continue</MutedText>
            </Pressable>
          ))}
        </View>
      </Card>

      <View style={{ flexDirection: "row", gap: 12 }}>
        <PrimaryButton title="Back" onPress={goBack} variant="secondary" style={{ flex: 1 }} />
        <PrimaryButton
          title="Restart"
          onPress={() => setPath([faqTree.rootId])}
          variant="secondary"
          style={{ flex: 1 }}
        />
      </View>
    </Screen>
  );
}

