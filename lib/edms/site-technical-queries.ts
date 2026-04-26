import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { siteTechQueries } from "@/lib/schema";

export interface SiteTechnicalQueryData {
  id: string;
  queryNumber: string;
  title: string;
  status: string;
  raisedDate: string;
}

export async function getSiteTechnicalQueries(
  projectId: string,
): Promise<SiteTechnicalQueryData[]> {
  try {
    const queries = await db
      .select()
      .from(siteTechQueries)
      .where(eq(siteTechQueries.projectId, projectId))
      .orderBy(desc(siteTechQueries.createdAt));

    return queries.map((q) => ({
      id: q.id,
      queryNumber: q.queryNumber,
      title: q.subject,
      status: q.status,
      raisedDate: q.date ? new Date(q.date).toLocaleDateString() : "Not raised",
    }));
  } catch (error) {
    console.error("Error fetching site technical queries:", error);
    return [];
  }
}
