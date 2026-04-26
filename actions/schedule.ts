"use server";

import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getRequiredDashboardSessionUser } from "@/lib/edms/session";
import { scheduleActivities, scheduleSync } from "@/lib/schema";

export async function linkDocumentsToActivity(input: {
  projectId: string;
  activityId: string;
  documentCodes: string[];
}): Promise<{ success: boolean; error?: { message: string } }> {
  try {
    await getRequiredDashboardSessionUser();

    const [activity] = await db
      .select({
        id: scheduleActivities.id,
        linkedDocuments: scheduleActivities.linkedDocuments,
      })
      .from(scheduleActivities)
      .where(
        and(
          eq(scheduleActivities.id, input.activityId),
          eq(scheduleActivities.projectId, input.projectId),
        ),
      )
      .limit(1);

    if (!activity) {
      return {
        success: false,
        error: { message: "The selected activity could not be found." },
      };
    }

    const existingCodes = activity.linkedDocuments
      ? (JSON.parse(activity.linkedDocuments) as string[])
      : [];

    const nextCodes = Array.from(
      new Set(
        [...existingCodes, ...input.documentCodes]
          .map((code) => code.trim())
          .filter(Boolean),
      ),
    );

    await db
      .update(scheduleActivities)
      .set({
        linkedDocuments: JSON.stringify(nextCodes),
        updatedAt: new Date(),
      })
      .where(eq(scheduleActivities.id, input.activityId));

    revalidatePath("/schedule");
    return { success: true };
  } catch (error) {
    console.error("Failed to link documents to schedule activity:", error);
    return {
      success: false,
      error: { message: "Failed to link the selected documents." },
    };
  }
}

export async function syncProjectSchedule(input: {
  projectId: string;
  source: string;
}): Promise<{ success: boolean; error?: { message: string } }> {
  try {
    const sessionUser = await getRequiredDashboardSessionUser();

    const [latestSync, activities] = await Promise.all([
      db
        .select({
          projectStart: scheduleSync.projectStart,
          projectEnd: scheduleSync.projectEnd,
        })
        .from(scheduleSync)
        .where(eq(scheduleSync.projectId, input.projectId))
        .orderBy(desc(scheduleSync.lastSyncAt))
        .limit(1),
      db
        .select({
          startDate: scheduleActivities.startDate,
          endDate: scheduleActivities.endDate,
        })
        .from(scheduleActivities)
        .where(eq(scheduleActivities.projectId, input.projectId))
        .orderBy(desc(scheduleActivities.createdAt)),
    ]);

    const today = new Date().toISOString().slice(0, 10);
    const projectStart =
      latestSync[0]?.projectStart ||
      activities
        .map((activity) => activity.startDate)
        .sort((left, right) => left.localeCompare(right))[0] ||
      today;

    const projectEnd =
      latestSync[0]?.projectEnd ||
      activities
        .map((activity) => activity.endDate)
        .sort((left, right) => right.localeCompare(left))[0] ||
      today;

    await db.insert(scheduleSync).values({
      id: crypto.randomUUID(),
      projectId: input.projectId,
      source: input.source,
      lastSyncAt: new Date(),
      syncedBy: sessionUser.id,
      projectStart,
      projectEnd,
      createdAt: new Date(),
    });

    revalidatePath("/schedule");
    return { success: true };
  } catch (error) {
    console.error("Failed to sync project schedule:", error);
    return {
      success: false,
      error: { message: "Failed to record the schedule sync." },
    };
  }
}
