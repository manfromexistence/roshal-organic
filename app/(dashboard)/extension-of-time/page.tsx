import type { Metadata } from "next";
import Link from "next/link";
import { ExtensionOfTimeTable } from "@/components/extension-of-time-table";
import { ScrollableContent } from "@/components/scrollable-content";
import { Button } from "@/components/ui/button";
import { getFirstAccessibleProjectId } from "@/lib/edms/access";
import { getExtensionOfTimeRequests } from "@/lib/edms/extension-of-time";
import { getRequiredDashboardSessionUser } from "@/lib/edms/session";

export const metadata: Metadata = {
  title: "Extension of Time | Quadra EDMS",
};

export default async function ExtensionOfTimePage() {
  const sessionUser = await getRequiredDashboardSessionUser();
  const projectId = await getFirstAccessibleProjectId(sessionUser);

  if (!projectId) {
    return (
      <ScrollableContent>
        <div className="flex flex-col gap-6 px-8 pt-8">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Extension of Time
          </h1>
          <p className="text-sm text-muted-foreground">
            No accessible projects found. Please contact your administrator.
          </p>
        </div>
      </ScrollableContent>
    );
  }

  const eotRequests = await getExtensionOfTimeRequests(projectId);

  return (
    <ScrollableContent>
      <div className="flex flex-col gap-6 px-8 pt-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl space-y-3">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Extension of Time
              </h1>
              <p className="text-sm leading-6 text-muted-foreground md:text-base">
                Track EOT requests, approval workflows, and schedule impacts.
              </p>
            </div>
          </div>

          <Button asChild>
            <Link href="/extension-of-time/new">New EOT Request</Link>
          </Button>
        </div>

        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold tracking-tight">
              EOT Register
            </h2>
            <p className="text-sm text-muted-foreground">
              Delay days, submission dates, and approval flow in the shared
              table view.
            </p>
          </div>

          {eotRequests.length === 0 ? (
            <div className="flex flex-col items-start gap-3 rounded-md border border-dashed p-6 text-sm text-muted-foreground">
              <p>No EOT requests found.</p>
              <Button asChild variant="outline">
                <Link href="/extension-of-time/new">
                  Create the first EOT request
                </Link>
              </Button>
            </div>
          ) : (
            <ExtensionOfTimeTable eotRequests={eotRequests} />
          )}
        </section>
      </div>
    </ScrollableContent>
  );
}
