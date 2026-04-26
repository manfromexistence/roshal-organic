import type { ThemeStyleProps } from "@/types/theme";

export const NEXT_THEME_STORAGE_KEY = "theme";
export const THEME_STORAGE_KEY = "theme-storage";

export interface ThemeStateSnapshot {
  light: ThemeStyleProps;
  dark: ThemeStyleProps;
  currentMode: "light" | "dark";
}

export const DEFAULT_LIGHT_THEME_COLORS: ThemeStyleProps = {
  background: "#ffffff",
  foreground: "#09090b",
  card: "#ffffff",
  "card-foreground": "#09090b",
  popover: "#ffffff",
  "popover-foreground": "#09090b",
  primary: "#18181b",
  "primary-foreground": "#fafafa",
  secondary: "#f4f4f5",
  "secondary-foreground": "#18181b",
  muted: "#f4f4f5",
  "muted-foreground": "#71717a",
  accent: "#f4f4f5",
  "accent-foreground": "#18181b",
  destructive: "#ef4444",
  "destructive-foreground": "#fafafa",
  border: "#e4e4e7",
  input: "#e4e4e7",
  ring: "#18181b",
  "chart-1": "#3b82f6",
  "chart-2": "#2563eb",
  "chart-3": "#1d4ed8",
  "chart-4": "#1e40af",
  "chart-5": "#1e3a8a",
  sidebar: "#f9fafb",
  "sidebar-foreground": "#333333",
  "sidebar-primary": "#3b82f6",
  "sidebar-primary-foreground": "#ffffff",
  "sidebar-accent": "#e0f2fe",
  "sidebar-accent-foreground": "#1e3a8a",
  "sidebar-border": "#e5e7eb",
  "sidebar-ring": "#3b82f6",
  "font-sans": "Inter, sans-serif",
  "font-serif": "Source Serif 4, serif",
  "font-mono": "JetBrains Mono, monospace",
  radius: "0.375rem",
  "shadow-color": "hsl(0 0% 0%)",
  "shadow-opacity": "0.16",
  "shadow-blur": "3px",
  "shadow-spread": "0px",
  "shadow-offset-x": "0px",
  "shadow-offset-y": "2px",
  "letter-spacing": "-0.025em",
  spacing: "0.27rem",
};

export const DEFAULT_DARK_THEME_COLORS: ThemeStyleProps = {
  background: "#171717",
  foreground: "#e5e5e5",
  card: "#262626",
  "card-foreground": "#e5e5e5",
  popover: "#262626",
  "popover-foreground": "#e5e5e5",
  primary: "#3b82f6",
  "primary-foreground": "#ffffff",
  secondary: "#262626",
  "secondary-foreground": "#e5e5e5",
  muted: "#1f1f1f",
  "muted-foreground": "#a3a3a3",
  accent: "#1e3a8a",
  "accent-foreground": "#bfdbfe",
  destructive: "#ef4444",
  "destructive-foreground": "#ffffff",
  border: "#404040",
  input: "#404040",
  ring: "#3b82f6",
  "chart-1": "#60a5fa",
  "chart-2": "#3b82f6",
  "chart-3": "#2563eb",
  "chart-4": "#1d4ed8",
  "chart-5": "#1e40af",
  sidebar: "#171717",
  "sidebar-foreground": "#e5e5e5",
  "sidebar-primary": "#3b82f6",
  "sidebar-primary-foreground": "#ffffff",
  "sidebar-accent": "#1e3a8a",
  "sidebar-accent-foreground": "#bfdbfe",
  "sidebar-border": "#404040",
  "sidebar-ring": "#3b82f6",
  "font-sans": "Inter, sans-serif",
  "font-serif": "Source Serif 4, serif",
  "font-mono": "JetBrains Mono, monospace",
  radius: "0.375rem",
  "shadow-color": "hsl(0 0% 0%)",
  "shadow-opacity": "0.16",
  "shadow-blur": "3px",
  "shadow-spread": "0px",
  "shadow-offset-x": "0px",
  "shadow-offset-y": "2px",
  "letter-spacing": "-0.025em",
  spacing: "0.27rem",
};

export const DEFAULT_THEME_STATE: ThemeStateSnapshot = {
  light: DEFAULT_LIGHT_THEME_COLORS,
  dark: DEFAULT_DARK_THEME_COLORS,
  currentMode: "dark",
};

export function getThemeBootstrapScript() {
  const serializedDefaultThemeState = JSON.stringify(
    DEFAULT_THEME_STATE,
  ).replace(/</g, "\\u003c");

  return `(() => {
    const root = document.documentElement;
    const defaultThemeState = ${serializedDefaultThemeState};
    const sanitizeMode = (value) => (value === "light" ? "light" : "dark");

    const readResolvedTheme = () => {
      try {
        const storedTheme = window.localStorage.getItem(${JSON.stringify(NEXT_THEME_STORAGE_KEY)});
        if (storedTheme === "light" || storedTheme === "dark") {
          return storedTheme;
        }
      } catch {}

      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
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
