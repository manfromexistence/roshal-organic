import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { getFirstAccessibleProjectId } from "@/lib/edms/access";
import { commissioningChecklists } from "@/lib/schema";

export interface CommissioningChecklistData {
  checklistNumber: string;
  completedAt: Date | null;
  description: string;
  id: string;
  projectId: string;
  status: string;
  system: string;
  updatedAt: Date;
}

export async function getCommissioningChecklists(
  projectId?: string,
): Promise<CommissioningChecklistData[]> {
  try {
    let query = db
      .select({
        checklistNumber: commissioningChecklists.checklistNumber,
        completedAt: commissioningChecklists.completedAt,
        description: commissioningChecklists.description,
        id: commissioningChecklists.id,
        projectId: commissioningChecklists.projectId,
        status: commissioningChecklists.status,
        system: commissioningChecklists.system,
        updatedAt: commissioningChecklists.updatedAt,
      })
      .from(commissioningChecklists)
      .$dynamic();

    if (projectId) {
      query = query.where(eq(commissioningChecklists.projectId, projectId));
    }

    return await query.orderBy(desc(commissioningChecklists.updatedAt));
  } catch (error) {
    console.error("Error fetching commissioning checklists:", error);
    return [];
  }
}

export async function getCommissioningManagementData(sessionUser: any) {
  try {
    const projectId = await getFirstAccessibleProjectId(sessionUser);
    const commissioningItems = await getCommissioningChecklists(
      projectId ?? undefined,
    );

    const completed = commissioningItems.filter(
      (item) => item.status === "completed",
    );
    const inProgress = commissioningItems.filter(
      (item) => item.status === "in_progress",
    );
    const pending = commissioningItems.filter(
      (item) => item.status !== "completed" && item.status !== "in_progress",
    );

    return {
      commissioningItems,
      isUsingFallbackData: false,
      metrics: [
        {
          description: `${commissioningItems.length} checklist items loaded`,
          icon: "documents" as const,
          label: "Total Items",
          tone: "blue" as const,
          value: commissioningItems.length.toString(),
        },
        {
          description: `${completed.length} completed checklists`,
          icon: "reviews" as const,
          label: "Completed",
          tone: "emerald" as const,
          value: completed.length.toString(),
        },
        {
          description: `${inProgress.length} actively progressing`,
          icon: "transmittals" as const,
          label: "In Progress",
          tone: "amber" as const,
          value: inProgress.length.toString(),
        },
        {
          description: `${pending.length} waiting to start`,
          icon: "notifications" as const,
          label: "Pending",
          tone: "rose" as const,
          value: pending.length.toString(),
        },
      ],
      statusMessage: null,
    };
  } catch (error) {
    console.error("Error fetching commissioning management data:", error);
    return {
      commissioningItems: [] as CommissioningChecklistData[],
      isUsingFallbackData: true,
      metrics: [
        {
          description: "Error loading data",
          icon: "documents" as const,
          label: "Total Items",
          tone: "blue" as const,
          value: "0",
        },
        {
          description: "Error loading data",
          icon: "reviews" as const,
          label: "Completed",
          tone: "emerald" as const,
          value: "0",
        },
        {
          description: "Error loading data",
          icon: "transmittals" as const,
          label: "In Progress",
          tone: "amber" as const,
          value: "0",
        },
        {
          description: "Error loading data",
          icon: "notifications" as const,
          label: "Pending",
          tone: "rose" as const,
          value: "0",
        },
      ],
      statusMessage: "Error loading commissioning data",
    };
  }
}

export async function getCommissioningPageData(sessionUser: any) {
  return getCommissioningManagementData(sessionUser);
}
