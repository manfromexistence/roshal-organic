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

async function deleteTestData() {
  console.log("=== DELETING TEST DATA ===\n");

  // Delete in reverse order of dependencies
  const tables = [
    {
      name: "commissioningChecklistItems",
      schema: commissioningChecklistItems,
    },
    { name: "commissioningChecklists", schema: commissioningChecklists },
    { name: "workflowSteps", schema: workflowSteps },
    { name: "documentWorkflows", schema: documentWorkflows },
    { name: "queryLinkedDocuments", schema: queryLinkedDocuments },
    { name: "submittalDocuments", schema: submittalDocuments },
    { name: "submittals", schema: submittals },
    { name: "changeOrderDocuments", schema: changeOrderDocuments },
    { name: "changeOrders", schema: changeOrders },
    { name: "scheduleActivities", schema: scheduleActivities },
    { name: "scheduleSync", schema: scheduleSync },
    { name: "transmittalDocuments", schema: transmittalDocuments },
    { name: "transmittals", schema: transmittals },
    { name: "momActionItems", schema: momActionItems },
    { name: "momAttendees", schema: momAttendees },
    { name: "minutesOfMeeting", schema: minutesOfMeeting },
    { name: "memos", schema: memos },
    { name: "letters", schema: letters },
    { name: "siteTechQueries", schema: siteTechQueries },
    { name: "technicalQueries", schema: technicalQueries },
    { name: "rfis", schema: rfis },
    { name: "documentComments", schema: documentComments },
    { name: "documentVersions", schema: documentVersions },
    { name: "documents", schema: documents },
    { name: "projectMembers", schema: projectMembers },
    { name: "projects", schema: projects },
    { name: "activityLog", schema: activityLog },
    { name: "notifications", schema: notifications },
  ];

  for (const table of tables) {
    try {
      const result = await db.delete(table.schema);
      console.log(`✓ Deleted from ${table.name}`);
    } catch (error) {
      console.log(`✗ Error deleting from ${table.name}:`, error);
    }
  }

  console.log("\n=== TEST DATA DELETION COMPLETE ===");
}

deleteTestData().catch(console.error);
