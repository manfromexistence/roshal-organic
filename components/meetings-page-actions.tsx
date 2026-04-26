"use client";

import { ExportButton } from "@/components/edms/export-button";

export function MeetingsPageActions({ meetings }: { meetings: any[] }) {
  const exportData = meetings.map((meeting) => ({
    momNumber: meeting.momNumber,
    title: meeting.title,
    meetingType: meeting.meetingType,
    meetingDate: meeting.meetingDate,
    location: meeting.location,
    attendees: meeting.attendees,
    status: meeting.status,
  }));

  return (
    <ExportButton
      data={exportData}
      columns={[
        { header: "MoM ID", key: "momNumber", width: 20 },
        { header: "Title", key: "title", width: 40 },
        { header: "Type", key: "meetingType", width: 18 },
        { header: "Meeting Date", key: "meetingDate", width: 18 },
        { header: "Location", key: "location", width: 24 },
        { header: "Attendees", key: "attendees", width: 24 },
        { header: "Status", key: "status", width: 16 },
      ]}
      title="Minutes of Meeting"
      filename="minutes_of_meeting"
      variant="outline"
      metadata={[
        { label: "Generated", value: new Date().toLocaleDateString() },
        { label: "Total Records", value: String(meetings.length) },
      ]}
    />
  );
}
