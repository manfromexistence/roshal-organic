import type { Metadata } from "next";
import Link from "next/link";
import { ScrollableContent } from "@/components/scrollable-content";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getFirstAccessibleProjectId } from "@/lib/edms/access";
import { getRequiredDashboardSessionUser } from "@/lib/edms/session";
import { getIncomingTransmittals } from "@/lib/edms/transmittals";

export const metadata: Metadata = {
  title: "Incoming Transmittals | Quadra EDMS",
};

export default async function IncomingTransmittalsPage() {
  const sessionUser = await getRequiredDashboardSessionUser();
  const projectId = await getFirstAccessibleProjectId(sessionUser);

  if (!projectId) {
    return (
      <ScrollableContent>
        <div className="flex flex-col gap-6 px-8 pt-8">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Incoming Transmittals
          </h1>
          <p className="text-sm text-muted-foreground">
            No accessible projects found. Please contact your administrator.
          </p>
        </div>
      </ScrollableContent>
    );
  }

  const transmittals = await getIncomingTransmittals(projectId);

  return (
    <ScrollableContent>
      <div className="flex flex-col gap-6 px-8 pt-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl space-y-3">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Incoming Transmittals
              </h1>
              <p className="text-sm leading-6 text-muted-foreground md:text-base">
                Track incoming transmittals from external parties with review
                and response tracking.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link href="/transmittals">View Outgoing</Link>
            </Button>
          </div>
        </div>

        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle>Incoming Transmittal Register</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            {transmittals.length === 0 ? (
              <div className="px-6 pb-6 text-sm text-muted-foreground">
                No incoming transmittals found.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {transmittals.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between px-6 py-4 hover:bg-accent/50"
                  >
                    <div>
                      <p className="font-medium">{t.transmittalNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        {t.subject}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{t.status}</p>
                      <p className="text-xs text-muted-foreground">
                        {t.sentLabel}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ScrollableContent>
  );
}
