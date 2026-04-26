PS F:\hexed\quadra> bunx tsc --noEmit
components/edms/admin-user-edit-sheet.tsx:145:21 - error TS2339: Property 'success' does not exist on type 'UserActivitySummary'.

145         if (!result.success) {
                        ~~~~~~~

components/edms/admin-user-edit-sheet.tsx:148:33 - error TS2339: Property 'error' does not exist on type 'UserActivitySummary'.

148             description: result.error.message,
                                    ~~~~~

components/edms/admin-user-edit-sheet.tsx:155:27 - error TS2339: Property 'data' does not exist on type 'UserActivitySummary'.

155         setSummary(result.data);
                              ~~~~

components/edms/admin-user-edit-sheet.tsx:166:9 - error TS2353: Object literal may only specify known properties, and 'organization' does not exist in type '{ userId: string; name?: string | undefined; email?: string | undefined; }'.

166         organization: values.organization,
            ~~~~~~~~~~~~

components/edms/admin-user-edit-sheet.tsx:175:37 - error TS2339: Property 'error' does not exist on type '{ success: boolean; }'.

175           description: detailResult.error.message,
                                        ~~~~~

components/edms/admin-user-edit-sheet.tsx:192:37 - error TS2339: Property 'error' does not exist on type '{ success: boolean; }'.

192             description: roleResult.error.message,
                                        ~~~~~

components/edms/admin-user-edit-sheet.tsx:204:11 - error TS2353: Object literal may only specify known properties, and 'isActive' does not exist in type '{ userId: string; status: "active" | "inactive"; }'.

204           isActive: values.isActive,
              ~~~~~~~~

components/edms/admin-user-edit-sheet.tsx:210:39 - error TS2339: Property 'error' does not exist on type '{ success: boolean; }'.

210             description: statusResult.error.message,
                                          ~~~~~

components/edms/admin-user-edit-sheet.tsx:229:39 - error TS2345: Argument of type 'string' is not assignable to parameter of type '{ userId: string; }'.

229       const result = await deleteUser(user.id);
                                          ~~~~~~~

components/edms/admin-user-edit-sheet.tsx:234:31 - error TS2339: Property 'error' does not exist on type '{ success: boolean; }'.

234           description: result.error.message,
                                  ~~~~~

components/edms/admin-user-edit-sheet.tsx:310:38 - error TS2339: Property 'documentsUploaded' does not exist on type 'UserActivitySummary'.

310                       value={summary.documentsUploaded}
                                         ~~~~~~~~~~~~~~~~~

components/edms/admin-user-edit-sheet.tsx:314:38 - error TS2339: Property 'commentsAdded' does not exist on type 'UserActivitySummary'.

314                       value={summary.commentsAdded}
                                         ~~~~~~~~~~~~~

components/edms/admin-user-edit-sheet.tsx:318:38 - error TS2339: Property 'workflowsCreated' does not exist on type 'UserActivitySummary'.

318                       value={summary.workflowsCreated}
                                         ~~~~~~~~~~~~~~~~

components/edms/admin-user-edit-sheet.tsx:322:38 - error TS2339: Property 'projectsAssigned' does not exist on type 'UserActivitySummary'.

322                       value={summary.projectsAssigned}
                                         ~~~~~~~~~~~~~~~~

components/edms/admin-users-table.tsx:16:3 - error TS2724: '"@/actions/admin-users"' has no exported member named 'bulkDeleteUsers'. Did you mean 'deleteUser'?   

16   bulkDeleteUsers,
     ~~~~~~~~~~~~~~~

  actions/admin-users.ts:33:23
    33 export async function deleteUser(input: {
                             ~~~~~~~~~~
    'deleteUser' is declared here.

components/edms/admin-users-table.tsx:17:3 - error TS2724: '"@/actions/admin-users"' has no exported member named 'bulkToggleUserStatus'. Did you mean 'toggleUserStatus'?

17   bulkToggleUserStatus,
     ~~~~~~~~~~~~~~~~~~~~

  actions/admin-users.ts:42:23
    42 export async function toggleUserStatus(input: {
                             ~~~~~~~~~~~~~~~~
    'toggleUserStatus' is declared here.

components/edms/admin-users-table.tsx:18:3 - error TS2724: '"@/actions/admin-users"' has no exported member named 'bulkUpdateUserRoles'. Did you mean 'updateUserRole'?

18   bulkUpdateUserRoles,
     ~~~~~~~~~~~~~~~~~~~

  actions/admin-users.ts:23:23
    23 export async function updateUserRole(input: {
                             ~~~~~~~~~~~~~~
    'updateUserRole' is declared here.

components/edms/admin-users-table.tsx:23:20 - error TS2307: Cannot find module '@/components/ui/cn' or its corresponding type declarations.

23 import { cn } from "@/components/ui/cn";
                      ~~~~~~~~~~~~~~~~~~~~

components/edms/dashboard-sections.tsx:29:3 - error TS2305: Module '"@/lib/edms/dashboard"' has no exported member 'DashboardActivityItem'.

29   DashboardActivityItem,
     ~~~~~~~~~~~~~~~~~~~~~

components/edms/dashboard-sections.tsx:30:3 - error TS2305: Module '"@/lib/edms/dashboard"' has no exported member 'DashboardDocument'.

30   DashboardDocument,
     ~~~~~~~~~~~~~~~~~

components/edms/dashboard-sections.tsx:31:3 - error TS2305: Module '"@/lib/edms/dashboard"' has no exported member 'DashboardNotification'.

31   DashboardNotification,
     ~~~~~~~~~~~~~~~~~~~~~

components/edms/dashboard-sections.tsx:32:3 - error TS2305: Module '"@/lib/edms/dashboard"' has no exported member 'DashboardProject'.

32   DashboardProject,
     ~~~~~~~~~~~~~~~~

components/edms/dashboard-sections.tsx:33:3 - error TS2305: Module '"@/lib/edms/dashboard"' has no exported member 'DashboardTransmittal'.

33   DashboardTransmittal,
     ~~~~~~~~~~~~~~~~~~~~

components/edms/dashboard-sections.tsx:34:3 - error TS2305: Module '"@/lib/edms/dashboard"' has no exported member 'DashboardWorkflowItem'.

34   DashboardWorkflowItem,
     ~~~~~~~~~~~~~~~~~~~~~

components/edms/document-create-sheet.tsx:116:24 - error TS18048: 'result.error' is possibly 'undefined'.

116           description: result.error.message,
                           ~~~~~~~~~~~~

components/edms/document-preview-popover.tsx:35:35 - error TS2345: Argument of type 'string | null' is not assignable to parameter of type 'string[] | undefined'.
  Type 'null' is not assignable to type 'string[] | undefined'.

35   const images = expandImageArray(document.images);
                                     ~~~~~~~~~~~~~~~

components/edms/document-upload-form.tsx:11:20 - error TS2307: Cannot find module '@/components/ui/cn' or its corresponding type declarations.

11 import { cn } from "@/components/ui/cn";
                      ~~~~~~~~~~~~~~~~~~~~

components/edms/document-upload-form.tsx:138:9 - error TS2353: Object literal may only specify known properties, and 'discipline' does not exist in type '{ projectId: string; title: string; description?: string | undefined; documentNumber?: string | undefined; revision?: string | undefined; status?: string | undefined; }'.

138         discipline: "GEN", // Default discipline
            ~~~~~~~~~~

components/edms/document-upload-form.tsx:152:24 - error TS18048: 'result.error' is possibly 'undefined'.

152           description: result.error.message,
                           ~~~~~~~~~~~~

components/edms/document-upload-form.tsx:160:41 - error TS2339: Property 'data' does not exist on type '{ success: boolean; error?: { message: string; } | undefined; }'.

160         description: `Document ${result.data.documentNumber} has been added to the register`,
                                            ~~~~

components/edms/document-version-sheet.tsx:9:10 - error TS2724: '"@/actions/documents"' has no exported member named 'createDocumentVersion'. Did you mean 'createDocument'?

9 import { createDocumentVersion } from "@/actions/documents";
           ~~~~~~~~~~~~~~~~~~~~~

  actions/documents.ts:5:23
    5 export async function createDocument(input: {
                            ~~~~~~~~~~~~~~
    'createDocument' is declared here.

components/edms/edms/add-matrix-rule-form.tsx:26:8 - error TS2307: Cannot find module '@midday/ui/table' or its corresponding type declarations.

26 } from "@midday/ui/table";
          ~~~~~~~~~~~~~~~~~~

components/edms/edms/add-section-dialog.tsx:59:37 - error TS2307: Cannot find module '@/db' or its corresponding type declarations.

59         const { db } = await import("@/db");
                                       ~~~~~~

components/edms/edms/add-section-dialog.tsx:60:51 - error TS2307: Cannot find module '@/db/schema/databook' or its corresponding type declarations.

60         const { databookSections } = await import("@/db/schema/databook");
                                                     ~~~~~~~~~~~~~~~~~~~~~~

components/edms/edms/admin-user-edit-sheet.tsx:143:33 - error TS2345: Argument of type 'string' is not assignable to parameter of type '{ userId: string; }'.     

143     void getUserActivitySummary(user.id)
                                    ~~~~~~~

components/edms/edms/admin-user-edit-sheet.tsx:145:21 - error TS2339: Property 'success' does not exist on type 'UserActivitySummary'.

145         if (!result.success) {
                        ~~~~~~~

components/edms/edms/admin-user-edit-sheet.tsx:148:33 - error TS2339: Property 'error' does not exist on type 'UserActivitySummary'.

148             description: result.error.message,
                                    ~~~~~

components/edms/edms/admin-user-edit-sheet.tsx:155:27 - error TS2339: Property 'data' does not exist on type 'UserActivitySummary'.

155         setSummary(result.data);
                              ~~~~

components/edms/edms/admin-user-edit-sheet.tsx:166:9 - error TS2353: Object literal may only specify known properties, and 'organization' does not exist in type '{ userId: string; name?: string | undefined; email?: string | undefined; }'.

166         organization: values.organization,
            ~~~~~~~~~~~~

components/edms/edms/admin-user-edit-sheet.tsx:175:37 - error TS2339: Property 'error' does not exist on type '{ success: boolean; }'.

175           description: detailResult.error.message,
                                        ~~~~~

components/edms/edms/admin-user-edit-sheet.tsx:192:37 - error TS2339: Property 'error' does not exist on type '{ success: boolean; }'.

192             description: roleResult.error.message,
                                        ~~~~~

components/edms/edms/admin-user-edit-sheet.tsx:204:11 - error TS2353: Object literal may only specify known properties, and 'isActive' does not exist in type '{ userId: string; status: "active" | "inactive"; }'.

204           isActive: values.isActive,
              ~~~~~~~~

components/edms/edms/admin-user-edit-sheet.tsx:210:39 - error TS2339: Property 'error' does not exist on type '{ success: boolean; }'.

210             description: statusResult.error.message,
                                          ~~~~~

components/edms/edms/admin-user-edit-sheet.tsx:229:39 - error TS2345: Argument of type 'string' is not assignable to parameter of type '{ userId: string; }'.     

229       const result = await deleteUser(user.id);
                                          ~~~~~~~

components/edms/edms/admin-user-edit-sheet.tsx:234:31 - error TS2339: Property 'error' does not exist on type '{ success: boolean; }'.

234           description: result.error.message,
                                  ~~~~~

components/edms/edms/admin-user-edit-sheet.tsx:310:38 - error TS2339: Property 'documentsUploaded' does not exist on type 'UserActivitySummary'.

310                       value={summary.documentsUploaded}
                                         ~~~~~~~~~~~~~~~~~

components/edms/edms/admin-user-edit-sheet.tsx:314:38 - error TS2339: Property 'commentsAdded' does not exist on type 'UserActivitySummary'.

314                       value={summary.commentsAdded}
                                         ~~~~~~~~~~~~~

components/edms/edms/admin-user-edit-sheet.tsx:318:38 - error TS2339: Property 'workflowsCreated' does not exist on type 'UserActivitySummary'.

318                       value={summary.workflowsCreated}
                                         ~~~~~~~~~~~~~~~~

components/edms/edms/admin-user-edit-sheet.tsx:322:38 - error TS2339: Property 'projectsAssigned' does not exist on type 'UserActivitySummary'.

322                       value={summary.projectsAssigned}
                                         ~~~~~~~~~~~~~~~~

components/edms/edms/admin-users-table.tsx:26:8 - error TS2307: Cannot find module '@midday/ui/pagination' or its corresponding type declarations.

26 } from "@midday/ui/pagination";
          ~~~~~~~~~~~~~~~~~~~~~~~

components/edms/edms/admin-users-table.tsx:34:8 - error TS2307: Cannot find module '@midday/ui/table' or its corresponding type declarations.

34 } from "@midday/ui/table";
          ~~~~~~~~~~~~~~~~~~

components/edms/edms/admin-users-table.tsx:48:3 - error TS2724: '"@/actions/admin-users"' has no exported member named 'bulkDeleteUsers'. Did you mean 'deleteUser'?

48   bulkDeleteUsers,
     ~~~~~~~~~~~~~~~

  actions/admin-users.ts:33:23
    33 export async function deleteUser(input: {
                             ~~~~~~~~~~
    'deleteUser' is declared here.

components/edms/edms/admin-users-table.tsx:49:3 - error TS2724: '"@/actions/admin-users"' has no exported member named 'bulkToggleUserStatus'. Did you mean 'toggleUserStatus'?

49   bulkToggleUserStatus,
     ~~~~~~~~~~~~~~~~~~~~

  actions/admin-users.ts:42:23
    42 export async function toggleUserStatus(input: {
                             ~~~~~~~~~~~~~~~~
    'toggleUserStatus' is declared here.

components/edms/edms/admin-users-table.tsx:50:3 - error TS2724: '"@/actions/admin-users"' has no exported member named 'bulkUpdateUserRoles'. Did you mean 'updateUserRole'?

50   bulkUpdateUserRoles,
     ~~~~~~~~~~~~~~~~~~~

  actions/admin-users.ts:23:23
    23 export async function updateUserRole(input: {
                             ~~~~~~~~~~~~~~
    'updateUserRole' is declared here.

components/edms/edms/admin-users-table.tsx:494:31 - error TS7006: Parameter 'event' implicitly has an 'any' type.

494                     onClick={(event) => {
                                  ~~~~~

components/edms/edms/admin-users-table.tsx:510:33 - error TS7006: Parameter 'event' implicitly has an 'any' type.

510                       onClick={(event) => {
                                    ~~~~~

components/edms/edms/admin-users-table.tsx:524:31 - error TS7006: Parameter 'event' implicitly has an 'any' type.

524                     onClick={(event) => {
                                  ~~~~~

components/edms/edms/dashboard-sections.tsx:16:8 - error TS2307: Cannot find module '@midday/ui/table' or its corresponding type declarations.

16 } from "@midday/ui/table";
          ~~~~~~~~~~~~~~~~~~

components/edms/edms/dashboard-sections.tsx:29:3 - error TS2305: Module '"@/lib/edms/dashboard"' has no exported member 'DashboardActivityItem'.

29   DashboardActivityItem,
     ~~~~~~~~~~~~~~~~~~~~~

components/edms/edms/dashboard-sections.tsx:30:3 - error TS2305: Module '"@/lib/edms/dashboard"' has no exported member 'DashboardDocument'.

30   DashboardDocument,
     ~~~~~~~~~~~~~~~~~

components/edms/edms/dashboard-sections.tsx:31:3 - error TS2305: Module '"@/lib/edms/dashboard"' has no exported member 'DashboardNotification'.

31   DashboardNotification,
     ~~~~~~~~~~~~~~~~~~~~~

components/edms/edms/dashboard-sections.tsx:32:3 - error TS2305: Module '"@/lib/edms/dashboard"' has no exported member 'DashboardProject'.

32   DashboardProject,
     ~~~~~~~~~~~~~~~~

components/edms/edms/dashboard-sections.tsx:33:3 - error TS2305: Module '"@/lib/edms/dashboard"' has no exported member 'DashboardTransmittal'.

33   DashboardTransmittal,
     ~~~~~~~~~~~~~~~~~~~~

components/edms/edms/dashboard-sections.tsx:34:3 - error TS2305: Module '"@/lib/edms/dashboard"' has no exported member 'DashboardWorkflowItem'.

34   DashboardWorkflowItem,
     ~~~~~~~~~~~~~~~~~~~~~

components/edms/edms/distribution-matrix-table.tsx:11:8 - error TS2307: Cannot find module '@midday/ui/table' or its corresponding type declarations.

11 } from "@midday/ui/table";
          ~~~~~~~~~~~~~~~~~~

components/edms/edms/distribution-matrix-table.tsx:145:21 - error TS2322: Type '"success" | "default" | "secondary" | "warning"' is not assignable to type '"link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined'.
  Type '"success"' is not assignable to type '"link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined'.

145                     variant={
                        ~~~~~~~

  components/ui/badge.tsx:11:7
     11       variant: {
              ~~~~~~~~~~
     12         default: "bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ...
     20         link: "text-primary underline-offset-4 [a&]:hover:underline",
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     21       },
        ~~~~~~~
    The expected type comes from property 'variant' which is declared here on type 'IntrinsicAttributes & ClassAttributes<HTMLSpanElement> & HTMLAttributes<HTMLSpanElement> & VariantProps<...> & { ...; }'

components/edms/edms/document-bulk-import-sheet.tsx:30:8 - error TS2307: Cannot find module '@midday/ui/table' or its corresponding type declarations.

30 } from "@midday/ui/table";
          ~~~~~~~~~~~~~~~~~~

components/edms/edms/document-bulk-import-sheet.tsx:303:15 - error TS2353: Object literal may only specify known properties, and 'discipline' does not exist in type '{ projectId: string; title: string; description?: string | undefined; documentNumber?: string | undefined; revision?: string | undefined; status?: string | undefined; }'.

303               discipline: row.discipline,
                  ~~~~~~~~~~

components/edms/edms/document-bulk-upload-sheet.tsx:124:24 - error TS18048: 'result.error' is possibly 'undefined'.

124           description: result.error.message,
                           ~~~~~~~~~~~~

components/edms/edms/document-bulk-upload-sheet.tsx:130:28 - error TS18048: 'result.data' is possibly 'undefined'.

130       const successCount = result.data.created.length;
                               ~~~~~~~~~~~

components/edms/edms/document-bulk-upload-sheet.tsx:131:25 - error TS18048: 'result.data' is possibly 'undefined'.

131       const failCount = result.data.failed.length;
                            ~~~~~~~~~~~

components/edms/edms/document-create-sheet.tsx:116:24 - error TS18048: 'result.error' is possibly 'undefined'.

116           description: result.error.message,
                           ~~~~~~~~~~~~

components/edms/edms/document-preview-popover.tsx:31:35 - error TS2345: Argument of type 'string | null' is not assignable to parameter of type 'string[] | undefined'.
  Type 'null' is not assignable to type 'string[] | undefined'.

31   const images = expandImageArray(document.images);
                                     ~~~~~~~~~~~~~~~

components/edms/edms/document-upload-form.tsx:4:26 - error TS2307: Cannot find module '@midday/ui/calendar' or its corresponding type declarations.

4 import { Calendar } from "@midday/ui/calendar";
                           ~~~~~~~~~~~~~~~~~~~~~

components/edms/edms/document-upload-form.tsx:134:9 - error TS2353: Object literal may only specify known properties, and 'discipline' does not exist in type '{ projectId: string; title: string; description?: string | undefined; documentNumber?: string | undefined; revision?: string | undefined; status?: string | undefined; }'.

134         discipline: "GEN", // Default discipline
            ~~~~~~~~~~

components/edms/edms/document-upload-form.tsx:148:24 - error TS18048: 'result.error' is possibly 'undefined'.

148           description: result.error.message,
                           ~~~~~~~~~~~~

components/edms/edms/document-upload-form.tsx:156:41 - error TS2339: Property 'data' does not exist on type '{ success: boolean; error?: { message: string; } | undefined; }'.

156         description: `Document ${result.data.documentNumber} has been added to the register`,
                                            ~~~~

components/edms/edms/document-upload-form.tsx:284:32 - error TS7006: Parameter 'date' implicitly has an 'any' type.

284                     onSelect={(date) =>
                                   ~~~~

components/edms/edms/document-version-sheet.tsx:36:10 - error TS2724: '"@/actions/documents"' has no exported member named 'createDocumentVersion'. Did you mean 'createDocument'?

36 import { createDocumentVersion } from "@/actions/documents";
            ~~~~~~~~~~~~~~~~~~~~~

  actions/documents.ts:5:23
    5 export async function createDocument(input: {
                            ~~~~~~~~~~~~~~
    'createDocument' is declared here.

components/edms/edms/link-documents-dialog.tsx:78:37 - error TS2307: Cannot find module '@/db' or its corresponding type declarations.

78         const { db } = await import("@/db");
                                       ~~~~~~

components/edms/edms/link-documents-dialog.tsx:79:53 - error TS2307: Cannot find module '@/db/schema/schedule' or its corresponding type declarations.

79         const { scheduleActivities } = await import("@/db/schema/schedule");
                                                       ~~~~~~~~~~~~~~~~~~~~~~

components/edms/edms/metric-card.tsx:32:3 - error TS2353: Object literal may only specify known properties, and 'slate' does not exist in type 'Record<"blue" | "emerald" | "amber" | "rose", string>'.

32   slate: "border-border bg-card transition-colors hover:bg-accent/30",
     ~~~~~

components/edms/edms/metric-card.tsx:40:3 - error TS2353: Object literal may only specify known properties, and 'slate' does not exist in type 'Record<"blue" | "emerald" | "amber" | "rose", string>'.

40   slate: "border-border bg-muted text-foreground",
     ~~~~~

components/edms/edms/notification-actions.tsx:35:28 - error TS18048: 'result.error' is possibly 'undefined'.

35               description: result.error.message,
                              ~~~~~~~~~~~~

components/edms/edms/notification-actions.tsx:78:28 - error TS18048: 'result.error' is possibly 'undefined'.

78               description: result.error.message,
                              ~~~~~~~~~~~~

components/edms/edms/notification-bell.tsx:13:15 - error TS2724: '"@/lib/edms/notification-feed"' has no exported member named 'EdmsNotificationFeedItem'. Did you mean 'getEdmsNotificationFeed'?

13 import type { EdmsNotificationFeedItem } from "@/lib/edms/notification-feed";
                 ~~~~~~~~~~~~~~~~~~~~~~~~

  lib/edms/notification-feed.ts:1:23
    1 export async function getEdmsNotificationFeed(sessionUser: any, limit: number) {
                            ~~~~~~~~~~~~~~~~~~~~~~~
    'getEdmsNotificationFeed' is declared here.

components/edms/edms/page-header.tsx:8:8 - error TS2307: Cannot find module '@midday/ui/breadcrumb' or its corresponding type declarations.

8 } from "@midday/ui/breadcrumb";
         ~~~~~~~~~~~~~~~~~~~~~~~

components/edms/edms/page-header.tsx:9:32 - error TS2307: Cannot find module '@midday/ui/sidebar' or its corresponding type declarations.

9 import { SidebarTrigger } from "@midday/ui/sidebar";
                                 ~~~~~~~~~~~~~~~~~~~~

components/edms/edms/project-create-sheet.tsx:5:26 - error TS2307: Cannot find module '@midday/ui/calendar' or its corresponding type declarations.

5 import { Calendar } from "@midday/ui/calendar";
                           ~~~~~~~~~~~~~~~~~~~~~

components/edms/edms/project-create-sheet.tsx:98:24 - error TS18048: 'result.error' is possibly 'undefined'.

98           description: result.error.message,
                          ~~~~~~~~~~~~

components/edms/edms/project-create-sheet.tsx:111:32 - error TS18048: 'result.data' is possibly 'undefined'.

111       router.push(`/projects/${result.data.id}`);
                                   ~~~~~~~~~~~

components/edms/edms/project-create-sheet.tsx:248:42 - error TS7006: Parameter 'date' implicitly has an 'any' type.

248                               onSelect={(date) =>
                                             ~~~~

components/edms/edms/project-create-sheet.tsx:291:42 - error TS7006: Parameter 'date' implicitly has an 'any' type.

291                               onSelect={(date) =>
                                             ~~~~

components/edms/edms/project-databook-dialog.tsx:19:8 - error TS2307: Cannot find module '@/actions/project-databook' or its corresponding type declarations.

19 } from "@/actions/project-databook";
          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

components/edms/edms/project-databook-dialog.tsx:56:62 - error TS7006: Parameter 'd' implicitly has an 'any' type.

56           setSelectedDocs(new Set(result.data.documents.map((d) => d.id)));
                                                                ~

components/edms/edms/project-member-sheet.tsx:35:10 - error TS2305: Module '"@/actions/projects"' has no exported member 'assignProjectMember'.

35 import { assignProjectMember } from "@/actions/projects";
            ~~~~~~~~~~~~~~~~~~~

components/edms/edms/project-preview-popover.tsx:36:35 - error TS2345: Argument of type 'string | null' is not assignable to parameter of type 'string[] | undefined'.
  Type 'null' is not assignable to type 'string[] | undefined'.

36   const images = expandImageArray(project.images);
                                     ~~~~~~~~~~~~~~

components/edms/edms/project-template-upload-sheet.tsx:96:37 - error TS2307: Cannot find module '@/db' or its corresponding type declarations.

96         const { db } = await import("@/db");
                                       ~~~~~~

components/edms/edms/project-template-upload-sheet.tsx:98:11 - error TS2307: Cannot find module '@/db/schema/project-templates' or its corresponding type declarations.

98           "@/db/schema/project-templates"
             ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

components/edms/edms/quick-upload.tsx:14:26 - error TS2307: Cannot find module '@midday/ui/use-toast' or its corresponding type declarations.

14 import { useToast } from "@midday/ui/use-toast";
                            ~~~~~~~~~~~~~~~~~~~~~~

components/edms/edms/quick-upload.tsx:99:9 - error TS2353: Object literal may only specify known properties, and 'discipline' does not exist in type '{ projectId: string; title: string; description?: string | undefined; documentNumber?: string | undefined; revision?: string | undefined; status?: string | undefined; }'.    

99         discipline: "",
           ~~~~~~~~~~

components/edms/edms/quick-upload.tsx:115:24 - error TS18048: 'createResult.error' is possibly 'undefined'.

115           description: createResult.error.message,
                           ~~~~~~~~~~~~~~~~~~

components/edms/edms/report-modal.tsx:19:8 - error TS2307: Cannot find module '@midday/ui/table' or its corresponding type declarations.

19 } from "@midday/ui/table";
          ~~~~~~~~~~~~~~~~~~

components/edms/edms/review-transmittal-form.tsx:22:26 - error TS2307: Cannot find module '@midday/ui/use-toast' or its corresponding type declarations.

22 import { useToast } from "@midday/ui/use-toast";
                            ~~~~~~~~~~~~~~~~~~~~~~

components/edms/edms/review-transmittal-form.tsx:28:10 - error TS2724: '"@/actions/transmittals"' has no exported member named 'reviewTransmittal'. Did you mean 'createTransmittal'?

28 import { reviewTransmittal } from "@/actions/transmittals";
            ~~~~~~~~~~~~~~~~~

  actions/transmittals.ts:5:23
    5 export async function createTransmittal(input: {
                            ~~~~~~~~~~~~~~~~~
    'createTransmittal' is declared here.

components/edms/edms/review-transmittal-form.tsx:33:8 - error TS2307: Cannot find module '@/lib/edms/client-approval-codes' or its corresponding type declarations.

33 } from "@/lib/edms/client-approval-codes";
          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

components/edms/edms/review-transmittal-form.tsx:84:8 - error TS7006: Parameter 'option' implicitly has an 'any' type.

84       (option) => option.approvalCode === selectedApprovalCode,
          ~~~~~~

components/edms/edms/review-transmittal-form.tsx:155:49 - error TS7006: Parameter 'option' implicitly has an 'any' type.

155                   {CLIENT_APPROVAL_OPTIONS.map((option) => (
                                                    ~~~~~~

components/edms/edms/schedule-sync-dialog.tsx:41:5 - error TS2552: Cannot find name 'startTransition'. Did you mean 'CSSTransition'?

41     startTransition(async () => {
       ~~~~~~~~~~~~~~~

  node_modules/typescript/lib/lib.dom.d.ts:7337:13
    7337 declare var CSSTransition: {
                     ~~~~~~~~~~~~~
    'CSSTransition' is declared here.

components/edms/edms/schedule-sync-dialog.tsx:44:37 - error TS2307: Cannot find module '@/db' or its corresponding type declarations.

44         const { db } = await import("@/db");
                                       ~~~~~~

components/edms/edms/schedule-sync-dialog.tsx:45:47 - error TS2307: Cannot find module '@/db/schema/schedule' or its corresponding type declarations.

45         const { scheduleSync } = await import("@/db/schema/schedule");
                                                 ~~~~~~~~~~~~~~~~~~~~~~

components/edms/edms/schedule-sync-dialog.tsx:67:9 - error TS2304: Cannot find name 'toast'.

67         toast({
           ~~~~~

components/edms/edms/schedule-sync-dialog.tsx:73:9 - error TS2304: Cannot find name 'router'.

73         router.refresh();
           ~~~~~~

components/edms/edms/schedule-sync-dialog.tsx:76:9 - error TS2304: Cannot find name 'toast'.

76         toast({
           ~~~~~

components/edms/edms/search/search-toolbar.tsx:20:46 - error TS2307: Cannot find module '@midday/ui/toggle-group' or its corresponding type declarations.

20 import { ToggleGroup, ToggleGroupItem } from "@midday/ui/toggle-group";
                                                ~~~~~~~~~~~~~~~~~~~~~~~~~

components/edms/edms/search/search-toolbar.tsx:251:31 - error TS7006: Parameter 'value' implicitly has an 'any' type.

251               onValueChange={(value) =>
                                  ~~~~~

components/edms/edms/transmittal-acknowledge-button.tsx:31:28 - error TS18048: 'result.error' is possibly 'undefined'.

31               description: result.error.message,
                              ~~~~~~~~~~~~

components/edms/edms/transmittal-create-sheet.tsx:6:26 - error TS2307: Cannot find module '@midday/ui/calendar' or its corresponding type declarations.

6 import { Calendar } from "@midday/ui/calendar";
                           ~~~~~~~~~~~~~~~~~~~~~

components/edms/edms/transmittal-create-sheet.tsx:335:9 - error TS2353: Object literal may only specify known properties, and 'description' does not exist in type '{ projectId: string; transmittalNumber: string; to: string; from: string; subject: string; documents: string[]; dueDate?: Date | undefined; }'.

335         description: values.description,
            ~~~~~~~~~~~

components/edms/edms/transmittal-create-sheet.tsx:346:24 - error TS18048: 'result.error' is possibly 'undefined'.

346           description: result.error.message,
                           ~~~~~~~~~~~~

components/edms/edms/transmittal-create-sheet.tsx:546:44 - error TS7006: Parameter 'date' implicitly has an 'any' type.

546                                 onSelect={(date) =>
                                               ~~~~

components/edms/edms/transmittal-form-with-preview.tsx:5:26 - error TS2307: Cannot find module '@midday/ui/calendar' or its corresponding type declarations.      

5 import { Calendar } from "@midday/ui/calendar";
                           ~~~~~~~~~~~~~~~~~~~~~

components/edms/edms/transmittal-form-with-preview.tsx:27:8 - error TS2307: Cannot find module '@midday/ui/table' or its corresponding type declarations.

27 } from "@midday/ui/table";
          ~~~~~~~~~~~~~~~~~~

components/edms/edms/transmittal-form-with-preview.tsx:186:34 - error TS7006: Parameter 'date' implicitly has an 'any' type.

186                       onSelect={(date) =>
                                     ~~~~

components/edms/edms/transmittal-form-with-preview.tsx:301:32 - error TS7006: Parameter 'date' implicitly has an 'any' type.

301                     onSelect={(date) =>
                                   ~~~~

components/edms/edms/workflow-action-sheet.tsx:136:24 - error TS18048: 'result.error' is possibly 'undefined'.

136           description: result.error.message,
                           ~~~~~~~~~~~~

components/edms/edms/workflow-create-sheet.tsx:5:26 - error TS2307: Cannot find module '@midday/ui/calendar' or its corresponding type declarations.

5 import { Calendar } from "@midday/ui/calendar";
                           ~~~~~~~~~~~~~~~~~~~~~

components/edms/edms/workflow-create-sheet.tsx:170:24 - error TS18048: 'result.error' is possibly 'undefined'.

170           description: result.error.message,
                           ~~~~~~~~~~~~

components/edms/edms/workflow-create-sheet.tsx:375:40 - error TS7006: Parameter 'date' implicitly has an 'any' type.

375                             onSelect={(date) =>
                                           ~~~~

components/edms/notification-bell.tsx:17:15 - error TS2724: '"@/lib/edms/notification-feed"' has no exported member named 'EdmsNotificationFeedItem'. Did you mean 'getEdmsNotificationFeed'?

17 import type { EdmsNotificationFeedItem } from "@/lib/edms/notification-feed";
                 ~~~~~~~~~~~~~~~~~~~~~~~~

  lib/edms/notification-feed.ts:1:23
    1 export async function getEdmsNotificationFeed(sessionUser: any, limit: number) {
                            ~~~~~~~~~~~~~~~~~~~~~~~
    'getEdmsNotificationFeed' is declared here.

components/edms/project-create-sheet.tsx:102:24 - error TS18048: 'result.error' is possibly 'undefined'.

102           description: result.error.message,
                           ~~~~~~~~~~~~

components/edms/project-create-sheet.tsx:115:32 - error TS18048: 'result.data' is possibly 'undefined'.

115       router.push(`/projects/${result.data.id}`);
                                   ~~~~~~~~~~~

components/edms/project-databook-dialog.tsx:8:8 - error TS2307: Cannot find module '@/actions/project-databook' or its corresponding type declarations.

8 } from "@/actions/project-databook";
         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

components/edms/project-databook-dialog.tsx:56:62 - error TS7006: Parameter 'd' implicitly has an 'any' type.

56           setSelectedDocs(new Set(result.data.documents.map((d) => d.id)));
                                                                ~

components/edms/project-member-sheet.tsx:9:10 - error TS2305: Module '"@/actions/projects"' has no exported member 'assignProjectMember'.

9 import { assignProjectMember } from "@/actions/projects";
           ~~~~~~~~~~~~~~~~~~~

components/edms/project-preview-popover.tsx:40:35 - error TS2345: Argument of type 'string | null' is not assignable to parameter of type 'string[] | undefined'. 
  Type 'null' is not assignable to type 'string[] | undefined'.

40   const images = expandImageArray(project.images);
                                     ~~~~~~~~~~~~~~

components/edms/quick-upload.tsx:17:26 - error TS2307: Cannot find module '@/components/ui/use-toast' or its corresponding type declarations.

17 import { useToast } from "@/components/ui/use-toast";
                            ~~~~~~~~~~~~~~~~~~~~~~~~~~~

components/edms/quick-upload.tsx:99:9 - error TS2353: Object literal may only specify known properties, and 'discipline' does not exist in type '{ projectId: string; title: string; description?: string | undefined; documentNumber?: string | undefined; revision?: string | undefined; status?: string | undefined; }'.

99         discipline: "",
           ~~~~~~~~~~

components/edms/quick-upload.tsx:115:24 - error TS18048: 'createResult.error' is possibly 'undefined'.

115           description: createResult.error.message,
                           ~~~~~~~~~~~~~~~~~~

components/edms/review-transmittal-form.tsx:9:10 - error TS2724: '"@/actions/transmittals"' has no exported member named 'reviewTransmittal'. Did you mean 'createTransmittal'?

9 import { reviewTransmittal } from "@/actions/transmittals";
           ~~~~~~~~~~~~~~~~~

  actions/transmittals.ts:5:23
    5 export async function createTransmittal(input: {
                            ~~~~~~~~~~~~~~~~~
    'createTransmittal' is declared here.

components/edms/review-transmittal-form.tsx:28:26 - error TS2307: Cannot find module '@/components/ui/use-toast' or its corresponding type declarations.

28 import { useToast } from "@/components/ui/use-toast";
                            ~~~~~~~~~~~~~~~~~~~~~~~~~~~

components/edms/review-transmittal-form.tsx:33:8 - error TS2307: Cannot find module '@/lib/edms/client-approval-codes' or its corresponding type declarations.    

33 } from "@/lib/edms/client-approval-codes";
          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

components/edms/review-transmittal-form.tsx:84:8 - error TS7006: Parameter 'option' implicitly has an 'any' type.

84       (option) => option.approvalCode === selectedApprovalCode,
          ~~~~~~

components/edms/review-transmittal-form.tsx:155:49 - error TS7006: Parameter 'option' implicitly has an 'any' type.

155                   {CLIENT_APPROVAL_OPTIONS.map((option) => (
                                                    ~~~~~~

components/edms/transmittal-acknowledge-button.tsx:31:28 - error TS18048: 'result.error' is possibly 'undefined'.

31               description: result.error.message,
                              ~~~~~~~~~~~~

components/edms/transmittal-create-sheet.tsx:15:20 - error TS2307: Cannot find module '@/components/ui/cn' or its corresponding type declarations.

15 import { cn } from "@/components/ui/cn";
                      ~~~~~~~~~~~~~~~~~~~~

components/edms/transmittal-create-sheet.tsx:339:9 - error TS2353: Object literal may only specify known properties, and 'description' does not exist in type '{ projectId: string; transmittalNumber: string; to: string; from: string; subject: string; documents: string[]; dueDate?: Date | undefined; }'.

339         description: values.description,
            ~~~~~~~~~~~

components/edms/transmittal-create-sheet.tsx:350:24 - error TS18048: 'result.error' is possibly 'undefined'.

350           description: result.error.message,
                           ~~~~~~~~~~~~

components/edms/transmittal-form-with-preview.tsx:11:20 - error TS2307: Cannot find module '@/components/ui/cn' or its corresponding type declarations.

11 import { cn } from "@/components/ui/cn";
                      ~~~~~~~~~~~~~~~~~~~~

components/edms/workflow-create-sheet.tsx:174:24 - error TS18048: 'result.error' is possibly 'undefined'.

174           description: result.error.message,
                           ~~~~~~~~~~~~

components/reports-metrics-content.tsx:4:29 - error TS2307: Cannot find module '@/components/metrics/metrics-view' or its corresponding type declarations.        

4 import { MetricsView } from "@/components/metrics/metrics-view";
                              ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

components/reports-metrics-content.tsx:5:38 - error TS2307: Cannot find module '@/components/metrics/utils/chart-types' or its corresponding type declarations.   

5 import type { ChartLayoutItem } from "@/components/metrics/utils/chart-types";
                                       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

components/reports-metrics-content.tsx:6:38 - error TS2307: Cannot find module '@/components/metrics/utils/chart-types' or its corresponding type declarations.   

6 import { DEFAULT_CHART_LAYOUT } from "@/components/metrics/utils/chart-types";
                                       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

components/reports-metrics-content.tsx:7:31 - error TS2307: Cannot find module '@/components/widgets/header' or its corresponding type declarations.

7 import { WidgetsHeader } from "@/components/widgets/header";
                                ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

components/reports-report-modal-client.tsx:3:23 - error TS2307: Cannot find module '@midday/ui/badge' or its corresponding type declarations.

3 import { Badge } from "@midday/ui/badge";
                        ~~~~~~~~~~~~~~~~~~

components/reports-report-modal-client.tsx:4:24 - error TS2307: Cannot find module '@midday/ui/button' or its corresponding type declarations.

4 import { Button } from "@midday/ui/button";
                         ~~~~~~~~~~~~~~~~~~~

components/reports-report-modal-client.tsx:11:8 - error TS2307: Cannot find module '@midday/ui/card' or its corresponding type declarations.

11 } from "@midday/ui/card";
          ~~~~~~~~~~~~~~~~~

components/reports-report-modal-client.tsx:12:23 - error TS2307: Cannot find module '@midday/ui/input' or its corresponding type declarations.

12 import { Input } from "@midday/ui/input";
                         ~~~~~~~~~~~~~~~~~~

components/reports-report-modal-client.tsx:13:28 - error TS2307: Cannot find module '@midday/ui/scroll-area' or its corresponding type declarations.

13 import { ScrollArea } from "@midday/ui/scroll-area";
                              ~~~~~~~~~~~~~~~~~~~~~~~~

components/reports-report-modal-client.tsx:350:28 - error TS7006: Parameter 'e' implicitly has an 'any' type.

350                 onChange={(e) => setSearchQuery(e.target.value)}
                               ~

components/sidebar-error.tsx:3:24 - error TS2307: Cannot find module '@midday/ui/button' or its corresponding type declarations.

3 import { Button } from "@midday/ui/button";
                         ~~~~~~~~~~~~~~~~~~~

components/sidebar-error.tsx:22:14 - error TS2307: Cannot find module '@sentry/nextjs' or its corresponding type declarations.

22       import("@sentry/nextjs").then((Sentry) => {
                ~~~~~~~~~~~~~~~~

components/sidebar-layout.tsx:3:33 - error TS2307: Cannot find module '@/components/layout/dashboard-layout' or its corresponding type declarations.

3 import { DashboardLayout } from "@/components/layout/dashboard-layout";
                                  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

components/sidebar-layout.tsx:4:33 - error TS2307: Cannot find module '@/components/quick-actions-fab' or its corresponding type declarations.

4 import { QuickActionsFAB } from "@/components/quick-actions-fab";
                                  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

components/sidebar-layout.tsx:7:31 - error TS2307: Cannot find module '@/trpc/server' or its corresponding type declarations.

7 import { HydrateClient } from "@/trpc/server";
                                ~~~~~~~~~~~~~~~

hooks/test/use-data-grid.test.tsx:2:33 - error TS2307: Cannot find module '@testing-library/react' or its corresponding type declarations.

2 import { act, renderHook } from "@testing-library/react";
                                  ~~~~~~~~~~~~~~~~~~~~~~~~

hooks/test/use-data-grid.test.tsx:49:13 - error TS2353: Object literal may only specify known properties, and 'cell' does not exist in type 'ColumnMeta<TestData, unknown>'.

49     meta: { cell: { variant: "number" } },
               ~~~~

  node_modules/@tanstack/table-core/build/lib/types.d.ts:86:5
    86     meta?: ColumnMeta<TData, TValue>;
           ~~~~
    The expected type comes from property 'meta' which is declared here on type 'ColumnDef<TestData>'

hooks/test/use-data-grid.test.tsx:2253:40 - error TS7006: Parameter 'c' implicitly has an 'any' type.

2253       const nameColumn = columns.find((c) => c.id === "name");
                                            ~

lib/turso/index.ts:3:24 - error TS2307: Cannot find module './mock-db' or its corresponding type declarations.

3 import { mockDb } from "./mock-db";
                         ~~~~~~~~~~~

lib/turso/index.ts:27:9 - error TS2322: Type 'LibSQLDatabase<typeof import("F:/hexed/quadra/lib/turso/schema")> & { $client: Client; }' is not assignable to type 'LibSQLDatabase<Record<string, never>> | null'.
  Type 'LibSQLDatabase<typeof import("F:/hexed/quadra/lib/turso/schema")> & { $client: Client; }' is not assignable to type 'LibSQLDatabase<Record<string, never>>'.
    The types of '_.schema' are incompatible between these types.
      Type 'ExtractTablesWithRelations<typeof import("F:/hexed/quadra/lib/turso/schema")> | undefined' is not assignable to type 'ExtractTablesWithRelations<Record<string, never>> | undefined'.
        Type 'ExtractTablesWithRelations<typeof import("F:/hexed/quadra/lib/turso/schema")>' is not assignable to type 'ExtractTablesWithRelations<Record<string, never>>'.
          Property 'user' is incompatible with index signature.
            Type '{ tsName: "user"; dbName: "user"; columns: { id: SQLiteColumn<{ name: "id"; tableName: "user"; dataType: "string"; columnType: "SQLiteText"; data: string; driverParam: string; notNull: true; hasDefault: false; ... 6 more ...; generated: undefined; }, {}, { ...; }>; ... 12 more ...; isActive: SQLiteColumn<...>; }; re...' is not assignable to type '{ tsName: string; dbName: never; columns: never; relations: Record<string, Relation<string>>; primaryKey: AnyColumn[]; }'.
              Types of property 'dbName' are incompatible.
                Type '"user"' is not assignable to type 'never'.

27         _db = drizzle({ client, schema });
           ~~~


Found 170 errors in 56 files.

Errors  Files
    14  components/edms/admin-user-edit-sheet.tsx:145
     4  components/edms/admin-users-table.tsx:16
     6  components/edms/dashboard-sections.tsx:29
     1  components/edms/document-create-sheet.tsx:116
     1  components/edms/document-preview-popover.tsx:35
     4  components/edms/document-upload-form.tsx:11
     1  components/edms/document-version-sheet.tsx:9
     1  components/edms/edms/add-matrix-rule-form.tsx:26
     2  components/edms/edms/add-section-dialog.tsx:59
    15  components/edms/edms/admin-user-edit-sheet.tsx:143
     8  components/edms/edms/admin-users-table.tsx:26
     7  components/edms/edms/dashboard-sections.tsx:16
     2  components/edms/edms/distribution-matrix-table.tsx:11
     2  components/edms/edms/document-bulk-import-sheet.tsx:30
     3  components/edms/edms/document-bulk-upload-sheet.tsx:124
     1  components/edms/edms/document-create-sheet.tsx:116
     1  components/edms/edms/document-preview-popover.tsx:31
     5  components/edms/edms/document-upload-form.tsx:4
     1  components/edms/edms/document-version-sheet.tsx:36
     2  components/edms/edms/link-documents-dialog.tsx:78
     2  components/edms/edms/metric-card.tsx:32
     2  components/edms/edms/notification-actions.tsx:35
     1  components/edms/edms/notification-bell.tsx:13
     2  components/edms/edms/page-header.tsx:8
     5  components/edms/edms/project-create-sheet.tsx:5
     2  components/edms/edms/project-databook-dialog.tsx:19
     1  components/edms/edms/project-member-sheet.tsx:35
     1  components/edms/edms/project-preview-popover.tsx:36
     2  components/edms/edms/project-template-upload-sheet.tsx:96
     3  components/edms/edms/quick-upload.tsx:14
     1  components/edms/edms/report-modal.tsx:19
     5  components/edms/edms/review-transmittal-form.tsx:22
     6  components/edms/edms/schedule-sync-dialog.tsx:41
     2  components/edms/edms/search/search-toolbar.tsx:20
     1  components/edms/edms/transmittal-acknowledge-button.tsx:31
     4  components/edms/edms/transmittal-create-sheet.tsx:6
     4  components/edms/edms/transmittal-form-with-preview.tsx:5
     1  components/edms/edms/workflow-action-sheet.tsx:136
     3  components/edms/edms/workflow-create-sheet.tsx:5
     1  components/edms/notification-bell.tsx:17
     2  components/edms/project-create-sheet.tsx:102
     2  components/edms/project-databook-dialog.tsx:8
     1  components/edms/project-member-sheet.tsx:9
     1  components/edms/project-preview-popover.tsx:40
     3  components/edms/quick-upload.tsx:17
     5  components/edms/review-transmittal-form.tsx:9
     1  components/edms/transmittal-acknowledge-button.tsx:31
     3  components/edms/transmittal-create-sheet.tsx:15
     1  components/edms/transmittal-form-with-preview.tsx:11
     1  components/edms/workflow-create-sheet.tsx:174
     4  components/reports-metrics-content.tsx:4
     6  components/reports-report-modal-client.tsx:3
     2  components/sidebar-error.tsx:3
     3  components/sidebar-layout.tsx:3
     3  hooks/test/use-data-grid.test.tsx:2
     2  lib/turso/index.ts:3