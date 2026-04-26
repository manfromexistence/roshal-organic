import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { NotificationsPreferences } from "@/components/settings/notifications-preferences";
import { db } from "@/lib/db";
import { notifications } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Notifications | Quadra EDMS",
};

export default async function NotificationsPage() {
  const unreadRows = await db
    .select({ id: notifications.id })
    .from(notifications)
    .where(eq(notifications.isRead, false));

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Notifications
        </h1>
        <p className="text-sm leading-6 text-muted-foreground md:text-base">
          Control how the dashboard surfaces workflow, document, and transmittal
          activity.
        </p>
      </header>

      <NotificationsPreferences unreadCount={unreadRows.length} />
    </div>
  );
}
