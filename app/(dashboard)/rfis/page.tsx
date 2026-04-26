import type { Metadata } from "next";
import Link from "next/link";
import { ScrollableContent } from "@/components/scrollable-content";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getFirstAccessibleProjectId } from "@/lib/edms/access";
import { getRfis } from "@/lib/edms/rfis";
import { getRequiredDashboardSessionUser } from "@/lib/edms/session";

export const metadata: Metadata = {
  title: "RFIs | Quadra EDMS",
};

export default async function RfisPage() {
  const sessionUser = await getRequiredDashboardSessionUser();
  const projectId = await getFirstAccessibleProjectId(sessionUser);

  if (!projectId) {
    return (
      <ScrollableContent>
        <div className="flex flex-col gap-6 px-8 pt-8">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Request for Information
          </h1>
          <p className="text-sm text-muted-foreground">
            No accessible projects found. Please contact your administrator.
          </p>
        </div>
      </ScrollableContent>
    );
  }

  const rfis = await getRfis(projectId);

  return (
    <ScrollableContent>
      <div className="flex flex-col gap-6 px-8 pt-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl space-y-3">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Request for Information
              </h1>
              <p className="text-sm leading-6 text-muted-foreground md:text-base">
                Track RFIs raised during design and construction for
                clarification and information gathering.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link href="/technical-queries">Technical Queries</Link>
            </Button>
            <Button asChild>
              <Link href="/rfis/new">+ New RFI</Link>
            </Button>
          </div>
        </div>

        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle>RFI Register</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            {rfis.length === 0 ? (
              <div className="px-6 pb-6 text-sm text-muted-foreground">
                No RFIs found.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {rfis.map((r: any) => (
                  <Link
                    key={r.id}
                    href={`/rfis/${r.id}`}
                    className="flex items-center justify-between px-6 py-4 hover:bg-accent/50"
                  >
                    <div>
                      <p className="font-medium">{r.rfiNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        {r.subject}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{r.status}</p>
                      <p className="text-xs text-muted-foreground">{r.date}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ScrollableContent>
  );
}
