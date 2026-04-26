import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { OrganizationsDataTable } from "@/components/admin/organizations-data-table";
import { ScrollableContent } from "@/components/scrollable-content";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { getRequiredSessionUser } from "@/lib/edms/session";
import { organizations, users } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Organizations | Quadra EDMS",
};

export default async function OrganizationsPage() {
  const _sessionUser = await getRequiredSessionUser();

  // Fetch organizations with user count
  const allOrganizations = await db.select().from(organizations);

  // Get user count for each organization
  const orgsWithUserCount = await Promise.all(
    allOrganizations.map(async (org) => {
      const userCount = await db
        .select()
        .from(users)
        .where(eq(users.organizationId, org.id))
        .then((result) => result.length);

      return {
        ...org,
        userCount,
      };
    }),
  );

  return (
    <ScrollableContent>
      <div className="flex flex-col gap-6 px-8 pt-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Organization Management
          </h1>
          <p className="text-sm leading-6 text-muted-foreground md:text-base">
            Manage organizations and their members.
          </p>
        </div>

        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle>All Organizations</CardTitle>
          </CardHeader>
          <CardContent className="px-6">
            {orgsWithUserCount.length === 0 ? (
              <div className="pb-6 text-sm text-muted-foreground">
                No organizations found.
              </div>
            ) : (
              <OrganizationsDataTable organizations={orgsWithUserCount} />
            )}
          </CardContent>
        </Card>
      </div>
    </ScrollableContent>
  );
}
