"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { getRequiredDashboardSessionUser } from "@/lib/edms/session";
import { activityLog, minutesOfMeeting, momAttendees } from "@/lib/schema";

const createMeetingSchema = z.object({
  agenda: z.string().trim().optional(),
  attendees: z.string().trim().optional(),
  chairperson: z.string().trim().min(2),
  issuedDate: z.string().trim().min(1),
  location: z.string().trim().min(2),
  meetingDate: z.string().trim().min(1),
  meetingType: z.enum(["site", "design", "progress", "technical"]),
  momNumber: z.string().trim().min(2),
  nextMeeting: z.string().trim().optional(),
  projectId: z.string().min(1),
  decisions: z.string().trim().optional(),
  status: z.enum(["scheduled", "completed", "cancelled"]),
  title: z.string().trim().min(2),
});

export async function createMeeting(
  input: z.infer<typeof createMeetingSchema>,
): Promise<{
  success: boolean;
  error?: { message: string };
  data?: { id: string };
}> {
  try {
    const sessionUser = await getRequiredDashboardSessionUser();
    const values = createMeetingSchema.parse(input);
    const meetingId = crypto.randomUUID();
    const now = new Date();

    await db.insert(minutesOfMeeting).values({
      agenda: values.agenda || "",
      chairperson: values.chairperson,
      createdAt: now,
      decisions: values.decisions || "",
      distribution: JSON.stringify(
        values.attendees
          ? values.attendees
              .split(/\r?\n/g)
              .map((entry) => entry.trim())
              .filter(Boolean)
          : [],
      ),
      id: meetingId,
      issuedDate: new Date(values.issuedDate),
      location: values.location,
      meetingDate: new Date(values.meetingDate),
      meetingType: values.meetingType,
      minuteTaker: sessionUser.id,
      momNumber: values.momNumber,
      nextMeeting: values.nextMeeting ? new Date(values.nextMeeting) : null,
      projectId: values.projectId,
      status: values.status,
      title: values.title,
      updatedAt: now,
    });

    const attendeeNames = values.attendees
      ? values.attendees
          .split(/\r?\n/g)
          .map((entry) => entry.trim())
          .filter(Boolean)
      : [];

    if (attendeeNames.length > 0) {
      await db.insert(momAttendees).values(
        attendeeNames.map((name) => ({
          createdAt: now,
          id: crypto.randomUUID(),
          momId: meetingId,
          name,
          organization: "Unspecified",
          role: null,
        })),
      );
    }

    await db.insert(activityLog).values({
      action: "meeting_created",
      createdAt: now,
      description: `Created meeting ${values.momNumber}`,
      entityId: meetingId,
      entityName: values.momNumber,
      entityType: "meeting",
      id: crypto.randomUUID(),
      projectId: values.projectId,
      userId: sessionUser.id,
    });

    revalidatePath("/meetings");
    revalidatePath("/meetings/new");

    return { success: true, data: { id: meetingId } };
  } catch (error) {
    console.error("Failed to create meeting:", error);
    return {
      success: false,
      error: { message: "Failed to create the meeting record." },
    };
  }
}
