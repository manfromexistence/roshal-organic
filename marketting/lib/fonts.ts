import { JetBrains_Mono } from "next/font/google";

export const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const fontSans = fontMono; // Using JetBrains Mono as default
