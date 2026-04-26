import { desc, eq } from "drizzle-orm";
import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/lib/db";
import { organizations, users } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Members | Quadra EDMS",
};

export default async function MembersPage() {
  const members = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      organizationName: organizations.name,
      createdAt: users.createdAt,
    })
    .from(users)
    .leftJoin(organizations, eq(users.organizationId, organizations.id))
    .orderBy(desc(users.createdAt));

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Members
        </h1>
        <p className="text-sm leading-6 text-muted-foreground md:text-base">
          Workspace users, their current roles, and organization assignments.
        </p>
      </header>

      {members.length === 0 ? (
        <Card className="border-border bg-card shadow-sm">
          <CardContent className="p-6 text-sm text-muted-foreground">
            No members are available in the current workspace.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {members.map((member) => (
            <Card key={member.id} className="border-border bg-card shadow-sm">
              <CardContent className="flex flex-col gap-3 p-6 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                  <p className="text-base font-medium">{member.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {member.email}
                  </p>
                </div>
                <div className="grid gap-3 text-sm text-muted-foreground md:grid-cols-3 md:text-right">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em]">Role</p>
                    <p className="mt-1 text-foreground">{member.role}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em]">
                      Organization
                    </p>
                    <p className="mt-1 text-foreground">
                      {member.organizationName || "Unassigned"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em]">Joined</p>
                    <p className="mt-1 text-foreground">
                      {new Date(member.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
