"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { canActOnWorkflowStep, canManageEdmsContent } from "@/lib/edms/rbac";
import { getRequiredDashboardSessionUser } from "@/lib/edms/session";
import { documentWorkflows, workflowSteps } from "@/lib/schema";

export async function recordWorkflowDecision(input: {
  stepId: string;
  decision: string;
  comments?: string;
  attachmentUrl?: string;
  attachmentFileName?: string;
  attachmentFileSize?: number;
}): Promise<{ success: boolean; error?: { message: string } }> {
  try {
    const sessionUser = await getRequiredDashboardSessionUser();
    const [step] = await db
      .select({
        assignedTo: workflowSteps.assignedTo,
        status: workflowSteps.status,
      })
      .from(workflowSteps)
      .where(eq(workflowSteps.id, input.stepId))
      .limit(1);

    if (!step) {
      return {
        success: false,
        error: { message: "Workflow step was not found." },
      };
    }

    if (
      !canActOnWorkflowStep(sessionUser.role, step.assignedTo, sessionUser.id)
    ) {
      return {
        success: false,
        error: { message: "You are not allowed to act on this workflow step." },
      };
    }

    if (step.status !== "pending") {
      return {
        success: false,
        error: { message: "This workflow step is no longer actionable." },
      };
    }

    const approvalCodeMap: Record<string, number> = {
      approve: 1,
      approve_with_comments: 2,
      reject: 3,
      for_information: 4,
      comment: 0,
    };
    const approvalCode = approvalCodeMap[input.decision] || 0;

    await db
      .update(workflowSteps)
      .set({
        action: input.decision,
        approvalCode,
        comments: input.comments || null,
        attachmentUrl: input.attachmentUrl || null,
        attachmentFileName: input.attachmentFileName || null,
        attachmentFileSize: input.attachmentFileSize || null,
        completedAt: new Date(),
        status: input.decision === "comment" ? "pending" : "completed",
      })
      .where(eq(workflowSteps.id, input.stepId));

    revalidatePath("/workflows");
    return { success: true };
  } catch (error) {
    console.error("Failed to record workflow decision:", error);
    return {
      success: false,
      error: { message: "Failed to record workflow decision" },
    };
  }
}

export async function createDocumentWorkflow(input: {
  documentId: string;
  workflowName: string;
  reviewUserId: string;
  approveUserId?: string;
  dueDate?: string;
}): Promise<{ success: boolean; error?: { message: string } }> {
  try {
    const sessionUser = await getRequiredDashboardSessionUser();

    if (!canManageEdmsContent(sessionUser.role)) {
      return {
        success: false,
        error: { message: "You are not allowed to create workflows." },
      };
    }

    const workflowId = crypto.randomUUID();
    const totalSteps = input.approveUserId ? 2 : 1;
    const dueDate = input.dueDate ? new Date(input.dueDate) : null;

    await db.insert(documentWorkflows).values({
      id: workflowId,
      documentId: input.documentId,
      workflowName: input.workflowName,
      currentStep: 1,
      totalSteps,
      status: "pending",
      startedAt: new Date(),
    });

    // Create step 1: Review
    await db.insert(workflowSteps).values({
      id: crypto.randomUUID(),
      workflowId,
      stepNumber: 1,
      stepName: "Review",
      assignedTo: input.reviewUserId,
      assignedRole: "reviewer",
      status: "pending",
      startedAt: new Date(),
      dueDate,
    });

    // Create step 2: Approval (if approver specified)
    if (input.approveUserId) {
      await db.insert(workflowSteps).values({
        id: crypto.randomUUID(),
        workflowId,
        stepNumber: 2,
        stepName: "Final Approval",
        assignedTo: input.approveUserId,
        assignedRole: "approver",
        status: "pending",
        dueDate,
      });
    }

    revalidatePath("/workflows");
    return { success: true };
  } catch (error) {
    console.error("Failed to create document workflow:", error);
    return {
      success: false,
      error: { message: "Failed to create document workflow" },
    };
  }
}
