import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { technicalQueries, users } from "@/lib/schema";

export async function getTechnicalQueries(projectId?: string) {
  if (!projectId) {
    return [] as Array<{
      id: string;
      queryNumber: string;
      subject: string;
      discipline: string;
      raisedBy: string;
      status: string;
      dueDate: Date | null;
      priority: string;
    }>;
  }

  const rows = await db
    .select({
      id: technicalQueries.id,
      queryNumber: technicalQueries.queryNumber,
      subject: technicalQueries.subject,
      discipline: technicalQueries.discipline,
      raisedBy: users.name,
      status: technicalQueries.status,
      dueDate: technicalQueries.dueDate,
      priority: technicalQueries.priority,
    })
    .from(technicalQueries)
    .innerJoin(users, eq(technicalQueries.raisedBy, users.id))
    .where(eq(technicalQueries.projectId, projectId))
    .orderBy(desc(technicalQueries.createdAt));

  return rows.map((row) => ({
    id: row.id,
    queryNumber: row.queryNumber,
    subject: row.subject,
    discipline: row.discipline,
    raisedBy: row.raisedBy,
    status: row.status,
    dueDate: row.dueDate,
    priority: row.priority,
  }));
}
