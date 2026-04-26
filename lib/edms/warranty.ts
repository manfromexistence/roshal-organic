import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { getFirstAccessibleProjectId } from "@/lib/edms/access";
import { warrantyRecords } from "@/lib/schema";

export async function getWarrantyManagementData(sessionUser: any) {
  try {
    const projectId = await getFirstAccessibleProjectId(sessionUser);
    const warranties = await getWarrantyRecords(projectId ?? undefined);
    const active = warranties.filter((item) => item.status === "active");
    const expired = warranties.filter((item) => item.status === "expired");
    const expiringSoon = warranties.filter((item) => {
      if (!(item.expiryDate instanceof Date)) {
        return false;
      }

      const inThirtyDays = new Date();
      inThirtyDays.setDate(inThirtyDays.getDate() + 30);
      return item.expiryDate <= inThirtyDays && item.status === "active";
    });

    return {
      isUsingFallbackData: false,
      metrics: [
        {
          description: `${warranties.length} warranty records tracked`,
          icon: "documents" as const,
          label: "Total Items",
          tone: "blue" as const,
          value: warranties.length.toString(),
        },
        {
          description: `${active.length} warranties currently active`,
          icon: "reviews" as const,
          label: "Active",
          tone: "emerald" as const,
          value: active.length.toString(),
        },
        {
          description: `${expiringSoon.length} warranties expiring soon`,
          icon: "transmittals" as const,
          label: "Expiring Soon",
          tone: "amber" as const,
          value: expiringSoon.length.toString(),
        },
        {
          description: `${expired.length} warranties already expired`,
          icon: "notifications" as const,
          label: "Expired",
          tone: "rose" as const,
          value: expired.length.toString(),
        },
      ],
      statusMessage: null,
      warrantyItems: warranties,
    };
  } catch (error) {
    console.error("Error fetching warranty data:", error);
    return {
      isUsingFallbackData: true,
      metrics: [],
      statusMessage: "Error loading warranty data",
      warrantyItems: [],
    };
  }
}

export async function getWarrantyRecords(projectId?: string) {
  try {
    if (!projectId) {
      return [];
    }

    return await db
      .select({
        expiryDate: warrantyRecords.endDate,
        id: warrantyRecords.id,
        provider: warrantyRecords.warrantyType,
        status: warrantyRecords.status,
        system: warrantyRecords.item,
        title: warrantyRecords.description,
        warrantyNumber: warrantyRecords.warrantyNumber,
      })
      .from(warrantyRecords)
      .where(eq(warrantyRecords.projectId, projectId))
      .orderBy(desc(warrantyRecords.endDate));
  } catch (error) {
    console.error("Error fetching warranty records:", error);
    return [];
  }
}

export async function getWarrantyPageData(sessionUser: any) {
  return getWarrantyManagementData(sessionUser);
}
