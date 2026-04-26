import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  activityLog,
  documents,
  documentWorkflows,
  projects,
  users,
} from "@/lib/schema";

export type DashboardMetric = {
  label: string;
  value: string;
  description: string;
  tone: "blue" | "emerald" | "amber" | "rose";
  icon: "projects" | "documents" | "reviews" | "transmittals" | "notifications";
};

export interface DashboardData {
  projects: any[];
  metrics: any[];
  activity: any[];
  workflowQueue: any[];
  notifications: any[];
  transmittals: any[];
  isUsingFallbackData: boolean;
  statusMessage: string;
}

export type DashboardActivityItem = {
  id: string;
  actorName: string;
  action: string;
  entityName: string;
  description: string;
  createdLabel: string;
  entityType: string;
  projectName: string | null;
};

export type DashboardDocument = {
  id: string;
  documentNumber: string;
  title: string;
  status: string;
  revision: string;
  discipline: string;
  projectName: string;
  fileUrl: string;
  fileType: string | null;
  images: string | null;
  uploadedLabel: string;
};

export type DashboardNotification = {
  id: string;
  title: string;
  message: string;
  type: string;
  createdAt: string;
  read: boolean;
  isRead: boolean;
  projectName: string;
  actionUrl: string;
  createdLabel: string;
};

export type DashboardProject = {
  id: string;
  name: string;
  projectNumber: string;
  status: string;
  location: string;
  startDate: string;
  endDate: string;
  images: string[] | null;
  schedule: string | null;
};

export type DashboardTransmittal = {
  id: string;
  transmittalNumber: string;
  subject: string;
  to: string;
  status: string;
  sentAt: string;
  projectName: string;
  sentLabel: string;
};

export type DashboardWorkflowItem = {
  id: string;
  documentNumber: string;
  title: string;
  currentStep: string;
  status: string;
  dueDate: string;
  workflowId: string;
  stepName: string;
  projectName: string;
  assignedRole: string;
  dueLabel: string;
};

export async function getEdmsDashboardData(_user: any): Promise<DashboardData> {
  try {
    const [allProjects, totalDocuments, pendingWorkflows, recentActivity] =
      await Promise.all([
        db.select().from(projects).orderBy(desc(projects.createdAt)),
        db.$count(documents),
        db.$count(documentWorkflows, eq(documentWorkflows.status, "pending")),
        db
          .select({
            id: activityLog.id,
            action: activityLog.action,
            entityName: activityLog.entityName,
            description: activityLog.description,
            createdAt: activityLog.createdAt,
            entityType: activityLog.entityType,
            actorName: users.name,
            actorEmail: users.email,
            projectName: projects.name,
          })
          .from(activityLog)
          .leftJoin(users, eq(activityLog.userId, users.id))
          .leftJoin(projects, eq(activityLog.projectId, projects.id))
          .orderBy(desc(activityLog.createdAt))
          .limit(10),
      ]);

    // Calculate metrics
    const metrics = [
      {
        label: "Active Projects",
        value: allProjects
          .filter((p) => p.status === "active")
          .length.toString(),
        description: "Currently active projects",
        tone: "blue" as const,
        icon: "projects" as const,
      },
      {
        label: "Total Documents",
        value: totalDocuments.toString(),
        description: "Total documents in system",
        tone: "emerald" as const,
        icon: "documents" as const,
      },
      {
        label: "Pending Workflows",
        value: pendingWorkflows.toString(),
        description: "Workflows awaiting approval",
        tone: "amber" as const,
        icon: "reviews" as const,
      },
    ];

    return {
      projects: allProjects,
      metrics,
      activity: recentActivity.map((entry) => ({
        id: entry.id,
        actorName: entry.actorName || entry.actorEmail || "System",
        action: entry.action,
        entityName: entry.entityName,
        description: entry.description,
        createdLabel: new Date(entry.createdAt).toLocaleDateString(),
        entityType: entry.entityType,
        projectName: entry.projectName,
      })),
      workflowQueue: [],
      notifications: [],
      transmittals: [],
      isUsingFallbackData: false,
      statusMessage: "Data loaded successfully",
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return {
      projects: [],
      metrics: [],
      activity: [],
      workflowQueue: [],
      notifications: [],
      transmittals: [],
      isUsingFallbackData: true,
      statusMessage: "Using fallback data due to error",
    };
  }
}
