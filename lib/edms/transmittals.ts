import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  documents,
  projectMembers,
  projects,
  transmittalDocuments,
  transmittals,
  users,
} from "@/lib/schema";

export interface TransmittalData {
  id: string;
  projectId: string;
  projectName: string;
  transmittalNumber: string;
  subject: string;
  sentLabel: string;
  documentCodes: string[];
  documentCount: number;
  recipientName: string;
  sentTo: string;
  purpose: string | null;
  dueDate: string | null;
  status: string;
  createdAt: Date | null;
}

async function getTransmittalDocumentMap() {
  const rows = await db
    .select({
      transmittalId: transmittalDocuments.transmittalId,
      documentNumber: documents.documentNumber,
    })
    .from(transmittalDocuments)
    .innerJoin(documents, eq(transmittalDocuments.documentId, documents.id));

  const map = new Map<string, string[]>();

  for (const row of rows) {
    const existing = map.get(row.transmittalId) || [];
    existing.push(row.documentNumber);
    map.set(row.transmittalId, existing);
  }

  return map;
}

export async function getTransmittalsData(
  projectId?: string,
): Promise<TransmittalData[]> {
  try {
    let query = db
      .select({
        id: transmittals.id,
        projectId: transmittals.projectId,
        transmittalNumber: transmittals.transmittalNumber,
        subject: transmittals.subject,
        createdAt: transmittals.createdAt,
        sentAt: transmittals.sentAt,
        sentTo: transmittals.sentTo,
        purpose: transmittals.purpose,
        dueDate: transmittals.dueDate,
        status: transmittals.status,
        projectName: projects.name,
        recipientName: users.name,
      })
      .from(transmittals)
      .leftJoin(projects, eq(transmittals.projectId, projects.id))
      .leftJoin(users, eq(transmittals.sentTo, users.id))
      .$dynamic();

    if (projectId) {
      query = query.where(eq(transmittals.projectId, projectId));
    }

    const [transmittalRows, documentMap] = await Promise.all([
      query.orderBy(desc(transmittals.createdAt)),
      getTransmittalDocumentMap(),
    ]);

    return transmittalRows.map((transmittal) => {
      const documentCodes = documentMap.get(transmittal.id) || [];

      return {
        id: transmittal.id,
        projectId: transmittal.projectId,
        projectName: transmittal.projectName || "Unknown project",
        transmittalNumber: transmittal.transmittalNumber,
        subject: transmittal.subject,
        sentLabel: transmittal.sentAt
          ? new Date(transmittal.sentAt).toLocaleDateString()
          : "Not sent",
        documentCodes,
        documentCount: documentCodes.length,
        recipientName: transmittal.recipientName || transmittal.sentTo,
        sentTo: transmittal.sentTo,
        purpose: transmittal.purpose,
        dueDate: transmittal.dueDate
          ? new Date(transmittal.dueDate).toLocaleDateString()
          : null,
        status: transmittal.status,
        createdAt: transmittal.createdAt,
      };
    });
  } catch (error) {
    console.error("Error fetching transmittals:", error);
    return [];
  }
}

export async function getIncomingTransmittals(
  projectId: string,
): Promise<TransmittalData[]> {
  return getTransmittalsData(projectId);
}

export async function getTransmittalManagementData(_sessionUser: unknown) {
  const [
    transmittalsData,
    projectRows,
    projectMemberRows,
    directoryRows,
    documentRows,
  ] = await Promise.all([
    getTransmittalsData(),
    db
      .select({
        id: projects.id,
        name: projects.name,
        projectNumber: projects.projectNumber,
      })
      .from(projects)
      .orderBy(desc(projects.createdAt)),
    db
      .select({
        id: users.id,
        projectId: projectMembers.projectId,
        name: users.name,
        email: users.email,
        role: projectMembers.role,
      })
      .from(projectMembers)
      .innerJoin(users, eq(projectMembers.userId, users.id)),
    db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
      })
      .from(users),
    db
      .select({
        id: documents.id,
        projectId: documents.projectId,
        documentNumber: documents.documentNumber,
        title: documents.title,
        revision: documents.revision,
        status: documents.status,
      })
      .from(documents)
      .orderBy(desc(documents.uploadedAt)),
  ]);

  const membersByProject = new Map<string, typeof projectMemberRows>();
  for (const member of projectMemberRows) {
    const existing = membersByProject.get(member.projectId) || [];
    existing.push(member);
    membersByProject.set(member.projectId, existing);
  }

  const members = projectRows.flatMap((project) => {
    const projectMembersForProject = membersByProject.get(project.id);

    if (projectMembersForProject && projectMembersForProject.length > 0) {
      return projectMembersForProject.map((member) => ({
        id: member.id,
        projectId: member.projectId,
        name: member.name,
        email: member.email,
        role: member.role || "member",
      }));
    }

    return directoryRows.map((user) => ({
      id: user.id,
      projectId: project.id,
      name: user.name,
      email: user.email,
      role: user.role || "user",
    }));
  });

  const pendingReview = transmittalsData.filter(
    (transmittal) =>
      transmittal.status === "draft" || transmittal.status === "pending",
  ).length;
  const acknowledged = transmittalsData.filter(
    (transmittal) => transmittal.status === "acknowledged",
  ).length;

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const sentThisWeek = transmittalsData.filter((transmittal) => {
    return Boolean(
      transmittal.createdAt && transmittal.createdAt >= oneWeekAgo,
    );
  }).length;

  return {
    projects: projectRows.map((project) => ({
      ...project,
      code: project.projectNumber || project.id,
    })),
    members,
    documents: documentRows,
    transmittals: transmittalsData,
    metrics: [
      {
        label: "Total Transmittals",
        value: String(transmittalsData.length),
        description: "All transmittals in system",
        tone: "blue" as const,
        icon: "transmittals" as const,
      },
      {
        label: "Pending Review",
        value: String(pendingReview),
        description: "Awaiting approval",
        tone: "amber" as const,
        icon: "reviews" as const,
      },
      {
        label: "Sent This Week",
        value: String(sentThisWeek),
        description: "Transmittals sent this week",
        tone: "emerald" as const,
        icon: "transmittals" as const,
      },
      {
        label: "Acknowledged",
        value: String(acknowledged),
        description: "Acknowledged transmittals",
        tone: "blue" as const,
        icon: "transmittals" as const,
      },
    ],
    isUsingFallbackData: false,
    statusMessage: "Data loaded successfully",
  };
}

export async function getTransmittals(projectId?: string) {
  return getTransmittalsData(projectId);
}
