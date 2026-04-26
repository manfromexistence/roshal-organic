"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { getRequiredDashboardSessionUser } from "@/lib/edms/session";
import { activityLog, rfis } from "@/lib/schema";

const createRfiSchema = z.object({
  assignedTo: z.string().trim().min(1),
  category: z.string().trim().min(2),
  date: z.string().trim().min(1),
  description: z.string().trim().min(5),
  dueDate: z.string().trim().optional(),
  from: z.string().trim().min(2),
  priority: z.enum(["High", "Medium", "Low"]),
  projectId: z.string().min(1),
  raisedBy: z.string().trim().min(2),
  rfiNumber: z.string().trim().min(2),
  subject: z.string().trim().min(2),
});

export async function createRfi(
  input: z.infer<typeof createRfiSchema>,
): Promise<{
  success: boolean;
  error?: { message: string };
  data?: { id: string };
}> {
  try {
    const sessionUser = await getRequiredDashboardSessionUser();
    const values = createRfiSchema.parse(input);
    const rfiId = crypto.randomUUID();
    const now = new Date();

    await db.insert(rfis).values({
      assignedTo: values.assignedTo,
      category: values.category,
      createdAt: now,
      date: new Date(values.date),
      description: values.description,
      dueDate: values.dueDate ? new Date(values.dueDate) : null,
      from: values.from,
      id: rfiId,
      priority: values.priority,
      projectId: values.projectId,
      raisedBy: values.raisedBy,
      response: null,
      responseDate: null,
      rfiNumber: values.rfiNumber,
      status: "Under Review",
      subject: values.subject,
      updatedAt: now,
    });

    await db.insert(activityLog).values({
      action: "rfi_created",
      createdAt: now,
      description: `Created RFI ${values.rfiNumber}`,
      entityId: rfiId,
      entityName: values.rfiNumber,
      entityType: "rfi",
      id: crypto.randomUUID(),
      projectId: values.projectId,
      userId: sessionUser.id,
    });

    revalidatePath("/rfis");
    revalidatePath("/rfis/new");

    return { success: true, data: { id: rfiId } };
  } catch (error) {
    console.error("Failed to create RFI:", error);
    return {
      success: false,
      error: { message: "Failed to create the RFI." },
    };
  }
}
