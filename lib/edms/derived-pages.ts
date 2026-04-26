import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { getFirstAccessibleProjectId } from "@/lib/edms/access";
import {
  activityLog,
  documents,
  projectMembers,
  projects,
  transmittalDocuments,
  transmittals,
  users,
} from "@/lib/schema";

function getStakeholderShort(name: string) {
  const parts = name.split(/\s+/).filter(Boolean).slice(0, 3);

  if (parts.length === 0) {
    return "USR";
  }

  return parts.map((part) => part[0]?.toUpperCase() || "").join("");
}

function getMatrixRowKey(discipline: string, docType: string) {
  return `${discipline}::${docType}`;
}

function humanizeIdentifier(value: string | null | undefined) {
  if (!value) {
    return "item";
  }

  return value
    .replace(/[_-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function toDate(value: Date | number | string | null | undefined) {
  if (value instanceof Date) {
    return value;
  }

  return new Date(value ?? Date.now());
}

function getAuditActionLabel(action: string, entityType: string) {
  const actionKey = action.trim().toLowerCase();
  const entityLabel = humanizeIdentifier(entityType).toLowerCase();

  const actionMap: Record<string, string> = {
    create: `created ${entityLabel}`,
    created: `created ${entityLabel}`,
    update: `updated ${entityLabel}`,
    updated: `updated ${entityLabel}`,
    upload: `uploaded ${entityLabel}`,
    uploaded: `uploaded ${entityLabel}`,
    assign: `assigned ${entityLabel}`,
    assigned: `assigned ${entityLabel}`,
    send: `sent ${entityLabel}`,
    sent: `sent ${entityLabel}`,
    approve: `approved ${entityLabel}`,
    approved: `approved ${entityLabel}`,
    issue: `issued ${entityLabel}`,
    issued: `issued ${entityLabel}`,
  };

  return (
    actionMap[actionKey] ||
    `${actionKey.replace(/[_-]+/g, " ")} ${entityLabel}`.trim()
  );
}

export async function getAuditPageData(
  sessionUser: any,
  params: { query?: string; entityType?: string },
) {
  try {
    const projectId = await getFirstAccessibleProjectId(sessionUser);

    if (!projectId) {
      return {
        metrics: [
          {
            label: "Total Events",
            value: "0",
            description: "No accessible project selected",
            tone: "blue" as const,
            icon: "documents" as const,
          },
          {
            label: "Today",
            value: "0",
            description: "No accessible project selected",
            tone: "emerald" as const,
            icon: "reviews" as const,
          },
          {
            label: "This Week",
            value: "0",
            description: "No accessible project selected",
            tone: "amber" as const,
            icon: "transmittals" as const,
          },
          {
            label: "This Month",
            value: "0",
            description: "No accessible project selected",
            tone: "rose" as const,
            icon: "notifications" as const,
          },
        ],
        entries: [] as Array<{
          id: string;
          timestamp: string;
          actor: string;
          action: string;
          actionLabel: string;
          detail: string;
        }>,
        isUsingFallbackData: false,
        statusMessage: "No accessible project found for the audit trail.",
      };
    }

    const auditRows = await db
      .select({
        id: activityLog.id,
        createdAt: activityLog.createdAt,
        action: activityLog.action,
        entityType: activityLog.entityType,
        entityId: activityLog.entityId,
        entityName: activityLog.entityName,
        description: activityLog.description,
        actorName: users.name,
        projectName: projects.name,
      })
      .from(activityLog)
      .leftJoin(users, eq(activityLog.userId, users.id))
      .leftJoin(projects, eq(activityLog.projectId, projects.id))
      .where(eq(activityLog.projectId, projectId))
      .orderBy(desc(activityLog.createdAt))
      .limit(250);

    const normalizedEntityType = params.entityType?.trim().toLowerCase();
    const normalizedQuery = params.query?.trim().toLowerCase();

    const filteredRows = auditRows.filter((row) => {
      const matchesEntityType =
        !normalizedEntityType ||
        row.entityType.toLowerCase() === normalizedEntityType;

      if (!matchesEntityType) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const haystack = [
        row.actorName,
        row.action,
        row.entityType,
        row.entityName,
        row.description,
        row.projectName,
        row.entityId,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });

    const metricRows =
      normalizedEntityType || normalizedQuery ? filteredRows : auditRows;

    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const startOfWeek = new Date(startOfToday);
    const weekday = startOfWeek.getDay();
    const distanceToMonday = (weekday + 6) % 7;
    startOfWeek.setDate(startOfWeek.getDate() - distanceToMonday);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const entries = filteredRows.map((row) => {
      const createdAt = toDate(row.createdAt);
      const actor = row.actorName?.trim() || "System";
      const actionLabel = getAuditActionLabel(row.action, row.entityType);
      const subject =
        row.entityName?.trim() ||
        `${humanizeIdentifier(row.entityType)} ${row.entityId.slice(0, 8)}`;

      return {
        id: row.id,
        timestamp: createdAt.toLocaleString([], {
          year: "numeric",
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }),
        actor,
        action: row.action.toLowerCase(),
        actionLabel,
        detail:
          row.description?.trim() || `${subject} recorded in the audit log.`,
      };
    });

    return {
      metrics: [
        {
          label: "Total Events",
          value: metricRows.length.toString(),
          description: "Events visible for the active project scope",
          tone: "blue" as const,
          icon: "documents" as const,
        },
        {
          label: "Today",
          value: metricRows
            .filter((row) => toDate(row.createdAt) >= startOfToday)
            .length.toString(),
          description: "Events logged since midnight",
          tone: "emerald" as const,
          icon: "reviews" as const,
        },
        {
          label: "This Week",
          value: metricRows
            .filter((row) => toDate(row.createdAt) >= startOfWeek)
            .length.toString(),
          description: "Events logged since Monday",
          tone: "amber" as const,
          icon: "transmittals" as const,
        },
        {
          label: "This Month",
          value: metricRows
            .filter((row) => toDate(row.createdAt) >= startOfMonth)
            .length.toString(),
          description: "Events logged this calendar month",
          tone: "rose" as const,
          icon: "notifications" as const,
        },
      ],
      entries,
      isUsingFallbackData: false,
      statusMessage:
        entries.length > 0
          ? "Live audit trail loaded from the activity log."
          : "No audit entries matched the current project scope and filters.",
    };
  } catch (error) {
    console.error("Error loading audit trail data:", error);
    return {
      metrics: [
        {
          label: "Total Events",
          value: "0",
          description: "Audit data could not be loaded",
          tone: "blue" as const,
          icon: "documents" as const,
        },
        {
          label: "Today",
          value: "0",
          description: "Audit data could not be loaded",
          tone: "emerald" as const,
          icon: "reviews" as const,
        },
        {
          label: "This Week",
          value: "0",
          description: "Audit data could not be loaded",
          tone: "amber" as const,
          icon: "transmittals" as const,
        },
        {
          label: "This Month",
          value: "0",
          description: "Audit data could not be loaded",
          tone: "rose" as const,
          icon: "notifications" as const,
        },
      ],
      entries: [] as Array<{
        id: string;
        timestamp: string;
        actor: string;
        action: string;
        actionLabel: string;
        detail: string;
      }>,
      isUsingFallbackData: true,
      statusMessage: "Error loading audit trail data",
    };
  }
}

export async function getMatrixPageData(sessionUser: any) {
  try {
    const projectId = await getFirstAccessibleProjectId(sessionUser);

    if (!projectId) {
      return {
        rows: [] as Array<{
          key: string;
          discipline: string;
          docType: string;
          distribution: Record<string, number>;
          issuedDocuments: number;
        }>,
        stakeholders: [] as Array<{
          id: string;
          name: string;
          short: string;
          role: string;
          email: string;
        }>,
        totalLinks: 0,
        isUsingFallbackData: false,
        statusMessage:
          "No accessible project found for the distribution matrix.",
      };
    }

    const [projectMemberRows, directoryRows, documentRows, issuedRows] =
      await Promise.all([
        db
          .select({
            id: users.id,
            name: users.name,
            email: users.email,
            role: projectMembers.role,
          })
          .from(projectMembers)
          .innerJoin(users, eq(projectMembers.userId, users.id))
          .where(eq(projectMembers.projectId, projectId))
          .orderBy(desc(projectMembers.assignedAt)),
        db
          .select({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
          })
          .from(users)
          .orderBy(desc(users.createdAt)),
        db
          .select({
            id: documents.id,
            discipline: documents.discipline,
            category: documents.category,
            documentType: documents.documentType,
          })
          .from(documents)
          .where(eq(documents.projectId, projectId))
          .orderBy(desc(documents.uploadedAt)),
        db
          .select({
            recipientId: transmittals.sentTo,
            discipline: documents.discipline,
            category: documents.category,
            documentType: documents.documentType,
          })
          .from(transmittalDocuments)
          .innerJoin(
            transmittals,
            eq(transmittalDocuments.transmittalId, transmittals.id),
          )
          .innerJoin(
            documents,
            eq(transmittalDocuments.documentId, documents.id),
          )
          .where(eq(transmittals.projectId, projectId)),
      ]);

    const stakeholdersSource =
      projectMemberRows.length > 0 ? projectMemberRows : directoryRows;
    const stakeholders = stakeholdersSource.map((stakeholder) => ({
      id: stakeholder.id,
      name: stakeholder.name,
      short: getStakeholderShort(stakeholder.name),
      role: stakeholder.role || "member",
      email: stakeholder.email,
    }));

    const stakeholderIds = stakeholders.map((stakeholder) => stakeholder.id);
    const baseDistribution = Object.fromEntries(
      stakeholderIds.map((stakeholderId) => [stakeholderId, 0]),
    ) as Record<string, number>;

    const rowMap = new Map<
      string,
      {
        key: string;
        discipline: string;
        docType: string;
        distribution: Record<string, number>;
        issuedDocuments: number;
      }
    >();

    for (const document of documentRows) {
      const discipline = document.discipline?.trim() || "General";
      const docType =
        document.category?.trim() || document.documentType?.trim() || "General";
      const key = getMatrixRowKey(discipline, docType);

      if (!rowMap.has(key)) {
        rowMap.set(key, {
          key,
          discipline,
          docType,
          distribution: { ...baseDistribution },
          issuedDocuments: 0,
        });
      }
    }

    for (const issuedRow of issuedRows) {
      const discipline = issuedRow.discipline?.trim() || "General";
      const docType =
        issuedRow.category?.trim() ||
        issuedRow.documentType?.trim() ||
        "General";
      const key = getMatrixRowKey(discipline, docType);
      const existing =
        rowMap.get(key) ||
        (() => {
          const next = {
            key,
            discipline,
            docType,
            distribution: { ...baseDistribution },
            issuedDocuments: 0,
          };
          rowMap.set(key, next);
          return next;
        })();

      existing.issuedDocuments += 1;

      if (issuedRow.recipientId in existing.distribution) {
        existing.distribution[issuedRow.recipientId] += 1;
      }
    }

    const rows = Array.from(rowMap.values()).sort((left, right) => {
      if (left.discipline === right.discipline) {
        return left.docType.localeCompare(right.docType);
      }

      return left.discipline.localeCompare(right.discipline);
    });

    const totalLinks = rows.reduce(
      (sum, row) =>
        sum +
        Object.values(row.distribution).reduce(
          (rowSum, value) => rowSum + value,
          0,
        ),
      0,
    );

    return {
      rows,
      stakeholders,
      totalLinks,
      isUsingFallbackData: false,
      statusMessage:
        totalLinks > 0
          ? "Distribution matrix derived from live project transmittals."
          : "Distribution matrix initialized from the current document register.",
    };
  } catch (error) {
    console.error("Error loading distribution matrix data:", error);
    return {
      rows: [] as Array<{
        key: string;
        discipline: string;
        docType: string;
        distribution: Record<string, number>;
        issuedDocuments: number;
      }>,
      stakeholders: [] as Array<{
        id: string;
        name: string;
        short: string;
        role: string;
        email: string;
      }>,
      totalLinks: 0,
      isUsingFallbackData: true,
      statusMessage: "Error loading distribution matrix data",
    };
  }
}
