import type { Metadata } from "next";
import Link from "next/link";
import { InspectionsTable } from "@/components/inspections-table";
import { ScrollableContent } from "@/components/scrollable-content";
import { Button } from "@/components/ui/button";
import { getFirstAccessibleProjectId } from "@/lib/edms/access";
import { getInspections } from "@/lib/edms/inspections";
import { getRequiredDashboardSessionUser } from "@/lib/edms/session";

export const metadata: Metadata = {
  title: "Inspections | Quadra EDMS",
};

export default async function InspectionsPage() {
  const sessionUser = await getRequiredDashboardSessionUser();
  const projectId = await getFirstAccessibleProjectId(sessionUser);

  if (!projectId) {
    return (
      <ScrollableContent>
        <div className="flex flex-col gap-6 px-8 pt-8">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Inspections
          </h1>
          <p className="text-sm text-muted-foreground">
            No accessible projects found. Please contact your administrator.
          </p>
        </div>
      </ScrollableContent>
    );
  }

  const inspections = await getInspections(projectId);

  return (
    <ScrollableContent>
      <div className="flex flex-col gap-6 px-8 pt-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl space-y-3">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Inspections
              </h1>
              <p className="text-sm leading-6 text-muted-foreground md:text-base">
                Track inspection schedules, results, and deficiencies across the
                project.
              </p>
            </div>
          </div>

          <Button asChild>
            <Link href="/inspections/new">New Inspection</Link>
          </Button>
        </div>

        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold tracking-tight">
              Inspection Register
            </h2>
            <p className="text-sm text-muted-foreground">
              Schedules, inspectors, results, and locations in the shared table
              view.
            </p>
          </div>

          {inspections.length === 0 ? (
            <div className="flex flex-col items-start gap-3 rounded-md border border-dashed p-6 text-sm text-muted-foreground">
              <p>No inspections found.</p>
              <Button asChild variant="outline">
                <Link href="/inspections/new">Create the first inspection</Link>
              </Button>
            </div>
          ) : (
            <InspectionsTable inspections={inspections} />
          )}
        </section>
      </div>
    </ScrollableContent>
  );
}
