import type { Metadata } from "next";
import { ChangeOrdersTable } from "@/components/change-orders-table";
import { ScrollableContent } from "@/components/scrollable-content";
import { getFirstAccessibleProjectId } from "@/lib/edms/access";
import { getChangeOrders } from "@/lib/edms/change-orders";
import { getRequiredDashboardSessionUser } from "@/lib/edms/session";

export const metadata: Metadata = {
  title: "Change Orders | Quadra EDMS",
};

export default async function ChangeOrdersPage() {
  const sessionUser = await getRequiredDashboardSessionUser();
  const projectId = await getFirstAccessibleProjectId(sessionUser);

  if (!projectId) {
    return (
      <ScrollableContent>
        <div className="flex flex-col gap-6 px-8 pt-8">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Change Orders
          </h1>
          <p className="text-sm text-muted-foreground">
            No accessible projects found. Please contact your administrator.
          </p>
        </div>
      </ScrollableContent>
    );
  }

  const changeOrders = await getChangeOrders(projectId);

  return (
    <ScrollableContent>
      <div className="flex flex-col gap-6 px-8 pt-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl space-y-3">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Change Orders
              </h1>
              <p className="text-sm leading-6 text-muted-foreground md:text-base">
                Track contract variations, cost impacts, and approval workflows.
              </p>
            </div>
          </div>
        </div>

        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold tracking-tight">
              Change Order Register
            </h2>
            <p className="text-sm text-muted-foreground">
              Contract variations, values, and approval states in the shared
              data-table layout.
            </p>
          </div>

          {changeOrders.length === 0 ? (
            <div className="rounded-md border border-dashed p-6 text-sm text-muted-foreground">
              No change orders found.
            </div>
          ) : (
            <ChangeOrdersTable changeOrders={changeOrders} />
          )}
        </section>
      </div>
    </ScrollableContent>
  );
}
