import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { getFirstAccessibleProjectId } from "@/lib/edms/access";
import { safetyObservations, users } from "@/lib/schema";

export async function getSafetyObservationsManagementData(sessionUser: any) {
  try {
    const projectId = await getFirstAccessibleProjectId(sessionUser);
    const observations = await getSafetyObservations(projectId ?? undefined);
    const open = observations.filter((item) => item.status === "open");
    const closed = observations.filter((item) => item.status === "closed");
    const critical = observations.filter(
      (item) => item.severity === "critical",
    );

    return {
      isUsingFallbackData: false,
      metrics: [
        {
          description: `${observations.length} observations logged`,
          icon: "documents" as const,
          label: "Total Observations",
          tone: "blue" as const,
          value: observations.length.toString(),
        },
        {
          description: `${open.length} observations still open`,
          icon: "reviews" as const,
          label: "Open",
          tone: "emerald" as const,
          value: open.length.toString(),
        },
        {
          description: `${closed.length} observations closed out`,
          icon: "transmittals" as const,
          label: "Closed",
          tone: "amber" as const,
          value: closed.length.toString(),
        },
        {
          description: `${critical.length} critical safety observations`,
          icon: "notifications" as const,
          label: "Critical",
          tone: "rose" as const,
          value: critical.length.toString(),
        },
      ],
      observations,
      statusMessage: null,
    };
  } catch (error) {
    console.error("Error fetching safety observations data:", error);
    return {
      isUsingFallbackData: true,
      metrics: [],
      observations: [],
      statusMessage: "Error loading safety observations data",
    };
  }
}

export async function getSafetyObservationsPageData(sessionUser: any) {
  return getSafetyObservationsManagementData(sessionUser);
}

export async function getSafetyObservations(projectId?: string) {
  try {
    if (!projectId) {
      return [];
    }

    return await db
      .select({
        category: safetyObservations.type,
        description: safetyObservations.description,
        id: safetyObservations.id,
        location: safetyObservations.location,
        observationNumber: safetyObservations.observationNumber,
        reportedAt: safetyObservations.createdAt,
        reportedBy: users.name,
        severity: safetyObservations.severity,
        status: safetyObservations.status,
      })
      .from(safetyObservations)
      .leftJoin(users, eq(safetyObservations.observedBy, users.id))
      .where(eq(safetyObservations.projectId, projectId))
      .orderBy(desc(safetyObservations.createdAt));
  } catch (error) {
    console.error("Error fetching safety observations:", error);
    return [];
  }
}
