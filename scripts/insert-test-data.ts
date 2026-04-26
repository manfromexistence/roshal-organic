import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
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

// ImgBB image URLs from upload script
const IMGBB_IMAGE_URLS = [
  "https://i.ibb.co/7J5jkH7p/0882c22237b9.jpg", // Organization avatar
  "https://i.ibb.co/dJ0gJRp6/c7580b720df5.jpg", // Project image 1
  "https://i.ibb.co/QF3hKhCb/001373ffffc0.jpg", // Project image 2
  "https://i.ibb.co/BVShGCcp/5b25ad51ff62.jpg", // Document image 1
  "https://i.ibb.co/gBXk3pY/ee80a29211be.jpg", // Document image 2
  "https://i.ibb.co/7thqTJKy/c96aee203d1c.jpg", // Transmittal image
];

async function insertTestData() {
  console.log("=== INSERTING TEST DATA ===\n");

  // Get existing users
  const existingUsers = await db.select().from(users);
  const testUser = existingUsers[0];

  // Update test user to admin role if not already
  if (testUser.role !== "admin") {
    await db
      .update(users)
      .set({ role: "admin" })
      .where(eq(users.id, testUser.id));
    console.log("✓ Updated user to admin role:", testUser.email);
  }

  const orgId = (await db.select().from(organizations))[0].id;

  // Update organization avatar with imgbb URL
  await db
    .update(organizations)
    .set({
      avatar: IMGBB_IMAGE_URLS[0],
    })
    .where(eq(organizations.id, orgId));
  console.log(
    "✓ Updated organization avatar with imgbb URL:",
    IMGBB_IMAGE_URLS[0],
  );

  // Insert Project
  const projectId = randomUUID();
  const projectNumber = `PRJ-${Date.now()}`;
  await db.insert(projects).values({
    id: projectId,
    name: "Test Project Alpha",
    description: "Test project for data validation",
    projectNumber,
    location: "Test Location",
    clientId: testUser.id,
    status: "active",
    startDate: new Date("2026-01-01"),
    endDate: new Date("2026-12-31"),
    contractValue: 100000000, // $1,000,000 in cents
    contractType: "lump_sum",
    contractNumber: `CON-${Date.now()}`,
    clientName: "Test Client",
    noticeToProceedDate: new Date("2026-01-15"),
    images: JSON.stringify([IMGBB_IMAGE_URLS[1], IMGBB_IMAGE_URLS[2]]),
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: testUser.id,
  });
  console.log("✓ Inserted project with number:", projectNumber);

  // Insert Project Member
  await db.insert(projectMembers).values({
    id: randomUUID(),
    projectId,
    userId: testUser.id,
    role: "admin",
    permissions: "full",
    assignedAt: new Date(),
    assignedBy: testUser.id,
  });
  console.log("✓ Inserted project member for user:", testUser.email);

  // Insert Document
  const documentId = randomUUID();
  await db.insert(documents).values({
    id: documentId,
    projectId,
    documentNumber: "DOC-001",
    title: "Test Document",
    description: "Test document for validation",
    discipline: "Structural",
    category: "Drawing",
    documentType: "design",
    version: "1.0",
    revision: "A",
    isLatestVersion: true,
    fileName: "test.pdf",
    fileSize: 1024000,
    fileType: "pdf",
    fileUrl: "https://example.com/test.pdf",
    status: "draft",
    tags: "test,validation",
    images: JSON.stringify([IMGBB_IMAGE_URLS[3], IMGBB_IMAGE_URLS[4]]),
    uploadedAt: new Date(),
    uploadedBy: testUser.id,
    updatedAt: new Date(),
    updatedBy: testUser.id,
  });
  console.log("✓ Inserted document with imgbb images");

  // Insert Transmittal
  const transmittalId = randomUUID();
  const transmittalNumber = `TX-${Date.now()}`;
  await db.insert(transmittals).values({
    id: transmittalId,
    projectId,
    transmittalNumber,
    subject: "Test Transmittal",
    description: "Test transmittal for validation",
    purpose: "IFR",
    sentTo: "Test Recipient",
    status: "draft",
    images: JSON.stringify([IMGBB_IMAGE_URLS[5]]),
    createdAt: new Date(),
  });
  console.log("✓ Inserted transmittal with number:", transmittalNumber);

  // Insert Transmittal Document
  await db.insert(transmittalDocuments).values({
    id: randomUUID(),
    transmittalId,
    documentId,
    remarks: "Test remarks",
    addedAt: new Date(),
  });
  console.log("✓ Inserted transmittal document");

  // Insert Letter
  await db.insert(letters).values({
    id: randomUUID(),
    letterNumber: `LTR-${Date.now()}`,
    date: new Date(),
    direction: "Outgoing",
    from: "Test Sender",
    to: "Test Recipient",
    toType: "Client",
    subject: "Test Letter",
    category: "Progress Report",
    author: testUser.id,
    attachments: 1,
    status: "Sent",
    urgent: false,
    forInfo: false,
    actionRequired: false,
    projectId,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  console.log("✓ Inserted letter");

  // Insert Memo
  await db.insert(memos).values({
    id: randomUUID(),
    memoNumber: `MEMO-${Date.now()}`,
    date: new Date(),
    from: "Project Manager",
    to: "All Staff",
    subject: "Test Memo",
    category: "Internal",
    content: "Test memo content for validation",
    urgent: false,
    status: "Distributed",
    projectId,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  console.log("✓ Inserted memo");

  // Insert Minutes of Meeting
  const momId = randomUUID();
  await db.insert(minutesOfMeeting).values({
    id: momId,
    momNumber: `MOM-${Date.now()}`,
    meetingDate: new Date(),
    issuedDate: new Date(),
    meetingType: "Weekly Progress",
    title: "Test Meeting",
    location: "Conference Room",
    chairperson: "Test Chair",
    minuteTaker: testUser.id,
    agenda: JSON.stringify(["Agenda Item 1", "Agenda Item 2"]),
    decisions: JSON.stringify(["Decision 1", "Decision 2"]),
    status: "Issued",
    distribution: JSON.stringify(["CLT", "VND"]),
    projectId,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  console.log("✓ Inserted minutes of meeting");

  // Insert MoM Attendee
  await db.insert(momAttendees).values({
    id: randomUUID(),
    momId,
    name: "Test Attendee",
    organization: "Test Org",
    role: "Manager",
    createdAt: new Date(),
  });
  console.log("✓ Inserted MoM attendee");

  // Insert MoM Action Item
  await db.insert(momActionItems).values({
    id: randomUUID(),
    momId,
    item: "Test action item",
    assignedTo: "Test User",
    dueDate: new Date(),
    status: "Open",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  console.log("✓ Inserted MoM action item");

  // Insert Technical Query
  await db.insert(technicalQueries).values({
    id: randomUUID(),
    queryNumber: `TQ-${Date.now()}`,
    date: new Date(),
    raisedBy: testUser.id,
    discipline: "Structural",
    subject: "Test Technical Query",
    description: "Test query description",
    status: "Open",
    priority: "High",
    assignedTo: "CLT",
    projectId,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  console.log("✓ Inserted technical query");

  // Insert Site Technical Query
  await db.insert(siteTechQueries).values({
    id: randomUUID(),
    queryNumber: `STQ-${Date.now()}`,
    date: new Date(),
    raisedBy: "Site Team",
    discipline: "Civil",
    subject: "Test Site Query",
    description: "Test site query description",
    location: "Grid A1",
    status: "Open",
    priority: "Medium",
    assignedTo: testUser.id,
    projectId,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  console.log("✓ Inserted site technical query");

  // Insert RFI
  await db.insert(rfis).values({
    id: randomUUID(),
    rfiNumber: `RFI-${Date.now()}`,
    date: new Date(),
    raisedBy: "Test Org",
    from: "VND",
    subject: "Test RFI",
    description: "Test RFI description",
    category: "Materials",
    status: "Under Review",
    priority: "High",
    assignedTo: testUser.id,
    projectId,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  console.log("✓ Inserted RFI");

  // Insert Submittal
  const submittalId = randomUUID();
  await db.insert(submittals).values({
    id: submittalId,
    submittalNumber: `SUB-${Date.now()}`,
    type: "shop_drawing",
    specificationSection: "01 23 00",
    revision: "0",
    reviewStatus: "pending",
    submittedAt: new Date(),
    submittedBy: testUser.id,
    projectId,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  console.log("✓ Inserted submittal");

  // Insert Submittal Document
  await db.insert(submittalDocuments).values({
    id: randomUUID(),
    submittalId,
    documentId,
    revision: "A",
    createdAt: new Date(),
  });
  console.log("✓ Inserted submittal document");

  // Insert Change Order
  const changeOrderId = randomUUID();
  await db.insert(changeOrders).values({
    id: changeOrderId,
    changeOrderNumber: `CO-${Date.now()}`,
    originalContractValue: 100000000,
    changeValue: 5000000,
    reason: "Test change order",
    approvalStatus: "pending",
    projectId,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  console.log("✓ Inserted change order");

  // Insert Change Order Document
  await db.insert(changeOrderDocuments).values({
    id: randomUUID(),
    changeOrderId,
    documentId,
    createdAt: new Date(),
  });
  console.log("✓ Inserted change order document");

  // Insert Schedule Activity
  await db.insert(scheduleActivities).values({
    id: randomUUID(),
    projectId,
    activityCode: "ACT-001",
    name: "Test Activity",
    wbs: "1.1.1",
    phase: "engineering",
    startDate: "2026-01-01",
    endDate: "2026-01-31",
    plannedProgress: 50,
    actualProgress: 25,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  console.log("✓ Inserted schedule activity");

  // Insert Schedule Sync
  await db.insert(scheduleSync).values({
    id: randomUUID(),
    projectId,
    source: "Primavera P6",
    lastSyncAt: new Date(),
    syncedBy: "Test User",
    projectStart: "2026-01-01",
    projectEnd: "2026-12-31",
    createdAt: new Date(),
  });
  console.log("✓ Inserted schedule sync");

  // Insert Notification
  await db.insert(notifications).values({
    id: randomUUID(),
    userId: testUser.id,
    type: "document",
    title: "Test Notification",
    message: "Test notification message",
    projectId,
    documentId,
    isRead: false,
    createdAt: new Date(),
  });
  console.log("✓ Inserted notification");

  // Insert Activity Log
  await db.insert(activityLog).values({
    id: randomUUID(),
    userId: testUser.id,
    projectId,
    action: "create",
    entityType: "document",
    entityId: documentId,
    entityName: "Test Document",
    description: "Created test document",
    createdAt: new Date(),
  });
  console.log("✓ Inserted activity log");

  // Insert Commissioning Checklist
  const checklistId = randomUUID();
  await db.insert(commissioningChecklists).values({
    id: checklistId,
    checklistNumber: `CHK-${Date.now()}`,
    system: "HVAC",
    description: "Test commissioning checklist",
    status: "pending",
    projectId,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  console.log("✓ Inserted commissioning checklist");

  // Insert Commissioning Checklist Item
  await db.insert(commissioningChecklistItems).values({
    id: randomUUID(),
    checklistId,
    itemNumber: "1",
    description: "Test checklist item",
    status: "pending",
    documentId,
  });
  console.log("✓ Inserted commissioning checklist item");

  // Insert Document Workflow
  const workflowId = randomUUID();
  await db.insert(documentWorkflows).values({
    id: workflowId,
    documentId,
    workflowName: "Test Workflow",
    currentStep: 1,
    totalSteps: 2,
    status: "pending",
    startedAt: new Date(),
    createdBy: testUser.id,
  });
  console.log("✓ Inserted document workflow");

  // Insert Workflow Step
  await db.insert(workflowSteps).values({
    id: randomUUID(),
    workflowId,
    stepNumber: 1,
    stepName: "Review",
    assignedTo: testUser.id,
    assignedRole: "admin",
    status: "pending",
    dueDate: new Date(),
  });
  console.log("✓ Inserted workflow step");

  console.log("\n=== TEST DATA INSERTION COMPLETE ===");
}

insertTestData().catch(console.error);
