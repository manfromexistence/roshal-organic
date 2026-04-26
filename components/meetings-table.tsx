"use client";

import Link from "next/link";

interface Meeting {
  id: string;
  momNumber: string;
  title: string;
  meetingType: string;
  meetingDate: string;
  location: string;
  attendees: string;
  status: string;
  chairperson: string;
}

interface MeetingsTableProps {
  meetings: Meeting[];
}

export function MeetingsTable({ meetings }: MeetingsTableProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium">MoM ID</th>
                <th className="px-4 py-3 text-left font-medium">
                  Meeting Title
                </th>
                <th className="px-4 py-3 text-left font-medium">Type</th>
                <th className="px-4 py-3 text-left font-medium">
                  Meeting Date
                </th>
                <th className="px-4 py-3 text-left font-medium">Location</th>
                <th className="px-4 py-3 text-left font-medium">Attendees</th>
                <th className="px-4 py-3 text-left font-medium">
                  Action Items
                </th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {meetings.map((meeting) => (
                <tr key={meeting.id} className="border-b hover:bg-muted/50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/meetings/${meeting.id}`}
                      className="font-mono text-xs font-medium hover:text-primary transition-colors"
                    >
                      {meeting.momNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <div className="max-w-md font-medium">
                        {meeting.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Chair: {meeting.chairperson}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs">{meeting.meetingType}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {meeting.meetingDate}
                  </td>
                  <td className="px-4 py-3 text-xs">{meeting.location}</td>
                  <td className="px-4 py-3 font-mono text-xs">
                    {meeting.attendees}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">—</td>
                  <td className="px-4 py-3 text-xs">{meeting.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
