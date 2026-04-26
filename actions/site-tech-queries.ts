"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { getRequiredDashboardSessionUser } from "@/lib/edms/session";
import { activityLog, siteTechQueries } from "@/lib/schema";

const createSiteTechnicalQuerySchema = z.object({
  assignedTo: z.string().trim().min(1),
  date: z.string().trim().min(1),
  description: z.string().trim().min(5),
  discipline: z.string().trim().min(1),
  dueDate: z.string().trim().optional(),
  location: z.string().trim().optional(),
  priority: z.enum(["High", "Medium", "Low"]),
  projectId: z.string().min(1),
  queryNumber: z.string().trim().min(2),
  raisedBy: z.string().trim().min(2),
  subject: z.string().trim().min(2),
});

export async function createSiteTechnicalQuery(
  input: z.infer<typeof createSiteTechnicalQuerySchema>,
): Promise<{
  success: boolean;
  error?: { message: string };
  data?: { id: string };
}> {
  try {
    const sessionUser = await getRequiredDashboardSessionUser();
    const values = createSiteTechnicalQuerySchema.parse(input);
    const queryId = crypto.randomUUID();
    const now = new Date();

    await db.insert(siteTechQueries).values({
      assignedTo: values.assignedTo,
      createdAt: now,
      date: new Date(values.date),
      description: values.description,
      discipline: values.discipline,
      dueDate: values.dueDate ? new Date(values.dueDate) : null,
      id: queryId,
      location: values.location || null,
      priority: values.priority,
      projectId: values.projectId,
      queryNumber: values.queryNumber,
      raisedBy: values.raisedBy,
      response: null,
      responseDate: null,
      status: "Open",
      subject: values.subject,
      updatedAt: now,
    });

    await db.insert(activityLog).values({
      action: "site_technical_query_created",
      createdAt: now,
      description: `Created site technical query ${values.queryNumber}`,
      entityId: queryId,
      entityName: values.queryNumber,
      entityType: "site_technical_query",
      id: crypto.randomUUID(),
      projectId: values.projectId,
      userId: sessionUser.id,
    });

    revalidatePath("/site-tech-queries");
    revalidatePath("/site-tech-queries/new");

    return { success: true, data: { id: queryId } };
  } catch (error) {
    console.error("Failed to create site technical query:", error);
    return {
      success: false,
      error: { message: "Failed to create the site technical query." },
    };
  }
}
