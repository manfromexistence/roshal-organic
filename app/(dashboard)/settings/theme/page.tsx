import type { Metadata } from "next";
import { ThemeSettingsClient } from "./theme-settings-client";

export const metadata: Metadata = {
  title: "Theme Settings",
  description: "Customize your workspace appearance",
};

export default function ThemeSettingsPage() {
  return <ThemeSettingsClient />;
}
