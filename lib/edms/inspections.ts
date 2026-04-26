import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { getFirstAccessibleProjectId } from "@/lib/edms/access";
import { inspectionRequests } from "@/lib/schema";

export async function getInspectionsManagementData(sessionUser: any) {
  try {
    const projectId = await getFirstAccessibleProjectId(sessionUser);
    const inspections = await getInspections(projectId ?? undefined);
    const passed = inspections.filter((item) => item.status === "pass");
    const failed = inspections.filter((item) => item.status === "fail");
    const pending = inspections.filter(
      (item) => item.status !== "pass" && item.status !== "fail",
    );

    return {
      inspections,
      isUsingFallbackData: false,
      metrics: [
        {
          description: `${inspections.length} inspections logged`,
          icon: "documents" as const,
          label: "Total Inspections",
          tone: "blue" as const,
          value: inspections.length.toString(),
        },
        {
          description: `${passed.length} inspections passed`,
          icon: "reviews" as const,
          label: "Passed",
          tone: "emerald" as const,
          value: passed.length.toString(),
        },
        {
          description: `${failed.length} inspections failed`,
          icon: "transmittals" as const,
          label: "Failed",
          tone: "amber" as const,
          value: failed.length.toString(),
        },
        {
          description: `${pending.length} inspections pending result`,
          icon: "notifications" as const,
          label: "Pending",
          tone: "rose" as const,
          value: pending.length.toString(),
        },
      ],
      statusMessage: null,
    };
  } catch (error) {
    console.error("Error fetching inspections data:", error);
    return {
      inspections: [],
      isUsingFallbackData: true,
      metrics: [],
      statusMessage: "Error loading inspections data",
    };
  }
}

export async function getInspectionsPageData(sessionUser: any) {
  return getInspectionsManagementData(sessionUser);
}

export async function getInspections(projectId?: string) {
  try {
    if (!projectId) {
      return [];
    }

    return await db
      .select({
        description: inspectionRequests.deficiencies,
        id: inspectionRequests.id,
        inspectionDate: inspectionRequests.scheduledDate,
        inspectionNumber: inspectionRequests.inspectionNumber,
        inspector: inspectionRequests.inspector,
        location: inspectionRequests.location,
        status: inspectionRequests.results,
        title: inspectionRequests.type,
      })
      .from(inspectionRequests)
      .where(eq(inspectionRequests.projectId, projectId))
      .orderBy(desc(inspectionRequests.scheduledDate));
  } catch (error) {
    console.error("Error fetching inspections:", error);
    return [];
  }
}
