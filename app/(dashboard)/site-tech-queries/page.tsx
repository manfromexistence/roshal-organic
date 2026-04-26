import type { Metadata } from "next";
import Link from "next/link";
import { ScrollableContent } from "@/components/scrollable-content";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getFirstAccessibleProjectId } from "@/lib/edms/access";
import { getRequiredDashboardSessionUser } from "@/lib/edms/session";
import { getSiteTechnicalQueries } from "@/lib/edms/site-technical-queries";

export const metadata: Metadata = {
  title: "Site Technical Queries | Quadra EDMS",
};

export default async function SiteTechnicalQueriesPage() {
  const sessionUser = await getRequiredDashboardSessionUser();
  const projectId = await getFirstAccessibleProjectId(sessionUser);

  if (!projectId) {
    return (
      <ScrollableContent>
        <div className="flex flex-col gap-6 px-8 pt-8">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Site Technical Queries
          </h1>
          <p className="text-sm text-muted-foreground">
            No accessible projects found. Please contact your administrator.
          </p>
        </div>
      </ScrollableContent>
    );
  }

  const queries = await getSiteTechnicalQueries(projectId);

  return (
    <ScrollableContent>
      <div className="flex flex-col gap-6 px-8 pt-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl space-y-3">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Site Technical Queries
              </h1>
              <p className="text-sm leading-6 text-muted-foreground md:text-base">
                Track technical queries raised during construction phase for
                clarification and resolution.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link href="/technical-queries">Technical Queries</Link>
            </Button>
            <Button asChild>
              <Link href="/site-tech-queries/new">+ New Site Query</Link>
            </Button>
          </div>
        </div>

        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle>Site Technical Query Register</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            {queries.length === 0 ? (
              <div className="px-6 pb-6 text-sm text-muted-foreground">
                No site technical queries found.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {queries.map((q: any) => (
                  <Link
                    key={q.id}
                    href={`/site-tech-queries/${q.id}`}
                    className="flex items-center justify-between px-6 py-4 hover:bg-accent/50"
                  >
                    <div>
                      <p className="font-medium">{q.queryNumber}</p>
                      <p className="text-sm text-muted-foreground">{q.title}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{q.status}</p>
                      <p className="text-xs text-muted-foreground">
                        {q.raisedDate}
                      </p>
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
