"use client";

import { Languages } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ROSHAL_LOCALE_COOKIE } from "@/lib/store-locale";
import type { RoshalLocale } from "@/lib/store-types";

export function LocaleSwitcher({ locale }: { locale: RoshalLocale }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    localStorage.setItem("language", locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const toggleLocale = async () => {
    const nextLocale = locale === "bn" ? "en" : "bn";

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
    }

    router.refresh();
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleLocale}
      aria-label={locale === "bn" ? "Switch to English" : "বাংলায় পরিবর্তন করুন"}
      className="shrink-0"
      data-pathname={pathname}
      title={locale === "bn" ? "Switch to English" : "বাংলায় পরিবর্তন করুন"}
    >
      <Languages className="size-5" />
      <span className="sr-only">
        {locale === "bn" ? "Switch to English" : "বাংলায় পরিবর্তন করুন"}
      </span>
    </Button>
  );
}
