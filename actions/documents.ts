"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import {
  generateDocumentNumber,
  getDocumentTitleFromFileName,
} from "@/lib/edms/form-helpers";
import { canDeleteEdmsContent, canManageEdmsContent } from "@/lib/edms/rbac";
import { getRequiredDashboardSessionUser } from "@/lib/edms/session";
import { documents, documentVersions, projects } from "@/lib/schema";

export async function createDocument(input: {
  projectId: string;
  title: string;
  description?: string;
  documentNumber?: string;
  revision?: string;
  status?: string;
  discipline?: string;
  category?: string;
  version?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  fileUrl?: string;
  tags?: string;
  images?: string[];
}): Promise<{
  success: boolean;
  error?: { message: string };
  data?: { documentNumber: string };
}> {
  try {
    const sessionUser = await getRequiredDashboardSessionUser();

    if (!canManageEdmsContent(sessionUser.role)) {
      return {
        success: false,
        error: { message: "You do not have permission to create documents." },
      };
    }

    const documentId = crypto.randomUUID();
    const docNumber = input.documentNumber || `DOC-${Date.now()}`;

    await db.insert(documents).values({
      id: documentId,
      projectId: input.projectId,
      documentNumber: docNumber,
      title: input.title,
      description: input.description,
      discipline: input.discipline,
      category: input.category,
      documentType: input.category || "design",
      version: input.version || "1.0",
      revision: input.revision || "0",
      isLatestVersion: true,
      fileName: input.fileName || "",
      fileSize: input.fileSize,
      fileType: input.fileType,
      fileUrl: input.fileUrl || "",
      status: input.status || "draft",
      uploadedAt: new Date(),
      updatedAt: new Date(),
      images: input.images ? JSON.stringify(input.images) : null,
    });

    revalidatePath("/documents");
    return {
      success: true,
      data: { documentNumber: docNumber },
    };
  } catch (error) {
    console.error("Failed to create document:", error);
    return {
      success: false,
      error: { message: "Failed to create document" },
    };
  }
}

export async function createDocumentsBatch(input: {
  projectId: string;
  discipline: string;
  category: string;
  status: string;
  files: Array<{
    fileName: string;
    fileType: string;
    fileUrl: string;
    fileSize?: number;
    title?: string;
  }>;
}): Promise<{
  success: boolean;
  error?: { message: string };
  data?: { created: string[]; failed: string[] };
}> {
  try {
    const sessionUser = await getRequiredDashboardSessionUser();

    if (!canManageEdmsContent(sessionUser.role)) {
      return {
        success: false,
        error: { message: "You do not have permission to upload documents." },
      };
    }

    const [project] = await db
      .select({ projectNumber: projects.projectNumber })
      .from(projects)
      .where(eq(projects.id, input.projectId))
      .limit(1);

    const created: string[] = [];
    const failed: string[] = [];

    for (const file of input.files) {
      try {
        const documentNumber = generateDocumentNumber(project?.projectNumber);

        await db.insert(documents).values({
          id: crypto.randomUUID(),
          projectId: input.projectId,
          documentNumber,
          title:
            file.title?.trim() || getDocumentTitleFromFileName(file.fileName),
          discipline: input.discipline || null,
          category: input.category || null,
          documentType: input.category || "design",
          version: "1.0",
          revision: "0",
          isLatestVersion: true,
          fileName: file.fileName,
          fileSize: file.fileSize,
          fileType: file.fileType,
          fileUrl: file.fileUrl,
          status: input.status || "draft",
          uploadedAt: new Date(),
          updatedAt: new Date(),
        });

        created.push(documentNumber);
      } catch (error) {
        console.error(
          `Failed to create batch document for ${file.fileName}:`,
          error,
        );
        failed.push(file.fileName);
      }
    }

    revalidatePath("/documents");
    revalidatePath("/bulk-upload");
    return { success: true, data: { created, failed } };
  } catch (error) {
    console.error("Failed to create document batch:", error);
    return {
      success: false,
      error: { message: "Failed to upload the document batch." },
    };
  }
}

export async function updateDocument(input: {
  id: string;
  title?: string;
  description?: string;
  status?: string;
}): Promise<{ success: boolean; error?: { message: string } }> {
  const sessionUser = await getRequiredDashboardSessionUser();

  if (!canManageEdmsContent(sessionUser.role)) {
    return {
      success: false,
      error: { message: "You do not have permission to update documents." },
    };
  }

  // TODO: Implement document update
  console.log("Updating document:", input);
  revalidatePath("/documents");
  return { success: true };
}

export async function deleteDocument(
  id: string,
): Promise<{ success: boolean; error?: { message: string } }> {
  const sessionUser = await getRequiredDashboardSessionUser();

  if (!canDeleteEdmsContent(sessionUser.role)) {
    return {
      success: false,
      error: { message: "Only admin users can delete documents." },
    };
  }

  // TODO: Implement document deletion
  console.log("Deleting document:", id);
  revalidatePath("/documents");
  return { success: true };
}

export async function createDocumentVersion(input: {
  documentId: string;
  version: string;
  revision: string;
  status: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  fileUrl?: string;
  changeDescription?: string;
}): Promise<{ success: boolean; error?: { message: string } }> {
  try {
    const sessionUser = await getRequiredDashboardSessionUser();

    if (!canManageEdmsContent(sessionUser.role)) {
      return {
        success: false,
        error: {
          message: "You do not have permission to create document versions.",
        },
      };
    }

    const versionId = crypto.randomUUID();

    await db.insert(documentVersions).values({
      id: versionId,
      documentId: input.documentId,
      version: input.version,
      fileName: input.fileName || "",
      fileUrl: input.fileUrl || "",
      fileSize: input.fileSize,
      changeDescription: input.changeDescription,
      uploadedAt: new Date(),
    });

    revalidatePath("/documents");
    return { success: true };
  } catch (error) {
    console.error("Failed to create document version:", error);
    return {
      success: false,
      error: { message: "Failed to create document version" },
    };
  }
}
