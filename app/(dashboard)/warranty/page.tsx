import type { Metadata } from "next";
import Link from "next/link";
import { ScrollableContent } from "@/components/scrollable-content";
import { Button } from "@/components/ui/button";
import { WarrantyTable } from "@/components/warranty-table";
import { getFirstAccessibleProjectId } from "@/lib/edms/access";
import { getRequiredDashboardSessionUser } from "@/lib/edms/session";
import { getWarrantyRecords } from "@/lib/edms/warranty";

export const metadata: Metadata = {
  title: "Warranty | Quadra EDMS",
};

export default async function WarrantyPage() {
  const sessionUser = await getRequiredDashboardSessionUser();
  const projectId = await getFirstAccessibleProjectId(sessionUser);

  if (!projectId) {
    return (
      <ScrollableContent>
        <div className="flex flex-col gap-6 px-8 pt-6">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Warranty
          </h1>
          <p className="text-sm text-muted-foreground">
            No accessible projects found. Please contact your administrator.
          </p>
        </div>
      </ScrollableContent>
    );
  }

  const warranties = await getWarrantyRecords(projectId);

  return (
    <ScrollableContent>
      <div className="flex flex-col gap-6 px-8 pt-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl space-y-3">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Warranty
              </h1>
              <p className="text-sm leading-6 text-muted-foreground md:text-base">
                Track manufacturer, contractor, and system warranties with
                expiry dates.
              </p>
            </div>
          </div>

          <Button asChild>
            <Link href="/warranty/new">New Warranty Record</Link>
          </Button>
        </div>

        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold tracking-tight">
              Warranty Register
            </h2>
            <p className="text-sm text-muted-foreground">
              Providers, systems, and expiry tracking in the shared table view.
            </p>
          </div>

          {warranties.length === 0 ? (
            <div className="flex flex-col items-start gap-3 rounded-md border border-dashed p-6 text-sm text-muted-foreground">
              <p>No warranty records found.</p>
              <Button asChild variant="outline">
                <Link href="/warranty/new">Create the first warranty</Link>
              </Button>
            </div>
          ) : (
            <WarrantyTable warranties={warranties} />
          )}
        </section>
      </div>
    </ScrollableContent>
  );
}
