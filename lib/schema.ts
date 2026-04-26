import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const organizations = sqliteTable("organizations", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  email: text("email").notNull().unique(),
  avatar: text("avatar").notNull().default("/evilrabbit.png"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: text("role").notNull().default("user"), // EDMS related role: user, admin, client, pmc, vendor, subcontractor
  organizationId: text("organization_id").references(() => organizations.id, {
    onDelete: "set null",
  }),
  emailVerified: text("email_verified"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const accounts = sqliteTable("accounts", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  providerId: text("provider_id").notNull(),
  accountId: text("account_id").notNull(),
  password: text("password").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const files = sqliteTable("files", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // "imgbb" or "catbox"
  fileId: text("file_id").notNull(), // Unique ID from imgbb or catbox
  fileName: text("file_name").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

// EDMS Schema - Projects
export const projects = sqliteTable("projects", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  projectNumber: text("project_number").unique(),
  location: text("location"),
  clientId: text("client_id").references(() => users.id, {
    onDelete: "set null",
  }),
  status: text("status").notNull().default("active"),
  startDate: integer("start_date", { mode: "timestamp" }),
  endDate: integer("end_date", { mode: "timestamp" }),
  images: text("images"),
  // Contract details
  contractValue: integer("contract_value"), // In cents/minor units
  contractType: text("contract_type"), // lump_sum, cost_plus, unit_rate
  contractNumber: text("contract_number"),
  clientName: text("client_name"),
  noticeToProceedDate: integer("notice_to_proceed_date", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  createdBy: text("created_by").references(() => users.id, {
    onDelete: "set null",
  }),
});

export const projectMembers = sqliteTable("project_members", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  role: text("role").notNull(),
  permissions: text("permissions"),
  assignedAt: integer("assigned_at", { mode: "timestamp" }).notNull(),
  assignedBy: text("assigned_by").references(() => users.id, {
    onDelete: "set null",
  }),
});

export const projectConfigs = sqliteTable("project_config", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .unique()
    .references(() => projects.id, { onDelete: "cascade" }),
  numberingPattern: text("numbering_pattern")
    .notNull()
    .default("PRJ-DISC-TYPE-SEQ"),
  sequencePadding: integer("sequence_padding").notNull().default(4),
  separator: text("separator").notNull().default("-"),
  revisionScheme: text("revision_scheme").notNull().default("alpha-numeric"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const projectDisciplines = sqliteTable("disciplines", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  code: text("code").notNull(),
  name: text("name").notNull(),
  color: text("color").notNull().default("#6b7280"),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const projectDocumentTypes = sqliteTable("document_types", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  code: text("code").notNull(),
  name: text("name").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const projectStakeholders = sqliteTable("stakeholders", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  stakeholderId: text("stakeholder_id").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  contact: text("contact"),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const workflowStepTemplates = sqliteTable("workflow_step_templates", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  stepName: text("step_name").notNull(),
  actor: text("actor").notNull(),
  duration: text("duration").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// EDMS Schema - Documents
export const documents = sqliteTable("documents", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  documentNumber: text("document_number").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  discipline: text("discipline"),
  category: text("category"),
  documentType: text("document_type"), // design, shop_drawing, as_built, manufacturer_data
  version: text("version").notNull().default("1.0"),
  revision: text("revision"),
  isLatestVersion: integer("is_latest_version", { mode: "boolean" })
    .notNull()
    .default(true),
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size"),
  fileType: text("file_type"),
  fileUrl: text("file_url").notNull(),
  status: text("status").notNull().default("draft"), // draft, A (Approved for Construction), B (Approved for Design), C (Approved for Construction), I (Issued for Information), R (Revise and Resubmit), rejected
  tags: text("tags"),
  // As-built tracking
  asBuiltRevision: text("as_built_revision"),
  isAsBuilt: integer("is_as_built", { mode: "boolean" }).default(false),
  customFields: text("custom_fields"),
  images: text("images"),
  uploadedAt: integer("uploaded_at", { mode: "timestamp" }).notNull(),
  uploadedBy: text("uploaded_by").references(() => users.id, {
    onDelete: "set null",
  }),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  updatedBy: text("updated_by").references(() => users.id, {
    onDelete: "set null",
  }),
  approvedAt: integer("approved_at", { mode: "timestamp" }),
  approvedBy: text("approved_by").references(() => users.id, {
    onDelete: "set null",
  }),
  rejectedAt: integer("rejected_at", { mode: "timestamp" }),
  rejectedBy: text("rejected_by").references(() => users.id, {
    onDelete: "set null",
  }),
});

export const documentVersions = sqliteTable("document_versions", {
  id: text("id").primaryKey(),
  documentId: text("document_id")
    .notNull()
    .references(() => documents.id, { onDelete: "cascade" }),
  version: text("version").notNull(),
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  fileSize: integer("file_size"),
  changeDescription: text("change_description"),
  uploadedAt: integer("uploaded_at", { mode: "timestamp" }).notNull(),
  uploadedBy: text("uploaded_by").references(() => users.id, {
    onDelete: "set null",
  }),
});

export const documentComments = sqliteTable("document_comments", {
  id: text("id").primaryKey(),
  documentId: text("document_id")
    .notNull()
    .references(() => documents.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  comment: text("comment").notNull(),
  commentType: text("comment_type").notNull().default("general"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// EDMS Schema - Workflows
export const documentWorkflows = sqliteTable("document_workflows", {
  id: text("id").primaryKey(),
  documentId: text("document_id")
    .notNull()
    .references(() => documents.id, { onDelete: "cascade" }),
  workflowName: text("workflow_name").notNull(),
  currentStep: integer("current_step").notNull().default(1),
  totalSteps: integer("total_steps").notNull(),
  status: text("status").notNull().default("pending"),
  startedAt: integer("started_at", { mode: "timestamp" }).notNull(),
  completedAt: integer("completed_at", { mode: "timestamp" }),
  createdBy: text("created_by").references(() => users.id, {
    onDelete: "set null",
  }),
});

export const workflowSteps = sqliteTable("workflow_steps", {
  id: text("id").primaryKey(),
  workflowId: text("workflow_id")
    .notNull()
    .references(() => documentWorkflows.id, { onDelete: "cascade" }),
  stepNumber: integer("step_number").notNull(),
  stepName: text("step_name").notNull(),
  assignedTo: text("assigned_to")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  assignedRole: text("assigned_role"),
  status: text("status").notNull().default("pending"),
  action: text("action"),
  approvalCode: integer("approval_code"),
  comments: text("comments"),
  attachmentUrl: text("attachment_url"),
  attachmentFileName: text("attachment_file_name"),
  attachmentFileSize: integer("attachment_file_size"),
  startedAt: integer("started_at", { mode: "timestamp" }),
  completedAt: integer("completed_at", { mode: "timestamp" }),
  dueDate: integer("due_date", { mode: "timestamp" }),
});

// EDMS Schema - Transmittals
export const transmittals = sqliteTable("transmittals", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  transmittalNumber: text("transmittal_number").notNull().unique(),
  subject: text("subject").notNull(),
  description: text("description"),
  purpose: text("purpose").notNull().default("IFR"),
  dueDate: integer("due_date", { mode: "timestamp" }),
  sentFrom: text("sent_from").references(() => users.id, {
    onDelete: "set null",
  }),
  sentTo: text("sent_to").notNull(),
  ccTo: text("cc_to"),
  status: text("status").notNull().default("draft"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  sentAt: integer("sent_at", { mode: "timestamp" }),
  acknowledgedAt: integer("acknowledged_at", { mode: "timestamp" }),
  acknowledgedBy: text("acknowledged_by").references(() => users.id, {
    onDelete: "set null",
  }),
  notes: text("notes"),
  customFields: text("custom_fields"),
  images: text("images"),
});

export const transmittalDocuments = sqliteTable("transmittal_documents", {
  id: text("id").primaryKey(),
  transmittalId: text("transmittal_id")
    .notNull()
    .references(() => transmittals.id, { onDelete: "cascade" }),
  documentId: text("document_id")
    .notNull()
    .references(() => documents.id, { onDelete: "cascade" }),
  remarks: text("remarks"),
  addedAt: integer("added_at", { mode: "timestamp" }).notNull(),
});

// EDMS Schema - Correspondence
// Letters Register
export const letters = sqliteTable("letters", {
  id: text("id").primaryKey(),
  letterNumber: text("letter_number").notNull().unique(),
  date: integer("date", { mode: "timestamp" }).notNull(),
  direction: text("direction").notNull(), // Outgoing, Incoming
  from: text("from").notNull(),
  to: text("to").notNull(),
  toType: text("to_type").notNull(), // Client, Vendor, Subcontractor, Consultant, Third Party
  subject: text("subject").notNull(),
  category: text("category").notNull(), // Progress Report, Procurement, Approval, Variation, Safety, etc.
  ref: text("ref"), // External reference number
  author: text("author")
    .notNull()
    .references(() => users.id),
  attachments: integer("attachments").notNull().default(0),
  status: text("status").notNull(), // Sent, Received, Awaiting Response, Responded
  urgent: integer("urgent", { mode: "boolean" }).notNull().default(false),
  forInfo: integer("for_info", { mode: "boolean" }).notNull().default(false),
  actionRequired: integer("action_required", { mode: "boolean" })
    .notNull()
    .default(false),
  responseRequired: text("response_required"), // Y, N, or null
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// Internal Memos
export const memos = sqliteTable("memos", {
  id: text("id").primaryKey(),
  memoNumber: text("memo_number").notNull().unique(),
  date: integer("date", { mode: "timestamp" }).notNull(),
  from: text("from").notNull(), // Role/position
  to: text("to").notNull(), // Recipients
  subject: text("subject").notNull(),
  category: text("category").notNull(), // Internal, Administrative, Quality, Safety, etc.
  content: text("content").notNull(),
  urgent: integer("urgent", { mode: "boolean" }).notNull().default(false),
  status: text("status").notNull(), // Draft, Distributed, Archived
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// Minutes of Meeting (MoM)
export const minutesOfMeeting = sqliteTable("minutes_of_meeting", {
  id: text("id").primaryKey(),
  momNumber: text("mom_number").notNull().unique(),
  meetingDate: integer("meeting_date", { mode: "timestamp" }).notNull(),
  issuedDate: integer("issued_date", { mode: "timestamp" }).notNull(),
  meetingType: text("meeting_type").notNull(), // Weekly Progress, Design Review, Safety, Kickoff, Closeout, etc.
  title: text("title").notNull(),
  location: text("location").notNull(),
  chairperson: text("chairperson").notNull(),
  minuteTaker: text("minute_taker")
    .notNull()
    .references(() => users.id),
  agenda: text("agenda").notNull(), // JSON array
  decisions: text("decisions").notNull(), // JSON array
  nextMeeting: integer("next_meeting", { mode: "timestamp" }),
  status: text("status").notNull(), // Draft, Issued, Approved
  distribution: text("distribution").notNull(), // JSON array of stakeholder codes
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// MoM Attendees
export const momAttendees = sqliteTable("mom_attendees", {
  id: text("id").primaryKey(),
  momId: text("mom_id")
    .notNull()
    .references(() => minutesOfMeeting.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  organization: text("organization").notNull(),
  role: text("role"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

// MoM Action Items
export const momActionItems = sqliteTable("mom_action_items", {
  id: text("id").primaryKey(),
  momId: text("mom_id")
    .notNull()
    .references(() => minutesOfMeeting.id, { onDelete: "cascade" }),
  item: text("item").notNull(),
  assignedTo: text("assigned_to").notNull(),
  dueDate: integer("due_date", { mode: "timestamp" }),
  status: text("status").notNull().default("Open"), // Open, In Progress, Completed, Overdue
  completedDate: integer("completed_date", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// Letter Related Documents
export const letterRelatedDocuments = sqliteTable("letter_related_documents", {
  id: text("id").primaryKey(),
  letterId: text("letter_id")
    .notNull()
    .references(() => letters.id, { onDelete: "cascade" }),
  documentId: text("document_id")
    .notNull()
    .references(() => documents.id, { onDelete: "cascade" }),
  revision: text("revision"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

// EDMS Schema - Queries
// Technical Queries (TQ)
export const technicalQueries = sqliteTable("technical_queries", {
  id: text("id").primaryKey(),
  queryNumber: text("query_number").notNull().unique(),
  date: integer("date", { mode: "timestamp" }).notNull(),
  raisedBy: text("raised_by")
    .notNull()
    .references(() => users.id),
  discipline: text("discipline").notNull(),
  subject: text("subject").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull(), // Open, Responded, Closed
  priority: text("priority").notNull(), // High, Medium, Low
  assignedTo: text("assigned_to").notNull(), // CLT, VND, SUB, THP, or user ID
  dueDate: integer("due_date", { mode: "timestamp" }),
  responseDate: integer("response_date", { mode: "timestamp" }),
  response: text("response"),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// Site Technical Queries (STQ)
export const siteTechQueries = sqliteTable("site_tech_queries", {
  id: text("id").primaryKey(),
  queryNumber: text("query_number").notNull().unique(),
  date: integer("date", { mode: "timestamp" }).notNull(),
  raisedBy: text("raised_by").notNull(), // Usually "Site Team"
  discipline: text("discipline").notNull(),
  subject: text("subject").notNull(),
  description: text("description").notNull(),
  location: text("location"), // Site location/grid reference
  status: text("status").notNull(), // Open, Responded, Closed
  priority: text("priority").notNull(), // High, Medium, Low
  assignedTo: text("assigned_to")
    .notNull()
    .references(() => users.id),
  dueDate: integer("due_date", { mode: "timestamp" }),
  responseDate: integer("response_date", { mode: "timestamp" }),
  response: text("response"),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// RFIs (Request for Information)
export const rfis = sqliteTable("rfis", {
  id: text("id").primaryKey(),
  rfiNumber: text("rfi_number").notNull().unique(),
  date: integer("date", { mode: "timestamp" }).notNull(),
  raisedBy: text("raised_by").notNull(), // Organization name
  from: text("from").notNull(), // CLT, VND, SUB, THP, SUP
  subject: text("subject").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // Materials, Design, QA/QC, Safety, etc.
  status: text("status").notNull(), // Under Review, Responded, Closed
  priority: text("priority").notNull(), // High, Medium, Low
  assignedTo: text("assigned_to")
    .notNull()
    .references(() => users.id),
  dueDate: integer("due_date", { mode: "timestamp" }),
  responseDate: integer("response_date", { mode: "timestamp" }),
  response: text("response"),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id),
  relatedSubmittalId: text("related_submittal_id"),
  relatedChangeOrderId: text("related_change_order_id"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// Query/RFI Linked Documents
export const queryLinkedDocuments = sqliteTable("query_linked_documents", {
  id: text("id").primaryKey(),
  queryId: text("query_id").notNull(), // Can be TQ, STQ, or RFI ID
  queryType: text("query_type").notNull(), // TQ, STQ, RFI
  documentId: text("document_id")
    .notNull()
    .references(() => documents.id, { onDelete: "cascade" }),
  revision: text("revision"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

// EDMS Schema - Submittals
// Submittals - Shop drawings, material submittals, equipment submittals
export const submittals = sqliteTable("submittals", {
  id: text("id").primaryKey(),
  submittalNumber: text("submittal_number").notNull().unique(),
  type: text("type").notNull(), // shop_drawing, material, equipment
  specificationSection: text("specification_section"), // Spec section number (e.g., "01 23 00")
  revision: text("revision").notNull().default("0"),
  reviewStatus: text("review_status").notNull().default("pending"), // pending, under_review, approved, approved_with_comments, revise_and_resubmit, rejected
  dueDate: integer("due_date", { mode: "timestamp" }),
  submittedAt: integer("submitted_at", { mode: "timestamp" }).notNull(),
  submittedBy: text("submitted_by")
    .notNull()
    .references(() => users.id, { onDelete: "set null" }),
  reviewedAt: integer("reviewed_at", { mode: "timestamp" }),
  reviewedBy: text("reviewed_by").references(() => users.id, {
    onDelete: "set null",
  }),
  comments: text("comments"),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// Submittal Documents - Junction table linking submittals to documents
export const submittalDocuments = sqliteTable("submittal_documents", {
  id: text("id").primaryKey(),
  submittalId: text("submittal_id")
    .notNull()
    .references(() => submittals.id, { onDelete: "cascade" }),
  documentId: text("document_id")
    .notNull()
    .references(() => documents.id, { onDelete: "cascade" }),
  revision: text("revision").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

// EDMS Schema - Change Orders
// Change Orders / Variations
export const changeOrders = sqliteTable("change_orders", {
  id: text("id").primaryKey(),
  changeOrderNumber: text("change_order_number").notNull().unique(),
  originalContractValue: integer("original_contract_value"), // In cents/minor units
  changeValue: integer("change_value").notNull(), // In cents/minor units
  reason: text("reason").notNull(),
  approvalStatus: text("approval_status").notNull().default("pending"), // pending, approved, rejected
  approvedBy: text("approved_by").references(() => users.id, {
    onDelete: "set null",
  }),
  approvedAt: integer("approved_at", { mode: "timestamp" }),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// Change Order Documents - Junction table linking change orders to documents
export const changeOrderDocuments = sqliteTable("change_order_documents", {
  id: text("id").primaryKey(),
  changeOrderId: text("change_order_id")
    .notNull()
    .references(() => changeOrders.id, { onDelete: "cascade" }),
  documentId: text("document_id")
    .notNull()
    .references(() => documents.id, { onDelete: "cascade" }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

// EDMS Schema - Schedule
export const scheduleActivities = sqliteTable("schedule_activities", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  activityCode: text("activity_code").notNull(),
  name: text("name").notNull(),
  wbs: text("wbs").notNull(),
  phase: text("phase").notNull(), // engineering, procurement, construction, commissioning
  startDate: text("start_date").notNull(), // YYYY-MM-DD
  endDate: text("end_date").notNull(), // YYYY-MM-DD
  plannedProgress: integer("planned_progress").notNull().default(0), // 0-100
  actualProgress: integer("actual_progress").notNull().default(0), // 0-100
  linkedDocuments: text("linked_documents"), // JSON array of document codes
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const scheduleSync = sqliteTable("schedule_sync", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  source: text("source").notNull(), // Primavera P6, MS Project, etc.
  lastSyncAt: integer("last_sync_at", { mode: "timestamp" }).notNull(),
  syncedBy: text("synced_by").notNull(),
  projectStart: text("project_start").notNull(), // YYYY-MM-DD
  projectEnd: text("project_end").notNull(), // YYYY-MM-DD
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

// EDMS Schema - Notifications
export const notifications = sqliteTable("notifications", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  projectId: text("project_id").references(() => projects.id, {
    onDelete: "cascade",
  }),
  documentId: text("document_id").references(() => documents.id, {
    onDelete: "cascade",
  }),
  relatedEntityType: text("related_entity_type"),
  relatedEntityId: text("related_entity_id"),
  actionUrl: text("action_url"),
  isRead: integer("is_read", { mode: "boolean" }).notNull().default(false),
  readAt: integer("read_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  emailSent: integer("email_sent", { mode: "boolean" })
    .notNull()
    .default(false),
  emailSentAt: integer("email_sent_at", { mode: "timestamp" }),
});

export const activityLog = sqliteTable("activity_log", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
  projectId: text("project_id").references(() => projects.id, {
    onDelete: "cascade",
  }),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  entityName: text("entity_name"),
  description: text("description"),
  metadata: text("metadata"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

// EDMS Schema - Commissioning
// Commissioning Checklists
export const commissioningChecklists = sqliteTable("commissioning_checklists", {
  id: text("id").primaryKey(),
  checklistNumber: text("checklist_number").notNull().unique(),
  system: text("system").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("pending"), // pending, in_progress, completed
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  completedBy: text("completed_by").references(() => users.id, {
    onDelete: "set null",
  }),
  completedAt: integer("completed_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// Commissioning Checklist Items
export const commissioningChecklistItems = sqliteTable(
  "commissioning_checklist_items",
  {
    id: text("id").primaryKey(),
    checklistId: text("checklist_id")
      .notNull()
      .references(() => commissioningChecklists.id, { onDelete: "cascade" }),
    itemNumber: text("item_number").notNull(),
    description: text("description").notNull(),
    status: text("status").notNull().default("pending"), // pending, passed, failed, na
    comments: text("comments"),
    documentId: text("document_id").references(() => documents.id, {
      onDelete: "set null",
    }),
  },
);

// EDMS Schema - Daily Reports
export const dailyReports = sqliteTable("daily_reports", {
  id: text("id").primaryKey(),
  reportDate: integer("report_date", { mode: "timestamp" }).notNull(),
  weather: text("weather"),
  activitiesCompleted: text("activities_completed"),
  issues: text("issues"),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  createdBy: text("created_by")
    .notNull()
    .references(() => users.id, { onDelete: "set null" }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// EDMS Schema - Extension of Time
export const extensionOfTimeRequests = sqliteTable(
  "extension_of_time_requests",
  {
    id: text("id").primaryKey(),
    eotNumber: text("eot_number").notNull().unique(),
    requestedDays: integer("requested_days").notNull(),
    reason: text("reason").notNull(),
    approvalStatus: text("approval_status").notNull().default("pending"),
    approvedDays: integer("approved_days"),
    approvedBy: text("approved_by").references(() => users.id, {
      onDelete: "set null",
    }),
    approvedAt: integer("approved_at", { mode: "timestamp" }),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  },
);

// EDMS Schema - Inspections
export const inspectionRequests = sqliteTable("inspection_requests", {
  id: text("id").primaryKey(),
  inspectionNumber: text("inspection_number").notNull().unique(),
  type: text("type").notNull(),
  location: text("location").notNull(),
  scheduledDate: integer("scheduled_date", { mode: "timestamp" }).notNull(),
  inspector: text("inspector"),
  results: text("results").notNull(),
  deficiencies: text("deficiencies"),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// EDMS Schema - Safety Observations
export const safetyObservations = sqliteTable("safety_observations", {
  id: text("id").primaryKey(),
  observationNumber: text("observation_number").notNull().unique(),
  type: text("type").notNull(),
  severity: text("severity").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  immediateAction: text("immediate_action"),
  status: text("status").notNull().default("open"),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  observedBy: text("observed_by")
    .notNull()
    .references(() => users.id, { onDelete: "set null" }),
  assignedTo: text("assigned_to").references(() => users.id, {
    onDelete: "set null",
  }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// EDMS Schema - Warranty
export const warrantyRecords = sqliteTable("warranty_records", {
  id: text("id").primaryKey(),
  warrantyNumber: text("warranty_number").notNull().unique(),
  item: text("item").notNull(),
  description: text("description").notNull(),
  startDate: integer("start_date", { mode: "timestamp" }).notNull(),
  endDate: integer("end_date", { mode: "timestamp" }).notNull(),
  warrantyType: text("warranty_type").notNull(),
  status: text("status").notNull().default("active"),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});
