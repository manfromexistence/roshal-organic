import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/edms/session";
import type { RoshalRole } from "./types";

export function normalizeRoshalRole(
  role: string | null | undefined,
): RoshalRole {
  return role === "admin" ? "admin" : "user";
}

export async function getRoshalSessionUser() {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    return null;
  }

  return {
    ...sessionUser,
    role: normalizeRoshalRole(sessionUser.role),
  };
}

export async function requireRoshalUser() {
  const sessionUser = await getRoshalSessionUser();

  if (!sessionUser) {
    redirect("/login");
  }

  return sessionUser;
}

export async function requireRoshalAdmin() {
  const sessionUser = await requireRoshalUser();

  if (sessionUser.role !== "admin") {
    redirect("/");
  }

  return sessionUser;
}
