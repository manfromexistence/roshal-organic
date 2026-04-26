import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";
import { ProjectSwitcher } from "@/components/config/project-switcher";
import { ErrorFallback } from "@/components/error-fallback";
import { ScrollableContent } from "@/components/scrollable-content";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getEdmsDashboardData } from "@/lib/edms/dashboard";
import { getProjectConfigData } from "@/lib/edms/project-config";
import { canConfigureEdmsProject, canDeleteEdmsContent } from "@/lib/edms/rbac";
import { getRequiredDashboardSessionUser } from "@/lib/edms/session";
import { ConfigDisciplines } from "./tabs/disciplines";
import { ConfigDocTypes } from "./tabs/doc-types";
import { ConfigGeneral } from "./tabs/general";
import { ConfigNumbering } from "./tabs/numbering";
import { ConfigStakeholders } from "./tabs/stakeholders";
import { ConfigWorkflow } from "./tabs/workflow";

export const metadata: Metadata = {
  title: "Project Setup | Quadra EDMS",
};

export default async function ProjectSetupPage({
  searchParams,
}: {
  searchParams: Promise<{ projectId?: string }>;
}) {
  const sessionUser = await getRequiredDashboardSessionUser();
  const params = await searchParams;
  const dashboardData = await getEdmsDashboardData(sessionUser);

  // Use provided projectId or get first available project
  let projectId = params.projectId;

  if (!projectId) {
    // Get user's projects and use the first one
    if (dashboardData.projects.length === 0) {
      // No projects available, show message
      return (
        <ScrollableContent>
          <div className="flex flex-col gap-6 px-8 pt-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Project Setup
              </h1>
              <p className="text-sm leading-6 text-muted-foreground md:text-base">
                No projects available. Please create a project first.
              </p>
            </div>
          </div>
        </ScrollableContent>
      );
    }

    projectId = dashboardData.projects[0].id;
  }

  const resolvedProjectId = projectId ?? "";
  const configData = await getProjectConfigData(sessionUser, resolvedProjectId);
  const canConfigure = canConfigureEdmsProject(sessionUser.role);
  const canDelete = canDeleteEdmsContent(sessionUser.role);

  return (
    <ScrollableContent>
      <div className="flex min-w-0 flex-col gap-6 overflow-x-hidden px-4 pt-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl space-y-3">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Project Setup
              </h1>
              <p className="text-sm leading-6 text-muted-foreground md:text-base">
                Define the numbering scheme, disciplines, document types,
                stakeholders, and approval workflow for this project.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="space-y-2">
              <Label htmlFor="project-switcher">Select Project</Label>
              <ProjectSwitcher
                projects={dashboardData.projects}
                currentProjectId={resolvedProjectId}
              />
            </div>
          </div>
        </div>

        {!canConfigure ? (
          <div className="rounded-md border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
            This role can review project setup, but only PMC and admin users can
            change configuration. Delete actions remain admin-only.
          </div>
        ) : null}

        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense
            fallback={
              <div className="text-sm text-muted-foreground">
                Loading configuration...
              </div>
            }
          >
            <Card className="min-w-0 overflow-hidden border-border bg-card shadow-sm">
              <CardContent className="p-0">
                <Tabs defaultValue="general" className="min-w-0 w-full">
                  <div className="min-w-0 overflow-hidden border-b border-border px-4 pb-4 sm:px-6 sm:pb-6">
                    <TabsList className="!grid !h-auto !min-w-0 !w-full !grid-cols-1 justify-start gap-2 !bg-transparent !p-0 sm:!grid-cols-2 lg:!grid-cols-3 2xl:!grid-cols-6">
                      <TabsTrigger
                        value="general"
                        className="h-auto min-w-0 !w-full !grow-0 !shrink-0 justify-start whitespace-normal break-words border border-border px-3 py-2 text-left text-xs leading-tight data-[state=active]:border-transparent sm:text-sm"
                      >
                        General
                      </TabsTrigger>
                      <TabsTrigger
                        value="numbering"
                        className="h-auto min-w-0 !w-full !grow-0 !shrink-0 justify-start whitespace-normal break-words border border-border px-3 py-2 text-left text-xs leading-tight data-[state=active]:border-transparent sm:text-sm"
                      >
                        Numbering Scheme
                      </TabsTrigger>
                      <TabsTrigger
                        value="disciplines"
                        className="h-auto min-w-0 !w-full !grow-0 !shrink-0 justify-start whitespace-normal break-words border border-border px-3 py-2 text-left text-xs leading-tight data-[state=active]:border-transparent sm:text-sm"
                      >
                        Disciplines
                        {configData.disciplines.length > 0 && (
                          <span className="ml-1 text-xs">
                            ({configData.disciplines.length})
                          </span>
                        )}
                      </TabsTrigger>
                      <TabsTrigger
                        value="doctypes"
                        className="h-auto min-w-0 !w-full !grow-0 !shrink-0 justify-start whitespace-normal break-words border border-border px-3 py-2 text-left text-xs leading-tight data-[state=active]:border-transparent sm:text-sm"
                      >
                        Document Types
                        {configData.documentTypes.length > 0 && (
                          <span className="ml-1 text-xs">
                            ({configData.documentTypes.length})
                          </span>
                        )}
                      </TabsTrigger>
                      <TabsTrigger
                        value="stakeholders"
                        className="h-auto min-w-0 !w-full !grow-0 !shrink-0 justify-start whitespace-normal break-words border border-border px-3 py-2 text-left text-xs leading-tight data-[state=active]:border-transparent sm:text-sm"
                      >
                        Stakeholders
                        {configData.stakeholders.length > 0 && (
                          <span className="ml-1 text-xs">
                            ({configData.stakeholders.length})
                          </span>
                        )}
                      </TabsTrigger>
                      <TabsTrigger
                        value="workflow"
                        className="h-auto min-w-0 !w-full !grow-0 !shrink-0 justify-start whitespace-normal break-words border border-border px-3 py-2 text-left text-xs leading-tight data-[state=active]:border-transparent sm:text-sm"
                      >
                        Workflow
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <div className="min-w-0 p-4 sm:p-6">
                    <TabsContent value="general" className="mt-0">
                      <ConfigGeneral
                        projectId={resolvedProjectId}
                        project={configData.project}
                        canEdit={canConfigure}
                      />
                    </TabsContent>

                    <TabsContent value="numbering" className="mt-0">
                      <ConfigNumbering
                        projectId={resolvedProjectId}
                        config={configData.config}
                        canEdit={canConfigure}
                      />
                    </TabsContent>

                    <TabsContent value="disciplines" className="mt-0">
                      <ConfigDisciplines
                        projectId={resolvedProjectId}
                        disciplines={configData.disciplines}
                        canEdit={canConfigure}
                        canDelete={canDelete}
                      />
                    </TabsContent>

                    <TabsContent value="doctypes" className="mt-0">
                      <ConfigDocTypes
                        projectId={resolvedProjectId}
                        documentTypes={configData.documentTypes}
                        canEdit={canConfigure}
                        canDelete={canDelete}
                      />
                    </TabsContent>

                    <TabsContent value="stakeholders" className="mt-0">
                      <ConfigStakeholders
                        projectId={resolvedProjectId}
                        stakeholders={configData.stakeholders}
                        canEdit={canConfigure}
                        canDelete={canDelete}
                      />
                    </TabsContent>

                    <TabsContent value="workflow" className="mt-0">
                      <ConfigWorkflow
                        projectId={resolvedProjectId}
                        workflowSteps={configData.workflowSteps}
                        canEdit={canConfigure}
                        canDelete={canDelete}
                      />
                    </TabsContent>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </Suspense>
        </ErrorBoundary>
      </div>
    </ScrollableContent>
  );
}
