import { eq } from "drizzle-orm";
import { ArrowLeft, Calendar, FileText, MapPin, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/lib/db";
import { minutesOfMeeting, users } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Meeting Details | Quadra EDMS",
};

export default async function MeetingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await db
    .select({
      agenda: minutesOfMeeting.agenda,
      chairperson: minutesOfMeeting.chairperson,
      decisions: minutesOfMeeting.decisions,
      id: minutesOfMeeting.id,
      issuedDate: minutesOfMeeting.issuedDate,
      location: minutesOfMeeting.location,
      meetingDate: minutesOfMeeting.meetingDate,
      meetingType: minutesOfMeeting.meetingType,
      minuteTakerName: users.name,
      momNumber: minutesOfMeeting.momNumber,
      status: minutesOfMeeting.status,
      title: minutesOfMeeting.title,
    })
    .from(minutesOfMeeting)
    .leftJoin(users, eq(minutesOfMeeting.minuteTaker, users.id))
    .where(eq(minutesOfMeeting.id, id));
  const meeting = result[0];

  if (!meeting) {
    notFound();
  }

  return (
    <div className="container mx-auto px-8 py-6">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/meetings">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Meetings
          </Link>
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{meeting.title}</CardTitle>
            <CardDescription>MoM Number: {meeting.momNumber}</CardDescription>
          </CardHeader>
        </Card>

        {/* Meeting Details */}
        <Card>
          <CardHeader>
            <CardTitle>Meeting Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Meeting Date</p>
                <p className="text-sm text-muted-foreground">
                  {meeting.meetingDate
                    ? new Date(meeting.meetingDate).toLocaleDateString()
                    : "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Issued Date</p>
                <p className="text-sm text-muted-foreground">
                  {meeting.issuedDate
                    ? new Date(meeting.issuedDate).toLocaleDateString()
                    : "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Location</p>
                <p className="text-sm text-muted-foreground">
                  {meeting.location || "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Meeting Type</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {meeting.meetingType || "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FileText className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Status</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {meeting.status}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Chairperson</p>
                <p className="text-sm text-muted-foreground">
                  {meeting.chairperson || "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Minute Taker</p>
                <p className="text-sm text-muted-foreground">
                  {meeting.minuteTakerName || "Not specified"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Agenda */}
        {meeting.agenda && (
          <Card>
            <CardHeader>
              <CardTitle>Agenda</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {meeting.agenda}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Key Decisions */}
        {meeting.decisions && (
          <Card>
            <CardHeader>
              <CardTitle>Key Decisions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {meeting.decisions}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
