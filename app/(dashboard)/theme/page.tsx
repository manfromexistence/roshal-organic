import type { Metadata } from "next";
import { ThemeEditorClient } from "./theme-editor-client";

export const metadata: Metadata = {
  title: "Theme Editor | Quadra EDMS",
  description: "Customize your workspace with 40+ beautiful themes",
};

export default function ThemePage() {
  return <ThemeEditorClient />;
}
