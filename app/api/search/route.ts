import { and, desc, eq, like, or } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/edms/session";
import {
  documents,
  documentWorkflows,
  notifications,
  projects,
  transmittals,
} from "@/lib/schema";

type SearchResult = {
  id: string;
  title: string;
  subtitle: string;
  category:
    | "project"
    | "document"
    | "workflow"
    | "transmittal"
    | "notification";
  href: string;
  meta: string;
};

export async function GET(request: Request) {
  const sessionUser = await getSessionUser();

  if (!sessionUser?.id) {
    return NextResponse.json({ results: [] }, { status: 401 });
  }

  const query = new URL(request.url).searchParams.get("q")?.trim();

  if (!query) {
    return NextResponse.json({ results: [] satisfies SearchResult[] });
  }

  const wildcardQuery = `%${query}%`;

  try {
    const [
      projectRows,
      documentRows,
      workflowRows,
      transmittalRows,
      notificationRows,
    ] = await Promise.all([
      db
        .select({
          id: projects.id,
          name: projects.name,
          projectNumber: projects.projectNumber,
          location: projects.location,
          status: projects.status,
        })
        .from(projects)
        .where(
          or(
            like(projects.name, wildcardQuery),
            like(projects.projectNumber, wildcardQuery),
            like(projects.location, wildcardQuery),
          ),
        )
        .orderBy(desc(projects.updatedAt))
        .limit(6),
      db
        .select({
          id: documents.id,
          title: documents.title,
          documentNumber: documents.documentNumber,
          discipline: documents.discipline,
          status: documents.status,
        })
        .from(documents)
        .where(
          or(
            like(documents.title, wildcardQuery),
            like(documents.documentNumber, wildcardQuery),
            like(documents.discipline, wildcardQuery),
          ),
        )
        .orderBy(desc(documents.updatedAt))
        .limit(8),
      db
        .select({
          id: documentWorkflows.id,
          workflowName: documentWorkflows.workflowName,
          status: documentWorkflows.status,
          documentTitle: documents.title,
          documentNumber: documents.documentNumber,
        })
        .from(documentWorkflows)
        .innerJoin(documents, eq(documentWorkflows.documentId, documents.id))
        .where(
          or(
            like(documentWorkflows.workflowName, wildcardQuery),
            like(documents.title, wildcardQuery),
            like(documents.documentNumber, wildcardQuery),
          ),
        )
        .orderBy(desc(documentWorkflows.startedAt))
        .limit(6),
      db
        .select({
          id: transmittals.id,
          transmittalNumber: transmittals.transmittalNumber,
          subject: transmittals.subject,
          purpose: transmittals.purpose,
          status: transmittals.status,
        })
        .from(transmittals)
        .where(
          or(
            like(transmittals.transmittalNumber, wildcardQuery),
            like(transmittals.subject, wildcardQuery),
            like(transmittals.purpose, wildcardQuery),
          ),
        )
        .orderBy(desc(transmittals.createdAt))
        .limit(6),
      db
        .select({
          id: notifications.id,
          title: notifications.title,
          message: notifications.message,
          type: notifications.type,
          actionUrl: notifications.actionUrl,
          isRead: notifications.isRead,
        })
        .from(notifications)
        .where(
          and(
            eq(notifications.userId, sessionUser.id),
            or(
              like(notifications.title, wildcardQuery),
              like(notifications.message, wildcardQuery),
              like(notifications.type, wildcardQuery),
            ),
          ),
        )
        .orderBy(desc(notifications.createdAt))
        .limit(6),
    ]);

    const results: SearchResult[] = [
      ...projectRows.map((project) => ({
        id: project.id,
        title: project.name,
        subtitle: project.projectNumber || "Project",
        category: "project" as const,
        href: `/projects/${project.id}`,
        meta: [project.status, project.location].filter(Boolean).join(" | "),
      })),
      ...documentRows.map((document) => ({
        id: document.id,
        title: document.title,
        subtitle: document.documentNumber,
        category: "document" as const,
        href: `/documents/${document.id}`,
        meta: [document.discipline, document.status]
          .filter(Boolean)
          .join(" | "),
      })),
      ...workflowRows.map((workflow) => ({
        id: workflow.id,
        title: workflow.workflowName || workflow.documentTitle || "Workflow",
        subtitle:
          workflow.documentTitle || workflow.documentNumber || "Workflow item",
        category: "workflow" as const,
        href: `/workflows/${workflow.id}`,
        meta: [workflow.documentNumber, workflow.status]
          .filter(Boolean)
          .join(" | "),
      })),
      ...transmittalRows.map((transmittal) => ({
        id: transmittal.id,
        title: transmittal.subject,
        subtitle: transmittal.transmittalNumber,
        category: "transmittal" as const,
        href: `/transmittals/${transmittal.id}`,
        meta: [transmittal.purpose, transmittal.status]
          .filter(Boolean)
          .join(" | "),
      })),
      ...notificationRows.map((notification) => ({
        id: notification.id,
        title: notification.title,
        subtitle: notification.type,
        category: "notification" as const,
        href: notification.actionUrl || "/notifications",
        meta: notification.isRead ? "Read notification" : "Unread notification",
      })),
    ];

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Error searching EDMS workspace:", error);
    return NextResponse.json({ results: [] satisfies SearchResult[] });
  }
}
