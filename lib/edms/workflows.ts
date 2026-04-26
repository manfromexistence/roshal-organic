import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { canActOnWorkflowStep } from "@/lib/edms/rbac";
import {
  documents,
  documentWorkflows,
  organizations,
  projectMembers,
  projects,
  users,
  workflowSteps,
} from "@/lib/schema";

export interface WorkflowData {
  id: string;
  workflowId: string;
  stepName: string;
  workflowName: string;
  stepNumber: number;
  totalSteps: number;
  title: string;
  documentNumber: string;
  projectName: string;
  status: string;
  assignedToName: string;
  assignedRole: string;
  dueLabel: string;
  dueDate: Date | null;
  isActionable: boolean;
  projectId: string;
}

export interface WorkflowDocumentOption {
  id: string;
  projectId: string;
  documentNumber: string;
  title: string;
  projectName: string;
  status: string;
}

export interface WorkflowAssignee {
  id: string;
  projectIds: string[];
  name: string;
  email: string;
  role: string;
  organization: string | null;
}

export async function getWorkflowsData(sessionUser: {
  id?: string | null;
  role?: string | null;
}): Promise<WorkflowData[]> {
  try {
    const allWorkflows = await db
      .select({
        id: workflowSteps.id,
        workflowId: documentWorkflows.id,
        stepName: workflowSteps.stepName,
        workflowName: documentWorkflows.workflowName,
        stepNumber: workflowSteps.stepNumber,
        totalSteps: documentWorkflows.totalSteps,
        documentNumber: documents.documentNumber,
        documentTitle: documents.title,
        projectName: projects.name,
        status: workflowSteps.status,
        assignedTo: workflowSteps.assignedTo,
        assignedToName: users.name,
        assignedRole: workflowSteps.assignedRole,
        dueDate: workflowSteps.dueDate,
        projectId: documents.projectId,
      })
      .from(workflowSteps)
      .innerJoin(
        documentWorkflows,
        eq(workflowSteps.workflowId, documentWorkflows.id),
      )
      .innerJoin(documents, eq(documentWorkflows.documentId, documents.id))
      .leftJoin(projects, eq(documents.projectId, projects.id))
      .leftJoin(users, eq(workflowSteps.assignedTo, users.id))
      .orderBy(desc(workflowSteps.dueDate));

    return allWorkflows.map((workflow) => ({
      id: workflow.id,
      workflowId: workflow.workflowId,
      stepName: workflow.stepName,
      workflowName: workflow.workflowName,
      stepNumber: workflow.stepNumber,
      totalSteps: workflow.totalSteps,
      title: workflow.documentTitle || workflow.documentNumber || "Untitled",
      documentNumber: workflow.documentNumber || "N/A",
      projectName: workflow.projectName || "Unknown",
      status: workflow.status || "unknown",
      assignedToName:
        workflow.assignedToName || workflow.assignedTo || "Unassigned",
      assignedRole: workflow.assignedRole || "reviewer",
      dueLabel: workflow.dueDate
        ? new Date(workflow.dueDate).toLocaleDateString()
        : "No due date",
      dueDate: workflow.dueDate,
      isActionable:
        workflow.status === "pending" &&
        canActOnWorkflowStep(
          sessionUser.role,
          workflow.assignedTo,
          sessionUser.id,
        ),
      projectId: workflow.projectId,
    }));
  } catch (error) {
    console.error("Error fetching workflows:", error);
    return [];
  }
}

async function getWorkflowDocuments(): Promise<WorkflowDocumentOption[]> {
  const rows = await db
    .select({
      id: documents.id,
      projectId: documents.projectId,
      documentNumber: documents.documentNumber,
      title: documents.title,
      projectName: projects.name,
      status: documents.status,
    })
    .from(documents)
    .leftJoin(projects, eq(documents.projectId, projects.id))
    .orderBy(desc(documents.uploadedAt));

  return rows.map((document) => ({
    id: document.id,
    projectId: document.projectId,
    documentNumber: document.documentNumber,
    title: document.title,
    projectName: document.projectName || "Unknown",
    status: document.status || "draft",
  }));
}

