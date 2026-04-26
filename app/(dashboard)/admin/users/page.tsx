import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { UsersDataTable } from "@/components/admin/users-data-table";
import { ScrollableContent } from "@/components/scrollable-content";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { getRequiredSessionUser } from "@/lib/edms/session";
import { organizations, users } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Users | Quadra EDMS",
};

export default async function UsersPage() {
  const _sessionUser = await getRequiredSessionUser();

  // Fetch users with their organizations
  const allUsers = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      organizationId: users.organizationId,
      orgName: organizations.name,
      orgEmail: organizations.email,
    })
    .from(users)
    .leftJoin(organizations, eq(users.organizationId, organizations.id))
    .orderBy(users.createdAt);

  return (
    <ScrollableContent>
      <div className="flex flex-col gap-6 px-8 pt-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            User Management
          </h1>
          <p className="text-sm leading-6 text-muted-foreground md:text-base">
            Manage system users and their roles.
          </p>
        </div>

        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle>All Users</CardTitle>
          </CardHeader>
          <CardContent className="px-6">
            {allUsers.length === 0 ? (
              <div className="pb-6 text-sm text-muted-foreground">
                No users found.
              </div>
            ) : (
              <UsersDataTable users={allUsers} />
            )}
          </CardContent>
        </Card>
      </div>
    </ScrollableContent>
  );
}
