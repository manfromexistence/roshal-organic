import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { getFirstAccessibleProjectId } from "@/lib/edms/access";
import { changeOrders } from "@/lib/schema";

export interface ChangeOrderData {
  approvalStatus: string;
  approvedAt: Date | null;
  approvedBy: string | null;
  changeOrderNumber: string;
  changeValue: number;
  createdAt: Date;
  id: string;
  originalContractValue: number | null;
  projectId: string;
  reason: string;
  updatedAt: Date;
}

export async function getChangeOrdersData(
  projectId?: string,
): Promise<ChangeOrderData[]> {
  try {
    let query = db
      .select({
        approvalStatus: changeOrders.approvalStatus,
        approvedAt: changeOrders.approvedAt,
        approvedBy: changeOrders.approvedBy,
        changeOrderNumber: changeOrders.changeOrderNumber,
        changeValue: changeOrders.changeValue,
        createdAt: changeOrders.createdAt,
        id: changeOrders.id,
        originalContractValue: changeOrders.originalContractValue,
        projectId: changeOrders.projectId,
        reason: changeOrders.reason,
        updatedAt: changeOrders.updatedAt,
      })
      .from(changeOrders)
      .$dynamic();

    if (projectId) {
      query = query.where(eq(changeOrders.projectId, projectId));
    }

    return await query.orderBy(desc(changeOrders.createdAt));
  } catch (error) {
    console.error("Error fetching change orders:", error);
    return [];
  }
}

export async function getChangeOrderManagementData(sessionUser: any) {
  try {
    const projectId = await getFirstAccessibleProjectId(sessionUser);
    const changeOrdersData = await getChangeOrdersData(projectId ?? undefined);

    const approved = changeOrdersData.filter(
      (item) => item.approvalStatus === "approved",
    );
    const rejected = changeOrdersData.filter(
      (item) => item.approvalStatus === "rejected",
    );
    const pending = changeOrdersData.filter(
      (item) =>
        item.approvalStatus !== "approved" &&
        item.approvalStatus !== "rejected",
    );

    return {
      changeOrders: changeOrdersData,
      isUsingFallbackData: false,
      metrics: [
        {
          description: `${changeOrdersData.length} change orders in the active project`,
          icon: "documents" as const,
          label: "Total COs",
          tone: "blue" as const,
          value: changeOrdersData.length.toString(),
        },
        {
          description: `${approved.length} approved change orders`,
          icon: "reviews" as const,
          label: "Approved",
          tone: "emerald" as const,
          value: approved.length.toString(),
        },
        {
          description: `${pending.length} awaiting decision`,
          icon: "transmittals" as const,
          label: "Pending",
          tone: "amber" as const,
          value: pending.length.toString(),
        },
        {
          description: `${rejected.length} rejected change orders`,
          icon: "notifications" as const,
          label: "Rejected",
          tone: "rose" as const,
          value: rejected.length.toString(),
        },
      ],
      statusMessage: null,
    };
  } catch (error) {
    console.error("Error fetching change order management data:", error);
    return {
      changeOrders: [] as ChangeOrderData[],
      isUsingFallbackData: true,
      metrics: [
        {
          description: "Error loading data",
          icon: "documents" as const,
          label: "Total COs",
          tone: "blue" as const,
          value: "0",
        },
        {
          description: "Error loading data",
          icon: "reviews" as const,
          label: "Approved",
          tone: "emerald" as const,
          value: "0",
        },
        {
          description: "Error loading data",
          icon: "transmittals" as const,
          label: "Pending",
          tone: "amber" as const,
          value: "0",
        },
        {
          description: "Error loading data",
          icon: "notifications" as const,
          label: "Rejected",
          tone: "rose" as const,
          value: "0",
        },
      ],
      statusMessage: "Error loading change order data",
    };
  }
}

export async function getChangeOrders(projectId?: string) {
  return getChangeOrdersData(projectId);
}
