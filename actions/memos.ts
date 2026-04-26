"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { getRequiredDashboardSessionUser } from "@/lib/edms/session";
import { activityLog, memos } from "@/lib/schema";

const createMemoSchema = z.object({
  category: z.string().trim().min(2),
  content: z.string().trim().min(5),
  date: z.string().trim().min(1),
  from: z.string().trim().min(2),
  memoNumber: z.string().trim().min(2),
  projectId: z.string().min(1),
  status: z.enum(["Draft", "Distributed", "Archived"]),
  subject: z.string().trim().min(2),
  to: z.string().trim().min(2),
  urgent: z.boolean().default(false),
});

export async function createMemo(
  input: z.infer<typeof createMemoSchema>,
): Promise<{
  success: boolean;
  error?: { message: string };
  data?: { id: string };
}> {
  try {
    const sessionUser = await getRequiredDashboardSessionUser();
    const values = createMemoSchema.parse(input);
    const memoId = crypto.randomUUID();
    const now = new Date();

    await db.insert(memos).values({
      category: values.category,
      content: values.content,
      createdAt: now,
      date: new Date(values.date),
      from: values.from,
      id: memoId,
      memoNumber: values.memoNumber,
      projectId: values.projectId,
      status: values.status,
      subject: values.subject,
      to: values.to,
      updatedAt: now,
      urgent: values.urgent,
    });

    await db.insert(activityLog).values({
      action: "memo_created",
      createdAt: now,
      description: `Created memo ${values.memoNumber}`,
      entityId: memoId,
      entityName: values.memoNumber,
      entityType: "memo",
      id: crypto.randomUUID(),
      projectId: values.projectId,
      userId: sessionUser.id,
    });

    revalidatePath("/memos");
    revalidatePath("/memos/new");

    return { success: true, data: { id: memoId } };
  } catch (error) {
    console.error("Failed to create memo:", error);
    return {
      success: false,
      error: { message: "Failed to create the memo." },
    };
  }
}
