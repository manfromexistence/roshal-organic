import type { Metadata } from "next";
import Link from "next/link";
import { LettersDataTable } from "@/components/edms/letters-data-table";
import { ScrollableContent } from "@/components/scrollable-content";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getFirstAccessibleProjectId } from "@/lib/edms/access";
import { getLetters } from "@/lib/edms/correspondence";
import { getRequiredDashboardSessionUser } from "@/lib/edms/session";

export const metadata: Metadata = {
  title: "Letters | Quadra EDMS",
};

export default async function LettersPage() {
  const sessionUser = await getRequiredDashboardSessionUser();
  const projectId = await getFirstAccessibleProjectId(sessionUser);

  if (!projectId) {
    return (
      <ScrollableContent>
        <div className="flex flex-col gap-6 px-8 pt-8">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Letters
          </h1>
          <p className="text-sm text-muted-foreground">
            No accessible projects found. Please contact your administrator.
          </p>
        </div>
      </ScrollableContent>
    );
  }

  const letters = await getLetters(projectId);

  return (
    <ScrollableContent>
      <div className="flex flex-col gap-6 px-8 pt-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl space-y-3">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Letters
              </h1>
              <p className="text-sm leading-6 text-muted-foreground md:text-base">
                Incoming and outgoing correspondence register with tracking and
                management capabilities.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link href="/memos">Memos</Link>
            </Button>
            <Button asChild>
              <Link href="/letters/new">+ New Letter</Link>
            </Button>
          </div>
        </div>

        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle>Letter Register</CardTitle>
          </CardHeader>
          <CardContent className="px-6">
            {letters.length === 0 ? (
              <div className="pb-6 text-sm text-muted-foreground">
                No letters found.
              </div>
            ) : (
              <LettersDataTable letters={letters} />
            )}
          </CardContent>
        </Card>
      </div>
    </ScrollableContent>
  );
}
