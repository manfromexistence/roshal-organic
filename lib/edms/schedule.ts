import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { projects, scheduleActivities, scheduleSync } from "@/lib/schema";

function toIsoDateString(value: Date) {
  return value.toISOString().slice(0, 10);
}

function addDays(value: Date, days: number) {
  const next = new Date(value);
  next.setDate(next.getDate() + days);
  return next;
}

async function ensureScheduleActivities(projectId: string) {
  const existingActivities = await db
    .select()
    .from(scheduleActivities)
    .where(eq(scheduleActivities.projectId, projectId))
    .orderBy(desc(scheduleActivities.createdAt));

  if (existingActivities.length > 0) {
    return existingActivities;
  }

  const [project] = await db
    .select({
      startDate: projects.startDate,
      endDate: projects.endDate,
    })
    .from(projects)
    .where(eq(projects.id, projectId))
    .limit(1);

  const projectStart = project?.startDate ?? new Date();
  const fallbackEnd = addDays(projectStart, 90);
  const projectEnd =
    project?.endDate && project.endDate > projectStart
      ? project.endDate
      : fallbackEnd;

  const totalDays = Math.max(
    4,
    Math.ceil(
      (projectEnd.getTime() - projectStart.getTime()) / (1000 * 60 * 60 * 24),
    ),
  );
  const segmentLength = Math.max(1, Math.ceil(totalDays / 4));
  const phaseBlueprints = [
    {
      phase: "engineering",
      name: "Engineering Deliverables",
      wbs: "1.1",
      activityCode: "ENG-001",
      plannedProgress: 20,
    },
    {
      phase: "procurement",
      name: "Procurement Package Review",
      wbs: "2.1",
      activityCode: "PRC-001",
      plannedProgress: 35,
    },
    {
      phase: "construction",
      name: "Construction Release Window",
      wbs: "3.1",
      activityCode: "CON-001",
      plannedProgress: 50,
    },
    {
      phase: "commissioning",
      name: "Commissioning and Handover",
      wbs: "4.1",
      activityCode: "COM-001",
      plannedProgress: 10,
    },
  ] as const;

  await db.insert(scheduleActivities).values(
    phaseBlueprints.map((phase, index) => {
      const start = addDays(projectStart, index * segmentLength);
      const end =
        index === phaseBlueprints.length - 1
          ? projectEnd
          : addDays(projectStart, (index + 1) * segmentLength);

      return {
        id: crypto.randomUUID(),
        projectId,
        activityCode: phase.activityCode,
        name: phase.name,
        wbs: phase.wbs,
        phase: phase.phase,
        startDate: toIsoDateString(start),
        endDate: toIsoDateString(end),
        plannedProgress: phase.plannedProgress,
        actualProgress: 0,
        linkedDocuments: JSON.stringify([]),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }),
  );

  return db
    .select()
    .from(scheduleActivities)
    .where(eq(scheduleActivities.projectId, projectId))
    .orderBy(desc(scheduleActivities.createdAt));
}

export async function getScheduleManagementData(projectId: string) {
  try {
    const [activities, syncRows] = await Promise.all([
      ensureScheduleActivities(projectId),
      db
        .select({
          lastSyncAt: scheduleSync.lastSyncAt,
          projectStart: scheduleSync.projectStart,
          projectEnd: scheduleSync.projectEnd,
          source: scheduleSync.source,
        })
        .from(scheduleSync)
        .where(eq(scheduleSync.projectId, projectId))
        .orderBy(desc(scheduleSync.lastSyncAt))
        .limit(1),
    ]);

    const latestSync = syncRows[0];
    const projectStart =
      latestSync?.projectStart ||
      activities
        .map((activity) => activity.startDate)
        .sort((left, right) => left.localeCompare(right))[0] ||
      "";
    const projectEnd =
      latestSync?.projectEnd ||
      activities
        .map((activity) => activity.endDate)
        .sort((left, right) => right.localeCompare(left))[0] ||
      "";

    const activitySummaries = activities.map((activity) => ({
      id: activity.id,
      name: activity.name,
      wbs: activity.wbs,
      activityCode: activity.activityCode,
      phase: activity.phase,
      start: activity.startDate,
      end: activity.endDate,
      planned: activity.plannedProgress,
      actual: activity.actualProgress,
      linkedDocs: activity.linkedDocuments
        ? JSON.parse(activity.linkedDocuments)
        : [],
    }));

    const onTrackActivities = activities.filter(
      (activity) => activity.actualProgress >= activity.plannedProgress,
    );
    const delayedActivities = activities.filter(
      (activity) =>
        activity.actualProgress < activity.plannedProgress &&
        activity.actualProgress > 0,
    );
    const criticalActivities = activities.filter(
      (activity) => activity.actualProgress < activity.plannedProgress * 0.5,
    );

    return {
      scheduleItems: activities,
      activities: activitySummaries,
      lastSync: latestSync?.lastSyncAt
        ? `${latestSync.source} - ${new Date(latestSync.lastSyncAt).toLocaleString()}`
        : "EDMS baseline ready for linking",
      projectStart,
      projectEnd,
      metrics: [
        {
          label: "Total Activities",
          value: activities.length.toString(),
          description: `${activities.length} total activities`,
          tone: "blue" as const,
          icon: "documents" as const,
        },
        {
          label: "On Track",
          value: onTrackActivities.length.toString(),
          description: `${onTrackActivities.length} activities on schedule`,
          tone: "emerald" as const,
          icon: "reviews" as const,
        },
        {
          label: "Delayed",
          value: delayedActivities.length.toString(),
          description: `${delayedActivities.length} activities delayed`,
          tone: "amber" as const,
          icon: "transmittals" as const,
        },
        {
          label: "Critical",
          value: criticalActivities.length.toString(),
          description: `${criticalActivities.length} critical activities`,
          tone: "rose" as const,
          icon: "notifications" as const,
        },
      ],
      isUsingFallbackData: false,
      statusMessage: "Schedule activities loaded successfully",
    };
  } catch (error) {
    console.error("Error fetching schedule management data:", error);
    return {
      scheduleItems: [],
      activities: [],
      lastSync: "Error",
      projectStart: "",
      projectEnd: "",
      metrics: [
        {
          label: "Total Activities",
          value: "0",
          description: "Error loading data",
          tone: "blue" as const,
          icon: "documents" as const,
        },
        {
          label: "On Track",
          value: "0",
          description: "Error loading data",
          tone: "emerald" as const,
          icon: "reviews" as const,
        },
        {
          label: "Delayed",
          value: "0",
          description: "Error loading data",
          tone: "amber" as const,
          icon: "transmittals" as const,
        },
        {
          label: "Critical",
          value: "0",
          description: "Error loading data",
          tone: "rose" as const,
          icon: "notifications" as const,
        },
      ],
      isUsingFallbackData: true,
      statusMessage: "Error loading schedule data",
    };
  }
}

export async function getSchedulePageData(projectId: string) {
  return getScheduleManagementData(projectId);
}
