import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { minutesOfMeeting, momActionItems } from "@/lib/schema";

export interface MeetingData {
  attendees: string;
  chairperson: string;
  id: string;
  location: string;
  meetingDate: string;
  meetingType: string;
  momNumber: string;
  status: string;
  title: string;
}

export async function getMeetingsData(): Promise<MeetingData[]> {
  try {
    const allMeetings = await db
      .select({
        chairperson: minutesOfMeeting.chairperson,
        id: minutesOfMeeting.id,
        location: minutesOfMeeting.location,
        meetingDate: minutesOfMeeting.meetingDate,
        meetingType: minutesOfMeeting.meetingType,
        momNumber: minutesOfMeeting.momNumber,
        status: minutesOfMeeting.status,
        title: minutesOfMeeting.title,
      })
      .from(minutesOfMeeting)
      .orderBy(desc(minutesOfMeeting.meetingDate));

    return allMeetings.map((meeting) => ({
      attendees: meeting.chairperson
        ? `Chair: ${meeting.chairperson}`
        : "Not recorded",
      chairperson: meeting.chairperson,
      id: meeting.id,
      location: meeting.location,
      meetingDate: new Date(meeting.meetingDate).toLocaleDateString(),
      meetingType: meeting.meetingType,
      momNumber: meeting.momNumber,
      status: meeting.status,
      title: meeting.title,
    }));
  } catch (error) {
    console.error("Error fetching meetings:", error);
    return [];
  }
}

export async function getMeetingManagementData(_sessionUser: any) {
  try {
    const [meetingsData, actionItems] = await Promise.all([
      getMeetingsData(),
      db
        .select({
          dueDate: momActionItems.dueDate,
          status: momActionItems.status,
        })
        .from(momActionItems),
    ]);

    const now = new Date();
    const thisMonthMeetings = meetingsData.filter((meeting) => {
      const meetingDate = new Date(meeting.meetingDate);

      return (
        meetingDate.getMonth() === now.getMonth() &&
        meetingDate.getFullYear() === now.getFullYear()
      );
    });

    const pendingActions = actionItems.filter(
      (item) =>
        item.status !== "Completed" &&
        item.status !== "Closed" &&
        item.status !== "Resolved",
    );
    const overdueActions = pendingActions.filter((item) => {
      if (!item.dueDate) {
        return false;
      }

      return new Date(item.dueDate) < now;
    });

    return {
      isUsingFallbackData: false,
      meetings: meetingsData,
      metrics: [
        {
          description: `${meetingsData.length} total meetings`,
          icon: "documents" as const,
          label: "Total Meetings",
          tone: "blue" as const,
          value: meetingsData.length.toString(),
        },
        {
          description: `${thisMonthMeetings.length} meetings this month`,
          icon: "reviews" as const,
          label: "This Month",
          tone: "emerald" as const,
          value: thisMonthMeetings.length.toString(),
        },
        {
          description: `${pendingActions.length} open action items`,
          icon: "transmittals" as const,
          label: "Pending Actions",
          tone: "amber" as const,
          value: pendingActions.length.toString(),
        },
        {
          description: `${overdueActions.length} overdue action items`,
          icon: "notifications" as const,
          label: "Overdue",
          tone: "rose" as const,
          value: overdueActions.length.toString(),
        },
      ],
      statusMessage: "Meeting data loaded successfully",
    };
  } catch (error) {
    console.error("Error fetching meeting management data:", error);
    return {
      isUsingFallbackData: true,
      meetings: [] as MeetingData[],
      metrics: [
        {
          description: "Error loading data",
          icon: "documents" as const,
          label: "Total Meetings",
          tone: "blue" as const,
          value: "0",
        },
        {
          description: "Error loading data",
          icon: "reviews" as const,
          label: "This Month",
          tone: "emerald" as const,
          value: "0",
        },
        {
          description: "Error loading data",
          icon: "transmittals" as const,
          label: "Pending Actions",
          tone: "amber" as const,
          value: "0",
        },
        {
          description: "Error loading data",
          icon: "notifications" as const,
          label: "Overdue",
          tone: "rose" as const,
          value: "0",
        },
      ],
      statusMessage: "Error loading meeting data",
    };
  }
}

export async function getMeetingsPageData(sessionUser: any) {
  return getMeetingManagementData(sessionUser);
}

export async function getMeetings() {
  return getMeetingsData();
}
