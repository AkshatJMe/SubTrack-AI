import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { defaultPreferences } from "../data/defaults";
import { STORAGE_KEYS } from "../storage/keys";
import { getJson, setJson } from "../storage/storage";
import { Preferences } from "../types";

type PreferencesContextValue = {
  preferences: Preferences;
  setPreferences: (next: Preferences) => void;
  updatePreferences: (patch: Partial<Preferences>) => void;
  resetPreferences: () => void;
  isLoaded: boolean;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferencesState] = useState<Preferences>(defaultPreferences);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const stored = await getJson<Preferences>(STORAGE_KEYS.preferences);
      if (mounted) {
        setPreferencesState(stored ?? defaultPreferences);
        setIsLoaded(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const persist = async (next: Preferences) => {
    setPreferencesState(next);
    await setJson(STORAGE_KEYS.preferences, next);
  };

  const value = useMemo<PreferencesContextValue>(() => {
    return {
      preferences,
      isLoaded,
      setPreferences: (next) => {
        void persist(next);
      },
      updatePreferences: (patch) => {
        void persist({ ...preferences, ...patch });
      },
      resetPreferences: () => {
        void persist(defaultPreferences);
      },
    };
  }, [preferences, isLoaded]);

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error("usePreferences must be used within PreferencesProvider");
  return ctx;
}

