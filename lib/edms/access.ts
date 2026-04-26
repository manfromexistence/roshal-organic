import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { projects } from "@/lib/schema";

export async function getFirstAccessibleProjectId(
  _sessionUser: any,
): Promise<string | null> {
  try {
    // Return first project for any user (for testing purposes)
    const firstProject = await db
      .select({ id: projects.id })
      .from(projects)
      .orderBy(desc(projects.createdAt))
      .limit(1);

    if (firstProject.length > 0) {
      return firstProject[0].id;
    }

    return null;
  } catch (error) {
    console.error("Error getting first accessible project:", error);
    return null;
  }
}
