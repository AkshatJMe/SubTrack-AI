import React, { useMemo, useState } from "react";
import { Alert, Pressable, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { Screen } from "../../components/Screen";
import { AppText, MutedText } from "../../components/AppText";
import { TextField } from "../../components/TextField";
import { PrimaryButton } from "../../components/PrimaryButton";
import { colors } from "../../theme/colors";
import { useAuth } from "../../context/AuthContext";
import { validateEmail, validatePassword } from "../../utils/validation";

export function SignupScreen() {
  const nav = useNavigation<any>();
  const { signup } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const emailErr = useMemo(() => (email.length ? validateEmail(email) : null), [email]);
  const passErr = useMemo(() => (password.length ? validatePassword(password) : null), [password]);

  const onSubmit = async () => {
    setSubmitError(null);
    setLoading(true);
    const res = await signup({ email, password });
    setLoading(false);
    if (!res.ok) {
      setSubmitError(res.message);
      return;
    }
    Alert.alert("Account created", "Now sign in to continue.");
    nav.navigate("Login");
  };

  return (
    <Screen scroll contentContainerStyle={{ gap: 16, paddingTop: 40 }}>
      <View style={{ gap: 6 }}>
        <AppText style={{ fontSize: 26, fontWeight: "900" }}>Create account</AppText>
        <MutedText>Fake auth (stored locally), but realistic UX & validation.</MutedText>
      </View>

      <View style={{ gap: 14 }}>
        <TextField
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
          error={emailErr}
        />
        <TextField
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="At least 6 chars, letters + numbers"
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
          <AppText style={{ fontWeight: "800" }}>Couldn’t sign up</AppText>
          <MutedText style={{ marginTop: 4 }}>{submitError}</MutedText>
        </View>
      ) : null}

      <PrimaryButton title="Sign up" onPress={onSubmit} loading={loading} />

      <Pressable onPress={() => nav.navigate("Login")} style={{ alignSelf: "center" }}>
        <MutedText>
          Already have an account? <AppText style={{ fontWeight: "900" }}>Login</AppText>
        </MutedText>
      </Pressable>

      <View style={{ marginTop: 10, padding: 14, borderRadius: 16, backgroundColor: colors.card }}>
        <AppText style={{ fontWeight: "900" }}>Privacy note</AppText>
        <MutedText style={{ marginTop: 6 }}>
          Password is stored locally in AsyncStorage for demo purposes only.
        </MutedText>
      </View>
    </Screen>
  );
}

