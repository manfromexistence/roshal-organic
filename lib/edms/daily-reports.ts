import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { getFirstAccessibleProjectId } from "@/lib/edms/access";
import { dailyReports } from "@/lib/schema";

export async function getDailyReportsManagementData(sessionUser: any) {
  try {
    const projectId = await getFirstAccessibleProjectId(sessionUser);

    if (!projectId) {
      return {
        isUsingFallbackData: false,
        metrics: [
          {
            description: "No accessible project selected",
            icon: "documents" as const,
            label: "Total Reports",
            tone: "blue" as const,
            value: "0",
          },
          {
            description: "No accessible project selected",
            icon: "reviews" as const,
            label: "This Week",
            tone: "emerald" as const,
            value: "0",
          },
          {
            description: "No accessible project selected",
            icon: "transmittals" as const,
            label: "With Issues",
            tone: "amber" as const,
            value: "0",
          },
          {
            description: "No accessible project selected",
            icon: "notifications" as const,
            label: "Weather Logged",
            tone: "rose" as const,
            value: "0",
          },
        ],
        reports: [],
        statusMessage: null,
      };
    }

    const reports = await getDailyReports(projectId);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const thisWeek = reports.filter(
      (report) => report.reportDate >= oneWeekAgo,
    );
    const withIssues = reports.filter((report) =>
      Boolean(report.issues?.trim()),
    );
    const weatherLogged = reports.filter((report) =>
      Boolean(report.weather?.trim()),
    );

    return {
      isUsingFallbackData: false,
      metrics: [
        {
          description: `${reports.length} site reports recorded`,
          icon: "documents" as const,
          label: "Total Reports",
          tone: "blue" as const,
          value: reports.length.toString(),
        },
        {
          description: `${thisWeek.length} reports in the last 7 days`,
          icon: "reviews" as const,
          label: "This Week",
          tone: "emerald" as const,
          value: thisWeek.length.toString(),
        },
        {
          description: `${withIssues.length} reports include issues`,
          icon: "transmittals" as const,
          label: "With Issues",
          tone: "amber" as const,
          value: withIssues.length.toString(),
        },
        {
          description: `${weatherLogged.length} reports captured weather`,
          icon: "notifications" as const,
          label: "Weather Logged",
          tone: "rose" as const,
          value: weatherLogged.length.toString(),
        },
      ],
      reports,
      statusMessage: null,
    };
  } catch (error) {
    console.error("Error fetching daily reports management data:", error);
    return {
      isUsingFallbackData: true,
      metrics: [],
      reports: [],
      statusMessage: "Error loading daily reports data",
    };
  }
}

export async function getDailyReportsPageData(sessionUser: any) {
  return getDailyReportsManagementData(sessionUser);
}

export async function getDailyReports(projectId?: string) {
  try {
    if (!projectId) {
      return [];
    }

    return await db
      .select({
        activitiesCompleted: dailyReports.activitiesCompleted,
        createdAt: dailyReports.createdAt,
        createdBy: dailyReports.createdBy,
        id: dailyReports.id,
        issues: dailyReports.issues,
        projectId: dailyReports.projectId,
        reportDate: dailyReports.reportDate,
        updatedAt: dailyReports.updatedAt,
        weather: dailyReports.weather,
      })
      .from(dailyReports)
      .where(eq(dailyReports.projectId, projectId))
      .orderBy(desc(dailyReports.reportDate));
  } catch (error) {
    console.error("Error fetching daily reports:", error);
    return [];
  }
}
