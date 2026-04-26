"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { getRequiredDashboardSessionUser } from "@/lib/edms/session";
import { activityLog, dailyReports } from "@/lib/schema";

const createDailyReportSchema = z.object({
  activitiesCompleted: z.string().trim().optional(),
  issues: z.string().trim().optional(),
  projectId: z.string().min(1),
  reportDate: z.string().trim().min(1),
  weather: z.string().trim().optional(),
});

export async function createDailyReport(
  input: z.infer<typeof createDailyReportSchema>,
): Promise<{
  success: boolean;
  error?: { message: string };
  data?: { id: string };
}> {
  try {
    const sessionUser = await getRequiredDashboardSessionUser();
    const values = createDailyReportSchema.parse(input);
    const reportId = crypto.randomUUID();
    const createdAt = new Date();

    await db.insert(dailyReports).values({
      activitiesCompleted: values.activitiesCompleted || null,
      createdAt,
      createdBy: sessionUser.id,
      id: reportId,
      issues: values.issues || null,
      projectId: values.projectId,
      reportDate: new Date(values.reportDate),
      updatedAt: createdAt,
      weather: values.weather || null,
    });

    await db.insert(activityLog).values({
      action: "daily_report_created",
      createdAt,
      description: `Created daily report for ${values.reportDate}`,
      entityId: reportId,
      entityName: values.reportDate,
      entityType: "daily_report",
      id: crypto.randomUUID(),
      projectId: values.projectId,
      userId: sessionUser.id,
    });

    revalidatePath("/daily-reports");
    revalidatePath("/daily-reports/new");

    return { success: true, data: { id: reportId } };
  } catch (error) {
    console.error("Failed to create daily report:", error);
    return {
      success: false,
      error: { message: "Failed to create the daily report." },
    };
  }
}
