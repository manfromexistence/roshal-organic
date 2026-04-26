import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { submittals } from "@/lib/schema";

export interface SubmittalData {
  id: string;
  submittalNumber: string;
  type: string;
  specificationSection: string | null;
  revision: string;
  reviewStatus: string;
  dueDate: string | null;
  submittedAt: string;
  submittedBy: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
  comments: string | null;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

export async function getSubmittalsData(): Promise<SubmittalData[]> {
  try {
    const allSubmittals = await db
      .select({
        id: submittals.id,
        submittalNumber: submittals.submittalNumber,
        type: submittals.type,
        specificationSection: submittals.specificationSection,
        revision: submittals.revision,
        reviewStatus: submittals.reviewStatus,
        dueDate: submittals.dueDate,
        submittedAt: submittals.submittedAt,
        submittedBy: submittals.submittedBy,
        reviewedAt: submittals.reviewedAt,
        reviewedBy: submittals.reviewedBy,
        comments: submittals.comments,
        projectId: submittals.projectId,
        createdAt: submittals.createdAt,
        updatedAt: submittals.updatedAt,
      })
      .from(submittals)
      .orderBy(desc(submittals.createdAt));

    return allSubmittals.map((sub) => ({
      id: sub.id,
      submittalNumber: sub.submittalNumber,
      type: sub.type,
      specificationSection: sub.specificationSection,
      revision: sub.revision,
      reviewStatus: sub.reviewStatus,
      dueDate: sub.dueDate ? new Date(sub.dueDate).toLocaleDateString() : null,
      submittedAt: new Date(sub.submittedAt).toLocaleDateString(),
      submittedBy: sub.submittedBy,
      reviewedAt: sub.reviewedAt
        ? new Date(sub.reviewedAt).toLocaleDateString()
        : null,
      reviewedBy: sub.reviewedBy,
      comments: sub.comments,
      projectId: sub.projectId,
      createdAt: new Date(sub.createdAt).toLocaleDateString(),
      updatedAt: new Date(sub.updatedAt).toLocaleDateString(),
    }));
  } catch (error) {
    console.error("Error fetching submittals:", error);
    return [];
  }
}

export async function getSubmittals(
  _projectId?: string,
): Promise<SubmittalData[]> {
  return getSubmittalsData();
}

export async function getSubmittalManagementData(_sessionUser: any) {
  try {
    const submittalsData = await getSubmittalsData();

    const approvedSubmittals = submittalsData.filter(
      (s) => s.reviewStatus === "approved",
    );
    const pendingSubmittals = submittalsData.filter(
      (s) => s.reviewStatus === "pending" || s.reviewStatus === "under_review",
    );
    const rejectedSubmittals = submittalsData.filter(
      (s) =>
        s.reviewStatus === "rejected" ||
        s.reviewStatus === "revise_and_resubmit",
    );

    return {
      submittals: submittalsData,
      metrics: [
        {
          label: "Total Submittals",
          value: submittalsData.length.toString(),
          description: `${submittalsData.length} total submittals`,
          tone: "blue" as const,
          icon: "documents" as const,
        },
        {
          label: "Approved",
          value: approvedSubmittals.length.toString(),
          description: `${approvedSubmittals.length} submittals approved`,
          tone: "emerald" as const,
          icon: "reviews" as const,
        },
        {
          label: "Pending",
          value: pendingSubmittals.length.toString(),
          description: `${pendingSubmittals.length} submittals pending review`,
          tone: "amber" as const,
          icon: "transmittals" as const,
        },
        {
          label: "Rejected",
          value: rejectedSubmittals.length.toString(),
          description: `${rejectedSubmittals.length} submittals rejected`,
          tone: "rose" as const,
          icon: "notifications" as const,
        },
      ],
      isUsingFallbackData: false,
      statusMessage: "Submittal data loaded successfully",
    };
  } catch (error) {
    console.error("Error fetching submittal management data:", error);
    return {
      submittals: [] as SubmittalData[],
      metrics: [
        {
          label: "Total Submittals",
          value: "0",
          description: "Error loading data",
          tone: "blue" as const,
          icon: "documents" as const,
        },
        {
          label: "Approved",
          value: "0",
          description: "Error loading data",
          tone: "emerald" as const,
          icon: "reviews" as const,
        },
        {
          label: "Pending",
          value: "0",
          description: "Error loading data",
          tone: "amber" as const,
          icon: "transmittals" as const,
        },
        {
          label: "Rejected",
          value: "0",
          description: "Error loading data",
          tone: "rose" as const,
          icon: "notifications" as const,
        },
      ],
      isUsingFallbackData: true,
      statusMessage: "Error loading submittal data",
    };
  }
}