async function getWorkflowAssignees(): Promise<WorkflowAssignee[]> {
  const [directoryRows, projectMemberRows] = await Promise.all([
    db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        organization: organizations.name,
      })
      .from(users)
      .leftJoin(organizations, eq(users.organizationId, organizations.id)),
    db
      .select({
        userId: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        projectRole: projectMembers.role,
        projectId: projectMembers.projectId,
        organization: organizations.name,
      })
      .from(projectMembers)
      .innerJoin(users, eq(projectMembers.userId, users.id))
      .leftJoin(organizations, eq(users.organizationId, organizations.id)),
  ]);

  const assigneeMap = new Map<
    string,
    WorkflowAssignee & { projectIdSet: Set<string> }
  >();

  for (const user of directoryRows) {
    assigneeMap.set(user.id, {
      id: user.id,
      projectIds: [],
      projectIdSet: new Set<string>(),
      name: user.name,
      email: user.email,
      role: user.role || "user",
      organization: user.organization,
    });
  }

  for (const member of projectMemberRows) {
    const existingAssignee = assigneeMap.get(member.userId);

    if (existingAssignee) {
      existingAssignee.projectIdSet.add(member.projectId);
      existingAssignee.role = member.projectRole || existingAssignee.role;
      continue;
    }

    assigneeMap.set(member.userId, {
      id: member.userId,
      projectIds: [],
      projectIdSet: new Set([member.projectId]),
      name: member.name,
      email: member.email,
      role: member.projectRole || member.role || "user",
      organization: member.organization,
    });
  }

  return Array.from(assigneeMap.values())
    .map(({ projectIdSet, ...assignee }) => ({
      ...assignee,
      projectIds: Array.from(projectIdSet),
    }))
    .sort((left, right) => left.name.localeCompare(right.name));
}

export async function getWorkflowManagementData(_sessionUser: any) {
  try {
    const [workflowsData, workflowDocuments, workflowAssignees] =
      await Promise.all([
        getWorkflowsData(_sessionUser),
        getWorkflowDocuments(),
        getWorkflowAssignees(),
      ]);

    const activeWorkflows = workflowsData.filter((workflow) => {
      return workflow.status === "pending";
    });
    const pendingSteps = workflowsData.filter((workflow) => {
      return workflow.status === "pending";
    });
    const overdueSteps = workflowsData.filter((workflow) => {
      return (
        workflow.status === "pending" &&
        workflow.dueDate &&
        new Date(workflow.dueDate) < new Date()
      );
    });
    const completedSteps = workflowsData.filter((workflow) => {
      return workflow.status === "completed";
    });

    return {
      steps: workflowsData,
      documents: workflowDocuments,
      assignees: workflowAssignees,
      metrics: [
        {
          label: "Active Workflows",
          value: activeWorkflows.length.toString(),
          description: `${activeWorkflows.length} workflows in progress`,
          tone: "blue" as const,
          icon: "documents" as const,
        },
        {
          label: "Pending Steps",
          value: pendingSteps.length.toString(),
          description: `${pendingSteps.length} steps awaiting action`,
          tone: "emerald" as const,
          icon: "reviews" as const,
        },
        {
          label: "Overdue",
          value: overdueSteps.length.toString(),
          description: `${overdueSteps.length} steps past due date`,
          tone: "amber" as const,
          icon: "transmittals" as const,
        },
        {
          label: "Completed",
          value: completedSteps.length.toString(),
          description: `${completedSteps.length} steps completed`,
          tone: "rose" as const,
          icon: "notifications" as const,
        },
      ],
      isUsingFallbackData: false,
      statusMessage: "Workflow data loaded successfully",
    };
  } catch (error) {
    console.error("Error fetching workflow management data:", error);
    return {
      steps: [],
      documents: [],
      assignees: [],
      metrics: [
        {
          label: "Active Workflows",
          value: "0",
          description: "Error loading data",
          tone: "blue" as const,
          icon: "documents" as const,
        },
        {
          label: "Pending Steps",
          value: "0",
          description: "Error loading data",
          tone: "emerald" as const,
          icon: "reviews" as const,
        },
        {
          label: "Overdue",
          value: "0",
          description: "Error loading data",
          tone: "amber" as const,
          icon: "transmittals" as const,
        },
        {
          label: "Completed",
          value: "0",
          description: "Error loading data",
          tone: "rose" as const,
          icon: "notifications" as const,
        },
      ],
      isUsingFallbackData: true,
      statusMessage: "Error loading workflow data",
    };
  }
}
