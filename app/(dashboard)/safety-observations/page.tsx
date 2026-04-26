import type { Metadata } from "next";
import Link from "next/link";
import { SafetyObservationsTable } from "@/components/safety-observations-table";
import { ScrollableContent } from "@/components/scrollable-content";
import { Button } from "@/components/ui/button";
import { getFirstAccessibleProjectId } from "@/lib/edms/access";
import { getSafetyObservations } from "@/lib/edms/safety-observations";
import { getRequiredDashboardSessionUser } from "@/lib/edms/session";

export const metadata: Metadata = {
  title: "Safety Observations | Quadra EDMS",
};

export default async function SafetyObservationsPage() {
  const sessionUser = await getRequiredDashboardSessionUser();
  const projectId = await getFirstAccessibleProjectId(sessionUser);

  if (!projectId) {
    return (
      <ScrollableContent>
        <div className="flex flex-col gap-6 px-8 pt-8">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Safety Observations
          </h1>
          <p className="text-sm text-muted-foreground">
            No accessible projects found. Please contact your administrator.
          </p>
        </div>
      </ScrollableContent>
    );
  }

  const observations = await getSafetyObservations(projectId);

  return (
    <ScrollableContent>
      <div className="flex flex-col gap-6 px-8 pt-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl space-y-3">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Safety Observations
              </h1>
              <p className="text-sm leading-6 text-muted-foreground md:text-base">
                Track unsafe conditions, acts, near misses, and corrective
                actions.
              </p>
            </div>
          </div>

          <Button asChild>
            <Link href="/safety-observations/new">New Observation</Link>
          </Button>
        </div>

        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold tracking-tight">
              Safety Register
            </h2>
            <p className="text-sm text-muted-foreground">
              Observations, severity, and reporting status in the shared table
              layout.
            </p>
          </div>

          {observations.length === 0 ? (
            <div className="flex flex-col items-start gap-3 rounded-md border border-dashed p-6 text-sm text-muted-foreground">
              <p>No safety observations found.</p>
              <Button asChild variant="outline">
                <Link href="/safety-observations/new">
                  Create the first observation
                </Link>
              </Button>
            </div>
          ) : (
            <SafetyObservationsTable observations={observations} />
          )}
        </section>
      </div>
    </ScrollableContent>
  );
}
