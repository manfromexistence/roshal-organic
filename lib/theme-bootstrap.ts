import type { ThemeStyleProps } from "@/types/theme";

export const NEXT_THEME_STORAGE_KEY = "roshal-theme-mode-v2";
export const THEME_STORAGE_KEY = "roshal-theme-state-v3";

export interface ThemeStateSnapshot {
  light: ThemeStyleProps;
  dark: ThemeStyleProps;
  currentMode: "light" | "dark";
}

export const DEFAULT_LIGHT_THEME_COLORS: ThemeStyleProps = {
  background: "oklch(0.99 0 0)",
  foreground: "oklch(0.145 0 0)",
  card: "oklch(1 0 0)",
  "card-foreground": "oklch(0.145 0 0)",
  popover: "oklch(1 0 0)",
  "popover-foreground": "oklch(0.145 0 0)",
  primary: "oklch(28.04% 0.05154 150.113)",
  "primary-foreground": "oklch(0.985 0 0)",
  secondary: "oklch(0.963 0.018 158)",
  "secondary-foreground": "oklch(0.23 0.02 150)",
  muted: "oklch(0.973 0.01 145)",
  "muted-foreground": "oklch(0.45 0.02 160)",
  accent: "oklch(0.95 0.038 156)",
  "accent-foreground": "oklch(0.28 0.05 154)",
  destructive: "#ef4444",
  "destructive-foreground": "#fafafa",
  border: "oklch(0.92 0.01 145)",
  input: "oklch(0.94 0.01 145)",
  ring: "oklch(28.04% 0.05154 150.113)",
  "chart-1": "oklch(28.04% 0.05154 150.113)",
  "chart-2": "oklch(0.67 0.17 84)",
  "chart-3": "oklch(0.62 0.11 221)",
  "chart-4": "oklch(0.78 0.15 118)",
  "chart-5": "oklch(0.58 0.16 29)",
  sidebar: "oklch(0.985 0.004 145)",
  "sidebar-foreground": "oklch(0.145 0 0)",
  "sidebar-primary": "oklch(28.04% 0.05154 150.113)",
  "sidebar-primary-foreground": "oklch(0.985 0 0)",
  "sidebar-accent": "oklch(0.95 0.038 156)",
  "sidebar-accent-foreground": "oklch(0.28 0.05 154)",
  "sidebar-border": "oklch(0.92 0.01 145)",
  "sidebar-ring": "oklch(28.04% 0.05154 150.113)",
  "font-sans":
    '"Hind Siliguri", "Noto Sans Bengali", "Segoe UI", system-ui, sans-serif',
  "font-serif": "Source Serif 4, serif",
  "font-mono":
    '"JetBrains Mono", "Roboto Mono", "Fira Code", ui-monospace, monospace',
  radius: "0.75rem",
  "shadow-color": "hsl(145 57% 16%)",
  "shadow-opacity": "0.12",
  "shadow-blur": "18px",
  "shadow-spread": "0px",
  "shadow-offset-x": "0px",
  "shadow-offset-y": "8px",
  "letter-spacing": "-0.025em",
  spacing: "0.27rem",
};

