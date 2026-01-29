import React, { useMemo, useState } from "react";
import { Alert, TextInput, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { Screen } from "../../components/Screen";
import { AppText, MutedText } from "../../components/AppText";
import { TextField } from "../../components/TextField";
import { PrimaryButton } from "../../components/PrimaryButton";
import { colors } from "../../theme/colors";
import { useSubscriptions } from "../../context/SubscriptionsContext";
import { BillingCycle, Subscription } from "../../types";
import { isoDateToday } from "../../utils/date";

const cycles: BillingCycle[] = ["monthly", "yearly", "weekly"];
const categories: Subscription["category"][] = [
  "Streaming",
  "Music",
  "Productivity",
  "Gaming",
  "Utilities",
  "Other",
];

export function AddSubscriptionScreen() {
  const nav = useNavigation<any>();
  const { addSubscription } = useSubscriptions();

  const [serviceName, setServiceName] = useState("");
  const [amountText, setAmountText] = useState("");
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [renewalDate, setRenewalDate] = useState(isoDateToday());
  const [category, setCategory] = useState<Subscription["category"]>("Streaming");

  const amount = useMemo(() => Number(amountText), [amountText]);

  const nameErr = serviceName.trim().length < 2 ? "Service name must be at least 2 characters." : null;
  const amountErr =
    amountText.length === 0
      ? "Amount is required."
      : !Number.isFinite(amount) || amount <= 0
        ? "Enter a valid amount."
        : null;
  const dateErr = /^\d{4}-\d{2}-\d{2}$/.test(renewalDate) ? null : "Use YYYY-MM-DD (e.g., 2026-02-14).";

  const canSave = !nameErr && !amountErr && !dateErr;

  const onSave = () => {
    if (!canSave) return;
    addSubscription({
      serviceName,
      amount,
      billingCycle,
      renewalDate,
      category,
    });
    Alert.alert("Saved", "Subscription added locally.");
    nav.goBack();
  };

  return (
    <Screen scroll contentContainerStyle={{ gap: 14 }}>
      <View style={{ gap: 6 }}>
        <AppText style={{ fontSize: 22, fontWeight: "900" }}>Add subscription</AppText>
        <MutedText>Manual entry only (no network calls).</MutedText>
      </View>

      <TextField
        label="Service name"
        value={serviceName}
        onChangeText={setServiceName}
        placeholder="e.g., Netflix"
        error={serviceName.length ? nameErr : null}
      />

      <View style={{ gap: 8 }}>
        <AppText style={{ fontWeight: "700" }}>Amount</AppText>
        <TextInput
          value={amountText}
          onChangeText={setAmountText}
          keyboardType="numeric"
          placeholder="e.g., 15.99"
          placeholderTextColor={colors.muted}
          style={{
            backgroundColor: colors.card2,
            borderColor: amountText.length ? (amountErr ? colors.danger : colors.border) : colors.border,
            borderWidth: 1,
            borderRadius: 14,
            paddingHorizontal: 12,
            paddingVertical: 12,
            color: colors.text,
          }}
        />
        {amountText.length ? (
          amountErr ? (
            <MutedText style={{ color: colors.danger }}>{amountErr}</MutedText>
          ) : null
        ) : null}
      </View>

      <View style={{ gap: 8 }}>
        <AppText style={{ fontWeight: "700" }}>Billing cycle</AppText>
        <View style={{ flexDirection: "row", gap: 10, flexWrap: "wrap" }}>
          {cycles.map((c) => (
            <PrimaryButton
              key={c}
              title={c}
              variant={billingCycle === c ? "primary" : "secondary"}
              onPress={() => setBillingCycle(c)}
              style={{ minWidth: 96 }}
            />
          ))}
        </View>
      </View>

      <View style={{ gap: 8 }}>
        <AppText style={{ fontWeight: "700" }}>Renewal date (YYYY-MM-DD)</AppText>
        <TextInput
          value={renewalDate}
          onChangeText={setRenewalDate}
          placeholder="2026-02-14"
          placeholderTextColor={colors.muted}
          style={{
            backgroundColor: colors.card2,
            borderColor: renewalDate.length ? (dateErr ? colors.danger : colors.border) : colors.border,
            borderWidth: 1,
            borderRadius: 14,
            paddingHorizontal: 12,
            paddingVertical: 12,
            color: colors.text,
          }}
        />
        {dateErr ? <MutedText style={{ color: colors.danger }}>{dateErr}</MutedText> : null}
      </View>

      <View style={{ gap: 8 }}>
        <AppText style={{ fontWeight: "700" }}>Category</AppText>
        <View style={{ flexDirection: "row", gap: 10, flexWrap: "wrap" }}>
          {categories.map((c) => (
            <PrimaryButton
              key={c}
              title={c}
              variant={category === c ? "primary" : "secondary"}
              onPress={() => setCategory(c)}
              style={{ minWidth: 120 }}
            />
          ))}
        </View>
      </View>

      <PrimaryButton title="Save subscription" onPress={onSave} disabled={!canSave} />
    </Screen>
  );
}

