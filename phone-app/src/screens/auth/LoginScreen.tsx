import React, { useMemo, useState } from "react";
import { Alert, Pressable, View } from "react-native";

import { Screen } from "../../components/Screen";
import { AppText, MutedText } from "../../components/AppText";
import { TextField } from "../../components/TextField";
import { PrimaryButton } from "../../components/PrimaryButton";
import { colors } from "../../theme/colors";
import { useAuth } from "../../context/AuthContext";
import { validateEmail, validatePassword } from "../../utils/validation";
import { useNavigation } from "@react-navigation/native";

export function LoginScreen() {
  const nav = useNavigation<any>();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const emailErr = useMemo(() => (email.length ? validateEmail(email) : null), [email]);
  const passErr = useMemo(() => (password.length ? validatePassword(password) : null), [password]);

  const onSubmit = async () => {
    setSubmitError(null);
    setLoading(true);
    const res = await login({ email, password });
    setLoading(false);
    if (!res.ok) {
      setSubmitError(res.message);
      return;
    }
    Alert.alert("Welcome back", "You’re logged in locally (demo mode).");
  };

  return (
    <Screen scroll contentContainerStyle={{ gap: 16, paddingTop: 40 }}>
      <View style={{ gap: 6 }}>
        <AppText style={{ fontSize: 26, fontWeight: "900" }}>Sign in</AppText>
        <MutedText>Manage subscriptions offline with smart local insights.</MutedText>
      </View>

      <View style={{ gap: 14 }}>
        <TextField
          label="Email"
          value={email}
          onChangeText={(t) => setEmail(t)}
          placeholder="you@example.com"
          keyboardType="email-address"
          error={emailErr}
        />
        <TextField
          label="Password"
          value={password}
          onChangeText={(t) => setPassword(t)}
          placeholder="••••••••"
          secureTextEntry
          error={passErr}
        />
      </View>

      {submitError ? (
        <View
          style={{
            padding: 12,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: colors.danger,
            backgroundColor: "#2B1320",
          }}
        >
          <AppText style={{ fontWeight: "800" }}>Couldn’t sign in</AppText>
          <MutedText style={{ marginTop: 4 }}>{submitError}</MutedText>
        </View>
      ) : null}

      <PrimaryButton title="Login" onPress={onSubmit} loading={loading} />

      <Pressable onPress={() => nav.navigate("Signup")} style={{ alignSelf: "center" }}>
        <MutedText>
          Don’t have an account? <AppText style={{ fontWeight: "900" }}>Sign up</AppText>
        </MutedText>
      </Pressable>

      <View style={{ marginTop: 10, padding: 14, borderRadius: 16, backgroundColor: colors.card }}>
        <AppText style={{ fontWeight: "900" }}>Demo note</AppText>
        <MutedText style={{ marginTop: 6 }}>
          This app stores everything locally (AsyncStorage). No backend, no network requests.
        </MutedText>
      </View>
    </Screen>
  );
}

