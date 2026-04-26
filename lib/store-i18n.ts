import "server-only";
import { cookies } from "next/headers";
import { isRoshalLocale, ROSHAL_LOCALE_COOKIE } from "@/lib/store-locale";
import type { RoshalLocale } from "@/lib/store-types";

export async function getRoshalLocale(): Promise<RoshalLocale> {
  const cookieStore = await cookies();
  const candidate = cookieStore.get(ROSHAL_LOCALE_COOKIE)?.value;
  return isRoshalLocale(candidate) ? candidate : "bn";
}
