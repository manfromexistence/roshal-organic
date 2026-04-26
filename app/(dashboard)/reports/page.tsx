import type { Metadata } from "next";
import { getFirstAccessibleProjectId } from "@/lib/edms/access";
import { getDocuments } from "@/lib/edms/documents";
import { getRequiredDashboardSessionUser } from "@/lib/edms/session";
import { getTransmittals } from "@/lib/edms/transmittals";
import { getWorkflowsData } from "@/lib/edms/workflows";
import { ReportModalClient } from "./report-modal-client";

export const metadata: Metadata = {
  title: "Reports | Quadra EDMS",
};

export default async function ReportsPage() {
  const sessionUser = await getRequiredDashboardSessionUser();
  const projectId = await getFirstAccessibleProjectId(sessionUser);

  // Fetch data on server
  let documents: any[] = [];
  let transmittals: any[] = [];
  let workflows: any[] = [];
  let error: string | null = null;

  if (projectId) {
    try {
      const [docs, trans, workflowSteps] = await Promise.all([
        getDocuments(projectId),
        getTransmittals(projectId),
        getWorkflowsData(sessionUser),
      ]);
      documents = docs;
      transmittals = trans;
      workflows = workflowSteps.filter(
        (workflow) => workflow.projectId === projectId,
      );
    } catch (err) {
      console.error("Failed to fetch data:", err);
      error = "Failed to load data. Please try again later.";
    }
  } else {
    error = "No accessible projects found. Please contact your administrator.";
  }

  return (
    <ReportModalClient
      documents={documents}
      transmittals={transmittals}
      workflows={workflows}
      error={error}
    />
  );
}
