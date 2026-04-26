"use client";

import type { ThemeProviderProps } from "next-themes";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { useLayoutEffect } from "react";
import { useThemeStore } from "@/store/theme-store";

function ThemeSynchronizer() {
  const { resolvedTheme } = useTheme();
  const currentMode = useThemeStore((state) => state.themeState.currentMode);
  const setCurrentMode = useThemeStore((state) => state.setCurrentMode);
  const applyTheme = useThemeStore((state) => state.applyTheme);
  const mode = resolvedTheme === "dark" ? "dark" : "light";

  useLayoutEffect(() => {
    if (currentMode !== mode) {
      setCurrentMode(mode);
      return;
    }

    applyTheme();
  }, [applyTheme, currentMode, mode, setCurrentMode]);

  return null;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <ThemeSynchronizer />
      {children}
    </NextThemesProvider>
  );
}
