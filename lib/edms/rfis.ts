import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { rfis } from "@/lib/schema";

export interface RfiData {
  id: string;
  rfiNumber: string;
  subject: string;
  status: string;
  date: string;
}

export async function getRfis(projectId: string): Promise<RfiData[]> {
  try {
    const rfisData = await db
      .select()
      .from(rfis)
      .where(eq(rfis.projectId, projectId))
      .orderBy(desc(rfis.createdAt));

    return rfisData.map((r) => ({
      id: r.id,
      rfiNumber: r.rfiNumber,
      subject: r.subject,
      status: r.status,
      date: r.date ? new Date(r.date).toLocaleDateString() : "Not dated",
    }));
  } catch (error) {
    console.error("Error fetching RFIs:", error);
    return [];
  }
}
