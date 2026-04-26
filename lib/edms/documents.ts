import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { documents, projects } from "@/lib/schema";

export interface DocumentData {
  id: string;
  projectId: string;
  documentNumber: string;
  title: string;
  discipline: string | null;
  category: string | null;
  fileSize: string | null;
  revision: string | null;
  status: string;
  author: string | null;
  uploadedLabel: string;
  projectName: string | null;
}

export async function getDocumentsData(
  projectId?: string,
): Promise<DocumentData[]> {
  // TODO: Run database migration to create documents table
  // Migration file: drizzle/0002_wide_forgotten_one.sql
  // Run: bunx turso db execute quadra-manfrexistence --location aws-ap-northeast-1 -f drizzle/0002_wide_forgotten_one.sql
  try {
    let query = db
      .select({
        id: documents.id,
        projectId: documents.projectId,
        documentNumber: documents.documentNumber,
        title: documents.title,
        discipline: documents.discipline,
        category: documents.category,
        fileSize: documents.fileSize,
        revision: documents.revision,
        status: documents.status,
        uploadedBy: documents.uploadedBy,
        uploadedAt: documents.uploadedAt,
        projectName: projects.name,
      })
      .from(documents)
      .leftJoin(projects, eq(documents.projectId, projects.id))
      .$dynamic();

    if (projectId) {
      query = query.where(eq(documents.projectId, projectId));
    }

    const allDocuments = await query.orderBy(desc(documents.uploadedAt));

    return allDocuments.map((doc) => ({
      id: doc.id,
      projectId: doc.projectId,
      documentNumber: doc.documentNumber,
      title: doc.title,
      discipline: doc.discipline,
      category: doc.category,
      fileSize: doc.fileSize ? `${(doc.fileSize / 1024).toFixed(2)} KB` : null,
      revision: doc.revision,
      status: doc.status,
      author: doc.uploadedBy,
      uploadedLabel: new Date(doc.uploadedAt).toLocaleDateString(),
      projectName: doc.projectName,
    }));
  } catch (error) {
    console.error("Error fetching documents:", error);
    return [];
  }
}

export async function getDocumentManagementData(_sessionUser: any) {
  try {
    const documentsData = await getDocumentsData();

    const approvedDocuments = documentsData.filter(
      (d) => d.status === "approved",
    );
    const pendingDocuments = documentsData.filter(
      (d) => d.status === "pending",
    );
    const rejectedDocuments = documentsData.filter(
      (d) => d.status === "rejected",
    );

    return {
      documents: documentsData,
      metrics: [
        {
          label: "Total Documents",
          value: documentsData.length.toString(),
          description: `${documentsData.length} total documents`,
          tone: "blue" as const,
          icon: "documents" as const,
        },
        {
          label: "Approved",
          value: approvedDocuments.length.toString(),
          description: `${approvedDocuments.length} documents approved`,
          tone: "emerald" as const,
          icon: "reviews" as const,
        },
        {
          label: "Pending",
          value: pendingDocuments.length.toString(),
          description: `${pendingDocuments.length} documents pending`,
          tone: "amber" as const,
          icon: "transmittals" as const,
        },
        {
          label: "Rejected",
          value: rejectedDocuments.length.toString(),
          description: `${rejectedDocuments.length} documents rejected`,
          tone: "rose" as const,
          icon: "notifications" as const,
        },
      ],
      isUsingFallbackData: false,
      statusMessage: "Document data loaded successfully",
    };
  } catch (error) {
    console.error("Error fetching document management data:", error);
    return {
      documents: [] as DocumentData[],
      metrics: [
        {
          label: "Total Documents",
          value: "0",
          description: "Error loading data",
          tone: "blue" as const,
          icon: "documents" as const,
        },
        {
          label: "Approved",
          value: "0",
          description: "Error loading data",
          tone: "emerald" as const,
          icon: "reviews" as const,
        },
        {
          label: "Pending",
          value: "0",
          description: "Error loading data",
          tone: "amber" as const,
          icon: "transmittals" as const,
        },
        {
          label: "Rejected",
          value: "0",
          description: "Error loading data",
          tone: "rose" as const,
          icon: "notifications" as const,
        },
      ],
      isUsingFallbackData: true,
      statusMessage: "Error loading document data",
    };
  }
}

export async function getDocuments(projectId?: string) {
  return getDocumentsData(projectId);
}

export async function getDocumentControlData(sessionUser: any) {
  const [data, projectRows] = await Promise.all([
    getDocumentManagementData(sessionUser),
    db
      .select({
        id: projects.id,
        name: projects.name,
        projectNumber: projects.projectNumber,
      })
      .from(projects)
      .orderBy(desc(projects.createdAt)),
  ]);

  const availableDisciplines = Array.from(
    new Set(
      data.documents
        .map((document) => document.discipline?.trim())
        .filter((discipline): discipline is string => Boolean(discipline)),
    ),
  ).sort((left, right) => left.localeCompare(right));

  return {
    ...data,
    projects: projectRows,
    availableDisciplines,
  };
}
