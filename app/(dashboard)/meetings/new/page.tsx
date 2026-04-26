import { desc } from "drizzle-orm";
import type { Metadata } from "next";
import { MeetingCreateForm } from "@/components/edms/meeting-create-form";
import { ScrollableContent } from "@/components/scrollable-content";
import { db } from "@/lib/db";
import {
  generateMinutesOfMeetingNumber,
  getCurrentDate,
  getFutureDate,
} from "@/lib/edms/form-helpers";
import { getRequiredDashboardSessionUser } from "@/lib/edms/session";
import { projects } from "@/lib/schema";

export const metadata: Metadata = {
  title: "New MoM | Quadra EDMS",
};

export default async function NewMomPage() {
  const sessionUser = await getRequiredDashboardSessionUser();
  const projectRows = await db
    .select({
      id: projects.id,
      name: projects.name,
      projectNumber: projects.projectNumber,
    })
    .from(projects)
    .orderBy(desc(projects.createdAt));

  const firstProject = projectRows[0];

  return (
    <ScrollableContent>
      <div className="flex flex-col gap-6 px-8 pt-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            New Minutes of Meeting
          </h1>
          <p className="text-sm leading-6 text-muted-foreground md:text-base">
            Create a new meeting record.
          </p>
        </div>

        <MeetingCreateForm
          projects={projectRows}
          initialValues={{
            agenda: "",
            attendees: sessionUser.name,
            chairperson: sessionUser.name,
            decisions: "",
            issuedDate: getCurrentDate(),
            location: "Main site office",
            meetingDate: getCurrentDate(),
            meetingType: "progress",
            momNumber: generateMinutesOfMeetingNumber(
              firstProject?.projectNumber,
            ),
            nextMeeting: getFutureDate(7),
            projectId: firstProject?.id || "",
            status: "scheduled",
            title: "",
          }}
        />
      </div>
    </ScrollableContent>
  );
}
