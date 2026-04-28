"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ROSHAL_LOCALE_COOKIE } from "@/lib/store-locale";
import type { RoshalLocale } from "@/lib/store-types";

export function LocaleSwitcher({ locale }: { locale: RoshalLocale }) {
  const router = useRouter();
  const pathname = usePathname();
  const [currentLocale, setCurrentLocale] = useState<RoshalLocale>(locale);

  useEffect(() => {
    setCurrentLocale(locale);
  }, [locale]);

  useEffect(() => {
    localStorage.setItem("language", currentLocale);
    document.documentElement.lang = currentLocale;
  }, [currentLocale]);

  const toggleLabel =
    currentLocale === "bn" ? "Switch to English" : "বাংলায় পরিবর্তন করুন";

  const toggleLocale = async () => {
    const nextLocale = currentLocale === "bn" ? "en" : "bn";

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
    <Button
      variant="outline"
      onClick={toggleLocale}
      aria-label={toggleLabel}
      className="relative h-10 min-w-14 shrink-0"
      data-pathname={pathname}
      title={toggleLabel}
    >
      {currentLocale === "en" ? "BN" : "EN"}
    </Button>
  );
}
