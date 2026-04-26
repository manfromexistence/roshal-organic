import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createTransmittalFromForm } from "@/actions/transmittals";
import { TransmittalFormWithPreview } from "@/components/edms/transmittal-form-with-preview";
import { ScrollableContent } from "@/components/scrollable-content";
import {
  generateProjectScopedTransmittalNumber,
  getCurrentDate,
  getFutureDate,
} from "@/lib/edms/form-helpers";
import { canManageEdmsContent } from "@/lib/edms/rbac";
import { getRequiredDashboardSessionUser } from "@/lib/edms/session";
import { getTransmittalManagementData } from "@/lib/edms/transmittals";

export const metadata: Metadata = {
  title: "New Transmittal | Quadra EDMS",
};

export default async function NewTransmittalPage() {
  const sessionUser = await getRequiredDashboardSessionUser();

  if (!canManageEdmsContent(sessionUser.role || "user")) {
    redirect("/transmittals");
  }

  const data = await getTransmittalManagementData(sessionUser);
  const initialProject = data.projects[0];
  const initialMembers = data.members.filter(
    (member) => member.projectId === initialProject?.id,
  );
  const initialFormData = {
    transmittalNumber: generateProjectScopedTransmittalNumber(
      initialProject?.projectNumber,
    ),
    date: getCurrentDate(),
    projectId: initialProject?.id || "",
    recipientId: initialMembers[0]?.id || "",
    purpose: "IFR",
    subject: "",
    dueDate: getFutureDate(14),
    remarks: "",
    selectedDocuments: [] as string[],
  };

  const handleSubmit = async (formData: any) => {
    "use server";
    return createTransmittalFromForm({
      ...formData,
      fromUserId: sessionUser.id,
    });
  };

  return (
    <ScrollableContent>
      <div className="flex flex-col gap-6 px-8 pt-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Prepare Transmittal
          </h1>
          <p className="text-sm leading-6 text-muted-foreground md:text-base">
            Compose a formal transmittal to issue documents to a stakeholder.
            The system auto-generates the ID and applies the distribution
            matrix.
          </p>
        </div>

        <TransmittalFormWithPreview
          projects={data.projects}
          members={data.members}
          documents={data.documents}
          initialFormData={initialFormData}
          onSubmit={handleSubmit}
        />
      </div>
    </ScrollableContent>
  );
}
