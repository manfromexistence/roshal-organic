"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { getRequiredDashboardSessionUser } from "@/lib/edms/session";
import { activityLog, warrantyRecords } from "@/lib/schema";

const createWarrantySchema = z.object({
  description: z.string().trim().min(5),
  endDate: z.string().trim().min(1),
  item: z.string().trim().min(2),
  projectId: z.string().min(1),
  startDate: z.string().trim().min(1),
  status: z.enum(["active", "expired", "claimed"]),
  warrantyNumber: z.string().trim().min(2),
  warrantyType: z.enum(["manufacturer", "contractor", "system"]),
});

export async function createWarrantyRecord(
  input: z.infer<typeof createWarrantySchema>,
): Promise<{
  success: boolean;
  error?: { message: string };
  data?: { id: string };
}> {
  try {
    const sessionUser = await getRequiredDashboardSessionUser();
    const values = createWarrantySchema.parse(input);
    const warrantyId = crypto.randomUUID();
    const createdAt = new Date();

    await db.insert(warrantyRecords).values({
      createdAt,
      description: values.description,
      endDate: new Date(values.endDate),
      id: warrantyId,
      item: values.item,
      projectId: values.projectId,
      startDate: new Date(values.startDate),
      status: values.status,
      updatedAt: createdAt,
      warrantyNumber: values.warrantyNumber,
      warrantyType: values.warrantyType,
    });

    await db.insert(activityLog).values({
      action: "warranty_created",
      createdAt,
      description: `Created warranty record ${values.warrantyNumber}`,
      entityId: warrantyId,
      entityName: values.warrantyNumber,
      entityType: "warranty",
      id: crypto.randomUUID(),
      projectId: values.projectId,
      userId: sessionUser.id,
    });

    revalidatePath("/warranty");
    revalidatePath("/warranty/new");

    return { success: true, data: { id: warrantyId } };
  } catch (error) {
    console.error("Failed to create warranty record:", error);
    return {
      success: false,
      error: { message: "Failed to create the warranty record." },
    };
  }
}
