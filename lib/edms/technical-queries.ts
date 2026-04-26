import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { technicalQueries } from "@/lib/schema";

export interface TechnicalQueryData {
  id: string;
  queryNumber: string;
  subject: string;
  discipline: string;
  raisedBy: string;
  status: string;
  priority: string;
  dueDate: Date | null;
}

export async function getTechnicalQueriesData(): Promise<TechnicalQueryData[]> {
  try {
    const allQueries = await db
      .select({
        id: technicalQueries.id,
        queryNumber: technicalQueries.queryNumber,
        raisedBy: technicalQueries.raisedBy,
        discipline: technicalQueries.discipline,
        subject: technicalQueries.subject,
        status: technicalQueries.status,
        priority: technicalQueries.priority,
        dueDate: technicalQueries.dueDate,
      })
      .from(technicalQueries)
      .orderBy(desc(technicalQueries.createdAt));

    return allQueries.map((query) => ({
      id: query.id,
      queryNumber: query.queryNumber,
      subject: query.subject,
      discipline: query.discipline,
      raisedBy: query.raisedBy,
      status: query.status,
      priority: query.priority,
      dueDate: query.dueDate,
    }));
  } catch (error) {
    console.error("Error fetching technical queries:", error);
    return [];
  }
}

export async function getTechnicalQueryManagementData(_sessionUser: any) {
  try {
    const queriesData = await getTechnicalQueriesData();

    const openQueries = queriesData.filter((q) => q.status === "open");
    const inProgressQueries = queriesData.filter(
      (q) => q.status === "in_progress",
    );
    const closedQueries = queriesData.filter((q) => q.status === "closed");

    return {
      queries: queriesData,
      metrics: [
        {
          label: "Total Queries",
          value: queriesData.length.toString(),
          description: `${queriesData.length} total technical queries`,
          tone: "blue" as const,
          icon: "documents" as const,
        },
        {
          label: "Open",
          value: openQueries.length.toString(),
          description: `${openQueries.length} queries awaiting response`,
          tone: "emerald" as const,
          icon: "reviews" as const,
        },
        {
          label: "In Progress",
          value: inProgressQueries.length.toString(),
          description: `${inProgressQueries.length} queries being addressed`,
          tone: "amber" as const,
          icon: "transmittals" as const,
        },
        {
          label: "Closed",
          value: closedQueries.length.toString(),
          description: `${closedQueries.length} queries resolved`,
          tone: "rose" as const,
          icon: "notifications" as const,
        },
      ],
      isUsingFallbackData: false,
      statusMessage: "Technical query data loaded successfully",
    };
  } catch (error) {
    console.error("Error fetching technical query management data:", error);
    return {
      queries: [] as TechnicalQueryData[],
      metrics: [
        {
          label: "Total Queries",
          value: "0",
          description: "Error loading data",
          tone: "blue" as const,
          icon: "documents" as const,
        },
        {
          label: "Open",
          value: "0",
          description: "Error loading data",
          tone: "emerald" as const,
          icon: "reviews" as const,
        },
        {
          label: "In Progress",
          value: "0",
          description: "Error loading data",
          tone: "amber" as const,
          icon: "transmittals" as const,
        },
        {
          label: "Closed",
          value: "0",
          description: "Error loading data",
          tone: "rose" as const,
          icon: "notifications" as const,
        },
      ],
      isUsingFallbackData: true,
      statusMessage: "Error loading technical query data",
    };
  }
}

export async function getTechnicalQueriesPageData(sessionUser: any) {
  return getTechnicalQueryManagementData(sessionUser);
}
