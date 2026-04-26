"use server";

import { revalidatePath } from "next/cache";

export async function markNotificationRead(input: {
  notificationId: string;
}): Promise<{ success: boolean; error?: { message: string } }> {
  // TODO: Implement mark notification read
  console.log("Mark notification read:", input);
  revalidatePath("/notifications");
  return { success: true };
}

export async function markAllNotificationsRead(): Promise<{
  success: boolean;
  error?: { message: string };
}> {
  // TODO: Implement mark all notifications read
  console.log("Mark all notifications read");
  revalidatePath("/notifications");
  return { success: true };
}
