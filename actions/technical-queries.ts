"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { getRequiredDashboardSessionUser } from "@/lib/edms/session";
import { technicalQueries } from "@/lib/schema";

const createTechnicalQuerySchema = z.object({
  projectId: z.string().min(1),
  queryNumber: z.string().trim().min(2),
  date: z.string().trim().min(1),
  discipline: z.string().trim().min(1),
  subject: z.string().trim().min(2),
  description: z.string().trim().min(5),
  priority: z.enum(["High", "Medium", "Low"]),
  assignedTo: z.string().trim().min(1),
  dueDate: z.string().trim().optional(),
});

export async function createTechnicalQuery(
  input: z.infer<typeof createTechnicalQuerySchema>,
): Promise<{
  success: boolean;
  error?: { message: string };
  data?: { id: string };
}> {
  try {
    const sessionUser = await getRequiredDashboardSessionUser();
    const values = createTechnicalQuerySchema.parse(input);
    const queryId = crypto.randomUUID();

    await db.insert(technicalQueries).values({
      id: queryId,
      projectId: values.projectId,
      queryNumber: values.queryNumber,
      date: new Date(values.date),
      raisedBy: sessionUser.id,
      discipline: values.discipline,
      subject: values.subject,
      description: values.description,
      status: "Open",
      priority: values.priority,
      assignedTo: values.assignedTo,
      dueDate: values.dueDate ? new Date(values.dueDate) : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    revalidatePath("/technical-queries");
    revalidatePath("/technical-queries/new");

    return { success: true, data: { id: queryId } };
  } catch (error) {
    console.error("Failed to create technical query:", error);
    return {
      success: false,
      error: { message: "Failed to create the technical query." },
    };
  }
}