export const DEFAULT_DARK_THEME_COLORS: ThemeStyleProps = {
  background: "oklch(0.16 0.012 155)",
  foreground: "oklch(0.985 0.004 140)",
  card: "oklch(0.24 0.018 150)",
  "card-foreground": "oklch(0.985 0.004 140)",
  popover: "oklch(0.22 0.017 152)",
  "popover-foreground": "oklch(0.985 0.004 140)",
  primary: "oklch(28.04% 0.05154 150.113)",
  "primary-foreground": "oklch(0.985 0 0)",
  secondary: "oklch(0.31 0.018 150)",
  "secondary-foreground": "oklch(0.985 0.004 140)",
  muted: "oklch(0.28 0.016 152)",
  "muted-foreground": "oklch(0.82 0.02 150)",
  accent: "oklch(0.36 0.03 154)",
  "accent-foreground": "oklch(0.985 0.004 140)",
  destructive: "#ef4444",
  "destructive-foreground": "#ffffff",
  border: "oklch(0.38 0.018 150)",
  input: "oklch(0.38 0.018 150)",
  ring: "oklch(28.04% 0.05154 150.113)",
  "chart-1": "oklch(28.04% 0.05154 150.113)",
  "chart-2": "oklch(0.72 0.16 92)",
  "chart-3": "oklch(0.73 0.11 220)",
  "chart-4": "oklch(0.69 0.14 118)",
  "chart-5": "oklch(0.7 0.16 30)",
  sidebar: "oklch(0.14 0.012 154)",
  "sidebar-foreground": "oklch(0.985 0.004 140)",
  "sidebar-primary": "oklch(28.04% 0.05154 150.113)",
  "sidebar-primary-foreground": "oklch(0.985 0 0)",
  "sidebar-accent": "oklch(0.34 0.028 154)",
  "sidebar-accent-foreground": "oklch(0.985 0.004 140)",
  "sidebar-border": "oklch(0.34 0.018 150)",
  "sidebar-ring": "oklch(28.04% 0.05154 150.113)",
  "font-sans":
    '"Hind Siliguri", "Noto Sans Bengali", "Segoe UI", system-ui, sans-serif',
  "font-serif": "Source Serif 4, serif",
  "font-mono":
    '"JetBrains Mono", "Roboto Mono", "Fira Code", ui-monospace, monospace',
  radius: "0.75rem",
  "shadow-color": "hsl(145 57% 10%)",
  "shadow-opacity": "0.34",
  "shadow-blur": "28px",
  "shadow-spread": "0px",
  "shadow-offset-x": "0px",
  "shadow-offset-y": "12px",
  "letter-spacing": "-0.025em",
  spacing: "0.27rem",
};

export const DEFAULT_THEME_STATE: ThemeStateSnapshot = {
  light: DEFAULT_LIGHT_THEME_COLORS,
  dark: DEFAULT_DARK_THEME_COLORS,
  currentMode: "light",
};

export function getThemeBootstrapScript() {
  const serializedDefaultThemeState = JSON.stringify(
    DEFAULT_THEME_STATE,
  ).replace(/</g, "\\u003c");

  return `(() => {
    const root = document.documentElement;
    const defaultThemeState = ${serializedDefaultThemeState};
    const sanitizeMode = (value) => (value === "dark" ? "dark" : "light");

    const readResolvedTheme = () => {
      try {
        const storedTheme = window.localStorage.getItem(${JSON.stringify(NEXT_THEME_STORAGE_KEY)});
        if (storedTheme === "light" || storedTheme === "dark") {
          return storedTheme;
        }
      } catch {}

      return sanitizeMode(defaultThemeState.currentMode);
    };

    const readThemeState = () => {
      try {
        const raw = window.localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
        if (!raw) {
          return defaultThemeState;
        }

        const parsed = JSON.parse(raw);
        const persistedThemeState = parsed?.state?.themeState;
        if (!persistedThemeState?.light || !persistedThemeState?.dark) {
          return defaultThemeState;
        }

        return {
          light: { ...defaultThemeState.light, ...persistedThemeState.light },
          dark: { ...defaultThemeState.dark, ...persistedThemeState.dark },
          currentMode: sanitizeMode(persistedThemeState.currentMode ?? defaultThemeState.currentMode),
        };
      } catch {
        return defaultThemeState;
      }
    };

    const resolvedTheme = readResolvedTheme();
    const themeState = readThemeState();
    const activeTheme = resolvedTheme === "dark" ? themeState.dark : themeState.light;

    root.classList.toggle("dark", resolvedTheme === "dark");
    root.style.colorScheme = resolvedTheme;

    for (const [key, value] of Object.entries(activeTheme)) {
      if (typeof value === "string") {
        root.style.setProperty("--" + key, value);
      }
    }
  })();`;
}
