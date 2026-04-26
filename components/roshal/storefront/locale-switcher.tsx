"use client";

import { Languages } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ROSHAL_LOCALE_COOKIE } from "@/lib/roshal/locale";
import type { RoshalLocale } from "@/lib/roshal/types";

export function LocaleSwitcher({ locale }: { locale: RoshalLocale }) {
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = async () => {
    const nextLocale = locale === "bn" ? "en" : "bn";

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
      variant="outline"
      size="sm"
      onClick={toggleLocale}
      aria-label={locale === "bn" ? "Switch to English" : "বাংলায় পরিবর্তন করুন"}
      className="gap-2"
      data-pathname={pathname}
    >
      <Languages className="size-4" />
      {locale === "bn" ? "EN" : "বাং"}
    </Button>
  );
}
