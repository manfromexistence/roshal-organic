"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ROSHAL_LOCALE_COOKIE } from "@/lib/store-locale";
import type { RoshalLocale } from "@/lib/store-types";
import { cn } from "@/lib/utils";

export function LocaleSwitcher({
  locale,
  className,
}: {
  locale: RoshalLocale;
  className?: string;
}) {
  const router = useRouter();
  const [currentLocale, setCurrentLocale] = useState<RoshalLocale>(locale);

  useEffect(() => {
    setCurrentLocale(locale);
  }, [locale]);

  useEffect(() => {
    localStorage.setItem("language", currentLocale);
    document.documentElement.lang = currentLocale;
  }, [currentLocale]);

  const persistLocale = async (nextLocale: RoshalLocale) => {
    setCurrentLocale(nextLocale);
    localStorage.setItem("language", nextLocale);
    document.documentElement.lang = nextLocale;
    window.dispatchEvent(
      new CustomEvent<RoshalLocale>("languageChange", {
        detail: nextLocale,
      }),
    );

    if ("cookieStore" in window) {
      await window.cookieStore.set({
        name: ROSHAL_LOCALE_COOKIE,
        value: nextLocale,
        path: "/",
        expires: Date.now() + 31_536_000_000,
      });
    } else {
      // biome-ignore lint/suspicious/noDocumentCookie: fallback for browsers without the Cookie Store API.
      document.cookie = `${ROSHAL_LOCALE_COOKIE}=${nextLocale}; path=/; max-age=31536000`;
    }

    router.refresh();
  };

  return (
    <ToggleGroup
      type="single"
      value={currentLocale}
      onValueChange={(value) => {
        if (!value || value === currentLocale) {
          return;
        }

        void persistLocale(value as RoshalLocale);
      }}
      aria-label="Language switch"
      className={cn(
        "h-8 shrink-0 overflow-hidden rounded-full border border-border/70 bg-background/90 p-2",
        className,
      )}
    >
      <ToggleGroupItem
        value="en"
        aria-label="Switch language to English"
        className="h-6 !rounded-full !p-2 text-[7.5px] uppercase text-muted-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground hover:text-foreground"
      >
        ENG
      </ToggleGroupItem>
      <ToggleGroupItem
        value="bn"
        aria-label="Switch language to Bangla"
        className="h-6 !rounded-full text-[7.5px] !p-2 uppercase text-muted-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground hover:text-foreground"
      >
        বাংলা
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
