"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { getRequiredDashboardSessionUser } from "@/lib/edms/session";
import { activityLog, extensionOfTimeRequests } from "@/lib/schema";

const createExtensionOfTimeSchema = z.object({
  eotNumber: z.string().trim().min(2),
  projectId: z.string().min(1),
  reason: z.string().trim().min(5),
  requestedDays: z.coerce.number().int().positive(),
});

export async function createExtensionOfTimeRequest(
  input: z.infer<typeof createExtensionOfTimeSchema>,
): Promise<{
  success: boolean;
  error?: { message: string };
  data?: { id: string };
}> {
  try {
    const sessionUser = await getRequiredDashboardSessionUser();
    const values = createExtensionOfTimeSchema.parse(input);
    const requestId = crypto.randomUUID();
    const createdAt = new Date();

    await db.insert(extensionOfTimeRequests).values({
      approvalStatus: "pending",
      createdAt,
      eotNumber: values.eotNumber,
      id: requestId,
      projectId: values.projectId,
      reason: values.reason,
      requestedDays: values.requestedDays,
      updatedAt: createdAt,
    });

    await db.insert(activityLog).values({
      action: "extension_of_time_created",
      createdAt,
      description: `Created EOT request ${values.eotNumber}`,
      entityId: requestId,
      entityName: values.eotNumber,
      entityType: "extension_of_time",
      id: crypto.randomUUID(),
      projectId: values.projectId,
      userId: sessionUser.id,
    });

    revalidatePath("/extension-of-time");
    revalidatePath("/extension-of-time/new");

    return { success: true, data: { id: requestId } };
  } catch (error) {
    console.error("Failed to create extension of time request:", error);
    return {
      success: false,
      error: { message: "Failed to create the extension of time request." },
    };
  }
}
