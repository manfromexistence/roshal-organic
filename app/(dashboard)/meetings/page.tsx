import { Calendar, Users } from "lucide-react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import Link from "next/link";
import { MeetingsDataTable } from "@/components/edms/meetings-data-table";
import { ErrorFallback } from "@/components/error-fallback";
import { MeetingsPageActions } from "@/components/meetings-page-actions";
import { ScrollableContent } from "@/components/scrollable-content";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getFirstAccessibleProjectId } from "@/lib/edms/access";
import { getMinutesOfMeeting } from "@/lib/edms/correspondence";
import { getRequiredDashboardSessionUser } from "@/lib/edms/session";

export const metadata = {
  title: "Minutes of Meeting | Quadra EDMS",
};

export default async function MeetingsPage() {
  const sessionUser = await getRequiredDashboardSessionUser();
  const projectId = await getFirstAccessibleProjectId(sessionUser);
  const dbMeetings = projectId ? await getMinutesOfMeeting(projectId) : [];

  // Map database results to match Meeting interface
  const meetings = dbMeetings.map((m: any) => ({
    id: m.id,
    momNumber: m.momNumber,
    title: m.title,
    meetingType: m.meetingType,
    meetingDate: m.meetingDate || "",
    location: m.location || "",
    attendees: m.chairperson || "Not recorded",
    status: m.status || "",
    chairperson: m.chairperson || "Not recorded",
  }));

  const filteredMeetings = meetings;

  if (!projectId) {
    return (
      <ScrollableContent>
        <div className="flex flex-col gap-6 px-8 pt-6">
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No accessible projects found. Please contact your administrator.
            </p>
          </div>
        </div>
      </ScrollableContent>
    );
  }

  return (
    <ScrollableContent>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <div className="flex flex-col gap-6 px-8 pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl space-y-3">
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                  Minutes of Meeting (MoM)
                </h1>
                <p className="text-sm leading-6 text-muted-foreground md:text-base">
                  Formal meeting records with attendees, decisions, and action
                  items tracking.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <MeetingsPageActions meetings={filteredMeetings} />
              <Button variant="outline" asChild>
                <Link href="/schedule">
                  <Calendar className="size-4" />
                  Schedule Meeting
                </Link>
              </Button>
              <Button asChild>
                <Link href="/meetings/new">
                  <Users className="size-4" />
                  New MoM
                </Link>
              </Button>
            </div>
          </div>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Minutes of Meeting</CardTitle>
            </CardHeader>

            <CardContent className="px-6">
              {filteredMeetings.length === 0 ? (
                <div className="pb-6 text-sm text-muted-foreground">
                  No meetings found matching your criteria
                </div>
              ) : (
                <MeetingsDataTable meetings={filteredMeetings} />
              )}
            </CardContent>
          </Card>
        </div>
      </ErrorBoundary>
    </ScrollableContent>
  );
}
