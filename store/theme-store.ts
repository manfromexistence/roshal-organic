"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  DEFAULT_THEME_STATE,
  THEME_STORAGE_KEY,
  type ThemeStateSnapshot,
} from "@/lib/theme-bootstrap";
import type { ThemeStyleProps } from "@/types/theme";

function getResolvedMode(fallbackMode: "light" | "dark"): "light" | "dark" {
  if (typeof document === "undefined") {
    return fallbackMode;
  }

  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function applyThemeStyles(
  themeState: ThemeStateSnapshot,
  mode: "light" | "dark",
) {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;

  Object.entries(themeState[mode]).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });
}

interface ThemeStore {
  themeState: ThemeStateSnapshot;
  setColor: (
    key: keyof ThemeStyleProps,
    value: string,
    mode?: "light" | "dark",
  ) => void;
  setCurrentMode: (mode: "light" | "dark") => void;
  resetToDefault: () => void;
  applyTheme: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      themeState: DEFAULT_THEME_STATE,
      setColor: (key, value, mode) => {
        const activeMode = mode ?? get().themeState.currentMode;
        const nextThemeState = {
          ...get().themeState,
          [activeMode]: {
            ...get().themeState[activeMode],
            [key]: value,
          },
        };

        set({
          themeState: nextThemeState,
        });
        applyThemeStyles(
          nextThemeState,
          getResolvedMode(nextThemeState.currentMode),
        );
      },
      setCurrentMode: (mode) => {
        const nextThemeState = {
          ...get().themeState,
          currentMode: mode,
        };

        set({
          themeState: nextThemeState,
        });
        applyThemeStyles(nextThemeState, mode);
      },
      resetToDefault: () => {
        set({ themeState: DEFAULT_THEME_STATE });
        applyThemeStyles(
          DEFAULT_THEME_STATE,
          getResolvedMode(DEFAULT_THEME_STATE.currentMode),
        );
      },
      applyTheme: () => {
        const { themeState } = get();
        applyThemeStyles(themeState, getResolvedMode(themeState.currentMode));
      },
    }),
    {
      name: THEME_STORAGE_KEY,
      onRehydrateStorage: () => (state) => {
        state?.applyTheme();
      },
    },
  ),
);
