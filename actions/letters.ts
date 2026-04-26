"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { getRequiredDashboardSessionUser } from "@/lib/edms/session";
import {
  activityLog,
  documents,
  letterRelatedDocuments,
  letters,
} from "@/lib/schema";

const createLetterSchema = z.object({
  projectId: z.string().min(1),
  letterNumber: z.string().trim().min(2),
  date: z.string().trim().min(1),
  direction: z.enum(["outgoing", "incoming"]),
  from: z.string().trim().min(2),
  to: z.string().trim().min(2),
  toType: z.string().trim().min(2),
  subject: z.string().trim().min(2),
  category: z.string().trim().min(2),
  ref: z.string().trim().optional(),
  urgent: z.boolean().default(false),
  forInfo: z.boolean().default(false),
  actionRequired: z.boolean().default(false),
  responseRequired: z.enum(["Y", "N"]).default("N"),
  fileName: z.string().trim().optional(),
  fileSize: z.number().nonnegative().optional(),
  fileType: z.string().trim().optional(),
  fileUrl: z.string().trim().optional(),
});

export async function createLetter(
  input: z.infer<typeof createLetterSchema>,
): Promise<{
  success: boolean;
  error?: { message: string };
}> {
  try {
    const sessionUser = await getRequiredDashboardSessionUser();
    const values = createLetterSchema.parse(input);
    const letterId = crypto.randomUUID();
    const now = new Date();
    const hasAttachment = Boolean(values.fileUrl && values.fileName);

    await db.insert(letters).values({
      id: letterId,
      projectId: values.projectId,
      letterNumber: values.letterNumber,
      date: new Date(values.date),
      direction: values.direction,
      from: values.from,
      to: values.to,
      toType: values.toType,
      subject: values.subject,
      category: values.category,
      ref: values.ref || null,
      author: sessionUser.id,
      attachments: hasAttachment ? 1 : 0,
      status: values.direction === "incoming" ? "received" : "sent",
      urgent: values.urgent,
      forInfo: values.forInfo,
      actionRequired: values.actionRequired,
      responseRequired:
        values.actionRequired || values.responseRequired === "Y" ? "Y" : "N",
      createdAt: now,
      updatedAt: now,
    });

    if (hasAttachment) {
      const attachmentDocumentId = crypto.randomUUID();

      await db.insert(documents).values({
        id: attachmentDocumentId,
        projectId: values.projectId,
        documentNumber: `${values.letterNumber}-PDF`,
        title: values.subject,
        description: `Attachment for letter ${values.letterNumber}`,
        category: "Correspondence",
        documentType: "correspondence",
        version: "1.0",
        revision: "A",
        isLatestVersion: true,
        fileName: values.fileName || "",
        fileSize: values.fileSize,
        fileType: values.fileType,
        fileUrl: values.fileUrl || "",
        status: values.direction === "incoming" ? "received" : "sent",
        uploadedAt: now,
        uploadedBy: sessionUser.id,
        updatedAt: now,
        updatedBy: sessionUser.id,
      });

      await db.insert(letterRelatedDocuments).values({
        id: crypto.randomUUID(),
        letterId,
        documentId: attachmentDocumentId,
        revision: "A",
        createdAt: now,
      });
    }

    await db.insert(activityLog).values({
      id: crypto.randomUUID(),
      userId: sessionUser.id,
      projectId: values.projectId,
      action: "created",
      entityType: "letter",
      entityId: letterId,
      entityName: values.letterNumber,
      description: `${values.direction === "incoming" ? "Incoming" : "Outgoing"} letter: ${values.subject}`,
      createdAt: now,
    });

    revalidatePath("/letters");
    revalidatePath("/letters/new");
    revalidatePath("/projects");
    return { success: true };
  } catch (error) {
    console.error("Failed to create letter:", error);
    return {
      success: false,
      error: { message: "Failed to create the letter record." },
    };
  }
}
