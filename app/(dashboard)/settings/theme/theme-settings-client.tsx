"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ScrollableContent } from "@/components/scrollable-content";
import { useThemeStore } from "@/store/theme-store";

export function ThemeSettingsClient() {
  const applyTheme = useThemeStore((state) => state.applyTheme);
  const router = useRouter();

  useEffect(() => {
    applyTheme();
    // Redirect to the new theme editor page
    router.replace("/theme");
  }, [applyTheme, router]);

  return (
    <ScrollableContent>
      <div className="flex items-center justify-center px-8 pt-6">
        <p className="text-muted-foreground">Redirecting to theme editor...</p>
      </div>
    </ScrollableContent>
  );
}
