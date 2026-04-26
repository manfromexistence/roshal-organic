import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { getFirstAccessibleProjectId } from "@/lib/edms/access";
import { extensionOfTimeRequests } from "@/lib/schema";

export async function getExtensionOfTimeManagementData(sessionUser: any) {
  try {
    const projectId = await getFirstAccessibleProjectId(sessionUser);
    const eotRequests = await getExtensionOfTimeRequests(
      projectId ?? undefined,
    );
    const approved = eotRequests.filter((item) => item.status === "approved");
    const rejected = eotRequests.filter((item) => item.status === "rejected");
    const pending = eotRequests.filter((item) => item.status === "pending");

    return {
      eotRequests,
      isUsingFallbackData: false,
      metrics: [
        {
          description: `${eotRequests.length} extension requests logged`,
          icon: "documents" as const,
          label: "Total EOTs",
          tone: "blue" as const,
          value: eotRequests.length.toString(),
        },
        {
          description: `${approved.length} extension requests approved`,
          icon: "reviews" as const,
          label: "Approved",
          tone: "emerald" as const,
          value: approved.length.toString(),
        },
        {
          description: `${pending.length} extension requests awaiting review`,
          icon: "transmittals" as const,
          label: "Pending",
          tone: "amber" as const,
          value: pending.length.toString(),
        },
        {
          description: `${rejected.length} extension requests rejected`,
          icon: "notifications" as const,
          label: "Rejected",
          tone: "rose" as const,
          value: rejected.length.toString(),
        },
      ],
      statusMessage: null,
    };
  } catch (error) {
    console.error("Error fetching extension of time data:", error);
    return {
      eotRequests: [],
      isUsingFallbackData: true,
      metrics: [],
      statusMessage: "Error loading extension of time data",
    };
  }
}

export async function getExtensionOfTimePageData(sessionUser: any) {
  return getExtensionOfTimeManagementData(sessionUser);
}

export async function getExtensionOfTimeRequests(projectId?: string) {
  try {
    if (!projectId) {
      return [];
    }

    const requests = await db
      .select({
        delayDays: extensionOfTimeRequests.requestedDays,
        id: extensionOfTimeRequests.id,
        reason: extensionOfTimeRequests.reason,
        requestDate: extensionOfTimeRequests.createdAt,
        requestNumber: extensionOfTimeRequests.eotNumber,
        status: extensionOfTimeRequests.approvalStatus,
      })
      .from(extensionOfTimeRequests)
      .where(eq(extensionOfTimeRequests.projectId, projectId))
      .orderBy(desc(extensionOfTimeRequests.createdAt));

    return requests;
  } catch (error) {
    console.error("Error fetching extension of time requests:", error);
    return [];
  }
}
