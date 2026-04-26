import { db } from "../lib/db";
import {
  accounts,
  activityLog,
  changeOrderDocuments,
  changeOrders,
  commissioningChecklistItems,
  commissioningChecklists,
  documentComments,
  documents,
  documentVersions,
  documentWorkflows,
  files,
  letters,
  memos,
  minutesOfMeeting,
  momActionItems,
  momAttendees,
  notifications,
  organizations,
  projectMembers,
  projects,
  queryLinkedDocuments,
  rfis,
  scheduleActivities,
  scheduleSync,
  sessions,
  siteTechQueries,
  submittalDocuments,
  submittals,
  technicalQueries,
  transmittalDocuments,
  transmittals,
  users,
  workflowSteps,
} from "../lib/schema";

const tables = [
  { name: "organizations", schema: organizations },
  { name: "users", schema: users },
  { name: "accounts", schema: accounts },
  { name: "sessions", schema: sessions },
  { name: "files", schema: files },
  { name: "projects", schema: projects },
  { name: "projectMembers", schema: projectMembers },
  { name: "documents", schema: documents },
  { name: "documentVersions", schema: documentVersions },
  { name: "documentComments", schema: documentComments },
  { name: "documentWorkflows", schema: documentWorkflows },
  { name: "workflowSteps", schema: workflowSteps },
  { name: "transmittals", schema: transmittals },
  { name: "transmittalDocuments", schema: transmittalDocuments },
  { name: "letters", schema: letters },
  { name: "memos", schema: memos },
  { name: "minutesOfMeeting", schema: minutesOfMeeting },
  { name: "momAttendees", schema: momAttendees },
  { name: "momActionItems", schema: momActionItems },
  { name: "technicalQueries", schema: technicalQueries },
  { name: "siteTechQueries", schema: siteTechQueries },
  { name: "rfis", schema: rfis },
  { name: "queryLinkedDocuments", schema: queryLinkedDocuments },
  { name: "submittals", schema: submittals },
  { name: "submittalDocuments", schema: submittalDocuments },
  { name: "changeOrders", schema: changeOrders },
  { name: "changeOrderDocuments", schema: changeOrderDocuments },
  { name: "scheduleActivities", schema: scheduleActivities },
  { name: "scheduleSync", schema: scheduleSync },
  { name: "notifications", schema: notifications },
  { name: "activityLog", schema: activityLog },
  { name: "commissioningChecklists", schema: commissioningChecklists },
  { name: "commissioningChecklistItems", schema: commissioningChecklistItems },
];

async function checkDatabaseData() {
  console.log("=== DATABASE DATA CHECK ===\n");

  for (const table of tables) {
    try {
      const data = await db.select().from(table.schema).limit(5);
      console.log(`\n${table.name}: ${data.length} records`);
      if (data.length > 0) {
        console.log("Sample data:", JSON.stringify(data[0], null, 2));
      }
    } catch (error) {
      console.log(`\n${table.name}: ERROR - ${error}`);
    }
  }

  console.log("\n=== END OF CHECK ===");
}

checkDatabaseData().catch(console.error);
