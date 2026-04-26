import { desc } from "drizzle-orm";
import type { Metadata } from "next";
import { LetterCreateForm } from "@/components/edms/letter-create-form";
import { ScrollableContent } from "@/components/scrollable-content";
import { db } from "@/lib/db";
import { getRequiredDashboardSessionUser } from "@/lib/edms/session";
import { projects } from "@/lib/schema";

export const metadata: Metadata = {
  title: "New Letter | Quadra EDMS",
};

export default async function NewLetterPage() {
  const sessionUser = await getRequiredDashboardSessionUser();
  const projectRows = await db
    .select({
      id: projects.id,
      name: projects.name,
      projectNumber: projects.projectNumber,
    })
    .from(projects)
    .orderBy(desc(projects.createdAt));

  return (
    <ScrollableContent>
      <div className="flex flex-col gap-6 px-8 pt-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            New Letter
          </h1>
          <p className="text-sm leading-6 text-muted-foreground md:text-base">
            Create a new correspondence letter.
          </p>
        </div>

        <LetterCreateForm
          projects={projectRows}
          currentUserName={sessionUser.name}
        />
      </div>
    </ScrollableContent>
  );
}
