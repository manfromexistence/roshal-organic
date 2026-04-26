"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getRequiredDashboardSessionUser } from "@/lib/edms/session";
import { transmittalDocuments, transmittals } from "@/lib/schema";

export async function createTransmittal(input: {
  projectId: string;
  transmittalNumber: string;
  to: string;
  from?: string;
  subject: string;
  documents: string[];
  dueDate?: Date;
  purpose?: string;
  description?: string;
  recipientUserId?: string;
  ccUserId?: string;
  notes?: string;
  images?: string[];
  issueDate?: Date;
}): Promise<{
  success: boolean;
  error?: { message: string };
  data?: { id: string };
}> {
  try {
    const sessionUser = await getRequiredDashboardSessionUser();
    const transmittalId = crypto.randomUUID();
    const issuedAt = input.issueDate || new Date();

    await db.insert(transmittals).values({
      id: transmittalId,
      projectId: input.projectId,
      transmittalNumber: input.transmittalNumber,
      subject: input.subject,
      description: input.description,
      purpose: input.purpose || "IFR",
      dueDate: input.dueDate || null,
      sentFrom: sessionUser.id,
      sentTo: input.to,
      ccTo: input.ccUserId || null,
      status: "sent",
      createdAt: issuedAt,
      sentAt: issuedAt,
      notes: input.notes || null,
      images: input.images ? JSON.stringify(input.images) : null,
    });

    if (input.documents.length > 0) {
      await db.insert(transmittalDocuments).values(
        input.documents.map((documentId) => ({
          id: crypto.randomUUID(),
          transmittalId,
          documentId,
          addedAt: new Date(),
        })),
      );
    }

    revalidatePath("/transmittals");
    revalidatePath("/transmittals/new");
    revalidatePath("/reports");
    return { success: true, data: { id: transmittalId } };
  } catch (error) {
    console.error("Failed to create transmittal:", error);
    return {
      success: false,
      error: { message: "Failed to create transmittal" },
    };
  }
}

export async function createTransmittalFromForm(formData: {
  transmittalNumber: string;
  date: string;
  projectId: string;
  recipientId: string;
  purpose: string;
  subject: string;
  dueDate: string;
  remarks: string;
  selectedDocuments: string[];
  fromUserId: string;
}): Promise<{
  success: boolean;
  error?: { message: string };
  data?: { id: string };
}> {
  return createTransmittal({
    projectId: formData.projectId,
    transmittalNumber: formData.transmittalNumber,
    to: formData.recipientId,
    subject: formData.subject,
    documents: formData.selectedDocuments,
    issueDate: formData.date ? new Date(formData.date) : undefined,
    dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
    purpose: formData.purpose,
    description: formData.remarks,
    recipientUserId: formData.recipientId,
  });
}

export async function acknowledgeTransmittal(input: {
  transmittalId: string;
}): Promise<{ success: boolean; error?: { message: string } }> {
  try {
    await db
      .update(transmittals)
      .set({
        status: "acknowledged",
        acknowledgedAt: new Date(),
      })
      .where(eq(transmittals.id, input.transmittalId));

    revalidatePath("/transmittals");
    return { success: true };
  } catch (error) {
    console.error("Failed to acknowledge transmittal:", error);
    return {
      success: false,
      error: { message: "Failed to acknowledge transmittal" },
    };
  }
}

export async function reviewTransmittal(input: {
  transmittalId: string;
  decision: string;
  comments?: string;
  reviewStatus?: string;
  approvalCode?: string;
  attachmentUrl?: string;
  attachmentFileName?: string;
  attachmentFileSize?: number;
}): Promise<{ success: boolean; error?: { message: string } }> {
  try {
    await db
      .update(transmittals)
      .set({
        status: input.reviewStatus || input.decision,
        notes: input.comments || null,
      })
      .where(eq(transmittals.id, input.transmittalId));

    revalidatePath("/transmittals");
    return { success: true };
  } catch (error) {
    console.error("Failed to review transmittal:", error);
    return {
      success: false,
      error: { message: "Failed to review transmittal" },
    };
  }
}
