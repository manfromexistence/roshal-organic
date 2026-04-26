import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DocumentCreateSheet } from "@/components/edms/document-create-sheet";
import { ScrollableContent } from "@/components/scrollable-content";
import { getEdmsDashboardData } from "@/lib/edms/dashboard";
import { canManageEdmsContent } from "@/lib/edms/rbac";
import { getRequiredDashboardSessionUser } from "@/lib/edms/session";

export const metadata: Metadata = {
  title: "New Document | Quadra EDMS",
};

export default async function NewDocumentPage() {
  const sessionUser = await getRequiredDashboardSessionUser();

  if (!canManageEdmsContent(sessionUser.role || "user")) {
    redirect("/documents");
  }

  const data = await getEdmsDashboardData(sessionUser);

  return (
    <ScrollableContent>
      <div className="flex flex-col gap-6 px-8 pt-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            New Document
          </h1>
          <p className="text-sm leading-6 text-muted-foreground md:text-base">
            Register a new document in the EDMS with controlled revision
            tracking and file upload support.
          </p>
        </div>

        <DocumentCreateSheet projects={data.projects} />
      </div>
    </ScrollableContent>
  );
}
