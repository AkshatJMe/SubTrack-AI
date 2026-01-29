import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { STORAGE_KEYS } from "../storage/keys";
import { getJson, remove, setJson } from "../storage/storage";
import { User } from "../types";
import { normalizeEmail, validateEmail, validatePassword } from "../utils/validation";
import { uid } from "../utils/id";

type AuthState = {
  isBootstrapping: boolean;
  user: User | null;
};

type LoginInput = { email: string; password: string };
type SignupInput = { email: string; password: string };

type AuthContextValue = AuthState & {
  login: (input: LoginInput) => Promise<{ ok: true } | { ok: false; message: string }>;
  signup: (input: SignupInput) => Promise<{ ok: true } | { ok: false; message: string }>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const stored = await getJson<User>(STORAGE_KEYS.user);
      if (mounted) {
        setUser(stored);
        setIsBootstrapping(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    return {
      isBootstrapping,
      user,
      login: async ({ email, password }) => {
        const emailErr = validateEmail(email);
        if (emailErr) return { ok: false, message: emailErr };
        const passErr = validatePassword(password);
        if (passErr) return { ok: false, message: passErr };

        const stored = await getJson<User>(STORAGE_KEYS.user);
        if (!stored) return { ok: false, message: "No account found. Please sign up first." };

        if (normalizeEmail(stored.email) !== normalizeEmail(email) || stored.password !== password) {
          return { ok: false, message: "Invalid email or password." };
        }
        setUser(stored);
        return { ok: true };
      },
      signup: async ({ email, password }) => {
        const emailErr = validateEmail(email);
        if (emailErr) return { ok: false, message: emailErr };
        const passErr = validatePassword(password);
        if (passErr) return { ok: false, message: passErr };

        const existing = await getJson<User>(STORAGE_KEYS.user);
        if (existing && normalizeEmail(existing.email) === normalizeEmail(email)) {
          return { ok: false, message: "An account with this email already exists." };
        }

        const newUser: User = {
          id: uid("user"),
          email: normalizeEmail(email),
          password,
          createdAt: new Date().toISOString(),
        };
        await setJson(STORAGE_KEYS.user, newUser);
        return { ok: true };
      },
      logout: async () => {
        // Strict rule: logout clears local storage
        await remove(STORAGE_KEYS.user);
        await remove(STORAGE_KEYS.subscriptions);
        await remove(STORAGE_KEYS.notifications);
        await remove(STORAGE_KEYS.preferences);
        setUser(null);
      },
    };
  }, [isBootstrapping, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

