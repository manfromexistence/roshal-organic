import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { memos } from "@/lib/schema";

export interface MemoData {
  id: string;
  memoNumber: string;
  subject: string;
  status: string;
  date: string;
}

export async function getMemos(projectId: string): Promise<MemoData[]> {
  try {
    const memosData = await db
      .select()
      .from(memos)
      .where(eq(memos.projectId, projectId))
      .orderBy(desc(memos.createdAt));

    return memosData.map((m) => ({
      id: m.id,
      memoNumber: m.memoNumber,
      subject: m.subject,
      status: m.status,
      date: m.date ? new Date(m.date).toLocaleDateString() : "Not dated",
    }));
  } catch (error) {
    console.error("Error fetching memos:", error);
    return [];
  }
}
