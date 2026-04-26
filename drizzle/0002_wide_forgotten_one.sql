CREATE TABLE `accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`account_id` text NOT NULL,
	`password` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `activity_log` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`project_id` text,
	`action` text NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text NOT NULL,
	`entity_name` text,
	`description` text,
	`metadata` text,
	`ip_address` text,
	`user_agent` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `change_order_documents` (
	`id` text PRIMARY KEY NOT NULL,
	`change_order_id` text NOT NULL,
	`document_id` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`change_order_id`) REFERENCES `change_orders`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`document_id`) REFERENCES `documents`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `change_orders` (
	`id` text PRIMARY KEY NOT NULL,
	`change_order_number` text NOT NULL,
	`original_contract_value` integer,
	`change_value` integer NOT NULL,
	`reason` text NOT NULL,
	`approval_status` text DEFAULT 'pending' NOT NULL,
	`approved_by` text,
	`approved_at` integer,
	`project_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`approved_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `change_orders_change_order_number_unique` ON `change_orders` (`change_order_number`);--> statement-breakpoint
CREATE TABLE `commissioning_checklist_items` (
	`id` text PRIMARY KEY NOT NULL,
	`checklist_id` text NOT NULL,
	`item_number` text NOT NULL,
	`description` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`comments` text,
	`document_id` text,
	FOREIGN KEY (`checklist_id`) REFERENCES `commissioning_checklists`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`document_id`) REFERENCES `documents`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `commissioning_checklists` (
	`id` text PRIMARY KEY NOT NULL,
	`checklist_number` text NOT NULL,
	`system` text NOT NULL,
	`description` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`project_id` text NOT NULL,
	`completed_by` text,
	`completed_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`completed_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `commissioning_checklists_checklist_number_unique` ON `commissioning_checklists` (`checklist_number`);--> statement-breakpoint
CREATE TABLE `document_comments` (
	`id` text PRIMARY KEY NOT NULL,
	`document_id` text NOT NULL,
	`user_id` text NOT NULL,
	`comment` text NOT NULL,
	`comment_type` text DEFAULT 'general' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`document_id`) REFERENCES `documents`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `document_versions` (
	`id` text PRIMARY KEY NOT NULL,
	`document_id` text NOT NULL,
	`version` text NOT NULL,
	`file_name` text NOT NULL,
	`file_url` text NOT NULL,
	`file_size` integer,
	`change_description` text,
	`uploaded_at` integer NOT NULL,
	`uploaded_by` text,
	FOREIGN KEY (`document_id`) REFERENCES `documents`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`uploaded_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `document_workflows` (
	`id` text PRIMARY KEY NOT NULL,
	`document_id` text NOT NULL,
	`workflow_name` text NOT NULL,
	`current_step` integer DEFAULT 1 NOT NULL,
	`total_steps` integer NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`started_at` integer NOT NULL,
	`completed_at` integer,
	`created_by` text,
	FOREIGN KEY (`document_id`) REFERENCES `documents`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `documents` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`document_number` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`discipline` text,
	`category` text,
	`document_type` text,
	`version` text DEFAULT '1.0' NOT NULL,
	`revision` text,
	`is_latest_version` integer DEFAULT true NOT NULL,
	`file_name` text NOT NULL,
	`file_size` integer,
	`file_type` text,
	`file_url` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`tags` text,
	`as_built_revision` text,
	`is_as_built` integer DEFAULT false,
	`custom_fields` text,
	`images` text,
	`uploaded_at` integer NOT NULL,
	`uploaded_by` text,
	`updated_at` integer NOT NULL,
	`updated_by` text,
	`approved_at` integer,
	`approved_by` text,
	`rejected_at` integer,
	`rejected_by` text,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`uploaded_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`approved_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`rejected_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `files` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`type` text NOT NULL,
	`file_id` text NOT NULL,
	`file_name` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `letter_related_documents` (
	`id` text PRIMARY KEY NOT NULL,
	`letter_id` text NOT NULL,
	`document_id` text NOT NULL,
	`revision` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`letter_id`) REFERENCES `letters`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`document_id`) REFERENCES `documents`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `letters` (
	`id` text PRIMARY KEY NOT NULL,
	`letter_number` text NOT NULL,
	`date` integer NOT NULL,
	`direction` text NOT NULL,
	`from` text NOT NULL,
	`to` text NOT NULL,
	`to_type` text NOT NULL,
	`subject` text NOT NULL,
	`category` text NOT NULL,
	`ref` text,
	`author` text NOT NULL,
	`attachments` integer DEFAULT 0 NOT NULL,
	`status` text NOT NULL,
	`urgent` integer DEFAULT false NOT NULL,
	`for_info` integer DEFAULT false NOT NULL,
	`action_required` integer DEFAULT false NOT NULL,
	`response_required` text,
	`project_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`author`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `letters_letter_number_unique` ON `letters` (`letter_number`);--> statement-breakpoint
CREATE TABLE `memos` (
	`id` text PRIMARY KEY NOT NULL,
	`memo_number` text NOT NULL,
	`date` integer NOT NULL,
	`from` text NOT NULL,
	`to` text NOT NULL,
	`subject` text NOT NULL,
	`category` text NOT NULL,
	`content` text NOT NULL,
	`urgent` integer DEFAULT false NOT NULL,
	`status` text NOT NULL,
	`project_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `memos_memo_number_unique` ON `memos` (`memo_number`);--> statement-breakpoint
CREATE TABLE `minutes_of_meeting` (
	`id` text PRIMARY KEY NOT NULL,
	`mom_number` text NOT NULL,
	`meeting_date` integer NOT NULL,
	`issued_date` integer NOT NULL,
	`meeting_type` text NOT NULL,
	`title` text NOT NULL,
	`location` text NOT NULL,
	`chairperson` text NOT NULL,
	`minute_taker` text NOT NULL,
	`agenda` text NOT NULL,
	`decisions` text NOT NULL,
	`next_meeting` integer,
	`status` text NOT NULL,
	`distribution` text NOT NULL,
	`project_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`minute_taker`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `minutes_of_meeting_mom_number_unique` ON `minutes_of_meeting` (`mom_number`);--> statement-breakpoint
CREATE TABLE `mom_action_items` (
	`id` text PRIMARY KEY NOT NULL,
	`mom_id` text NOT NULL,
	`item` text NOT NULL,
	`assigned_to` text NOT NULL,
	`due_date` integer,
	`status` text DEFAULT 'Open' NOT NULL,
	`completed_date` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`mom_id`) REFERENCES `minutes_of_meeting`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `mom_attendees` (
	`id` text PRIMARY KEY NOT NULL,
	`mom_id` text NOT NULL,
	`name` text NOT NULL,
	`organization` text NOT NULL,
	`role` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`mom_id`) REFERENCES `minutes_of_meeting`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`type` text NOT NULL,
	`title` text NOT NULL,
	`message` text NOT NULL,
	`project_id` text,
	`document_id` text,
	`related_entity_type` text,
	`related_entity_id` text,
	`action_url` text,
	`is_read` integer DEFAULT false NOT NULL,
	`read_at` integer,
	`created_at` integer NOT NULL,
	`email_sent` integer DEFAULT false NOT NULL,
	`email_sent_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`document_id`) REFERENCES `documents`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `project_members` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`user_id` text NOT NULL,
	`role` text NOT NULL,
	`permissions` text,
	`assigned_at` integer NOT NULL,
	`assigned_by` text,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`assigned_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`project_number` text,
	`location` text,
	`client_id` text,
	`status` text DEFAULT 'active' NOT NULL,
	`start_date` integer,
	`end_date` integer,
	`images` text,
	`contract_value` integer,
	`contract_type` text,
	`contract_number` text,
	`client_name` text,
	`notice_to_proceed_date` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`created_by` text,
	FOREIGN KEY (`client_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `projects_project_number_unique` ON `projects` (`project_number`);--> statement-breakpoint
CREATE TABLE `query_linked_documents` (
	`id` text PRIMARY KEY NOT NULL,
	`query_id` text NOT NULL,
	`query_type` text NOT NULL,
	`document_id` text NOT NULL,
	`revision` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`document_id`) REFERENCES `documents`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `rfis` (
	`id` text PRIMARY KEY NOT NULL,
	`rfi_number` text NOT NULL,
	`date` integer NOT NULL,
	`raised_by` text NOT NULL,
	`from` text NOT NULL,
	`subject` text NOT NULL,
	`description` text NOT NULL,
	`category` text NOT NULL,
	`status` text NOT NULL,
	`priority` text NOT NULL,
	`assigned_to` text NOT NULL,
	`due_date` integer,
	`response_date` integer,
	`response` text,
	`project_id` text NOT NULL,
	`related_submittal_id` text,
	`related_change_order_id` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`assigned_to`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `rfis_rfi_number_unique` ON `rfis` (`rfi_number`);--> statement-breakpoint
CREATE TABLE `schedule_activities` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`activity_code` text NOT NULL,
	`name` text NOT NULL,
	`wbs` text NOT NULL,
	`phase` text NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text NOT NULL,
	`planned_progress` integer DEFAULT 0 NOT NULL,
	`actual_progress` integer DEFAULT 0 NOT NULL,
	`linked_documents` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `schedule_sync` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`source` text NOT NULL,
	`last_sync_at` integer NOT NULL,
	`synced_by` text NOT NULL,
	`project_start` text NOT NULL,
	`project_end` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `site_tech_queries` (
	`id` text PRIMARY KEY NOT NULL,
	`query_number` text NOT NULL,
	`date` integer NOT NULL,
	`raised_by` text NOT NULL,
	`discipline` text NOT NULL,
	`subject` text NOT NULL,
	`description` text NOT NULL,
	`location` text,
	`status` text NOT NULL,
	`priority` text NOT NULL,
	`assigned_to` text NOT NULL,
	`due_date` integer,
	`response_date` integer,
	`response` text,
	`project_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`assigned_to`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `site_tech_queries_query_number_unique` ON `site_tech_queries` (`query_number`);--> statement-breakpoint
CREATE TABLE `submittal_documents` (
	`id` text PRIMARY KEY NOT NULL,
	`submittal_id` text NOT NULL,
	`document_id` text NOT NULL,
	`revision` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`submittal_id`) REFERENCES `submittals`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`document_id`) REFERENCES `documents`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `submittals` (
	`id` text PRIMARY KEY NOT NULL,
	`submittal_number` text NOT NULL,
	`type` text NOT NULL,
	`specification_section` text,
	`revision` text DEFAULT '0' NOT NULL,
	`review_status` text DEFAULT 'pending' NOT NULL,
	`due_date` integer,
	`submitted_at` integer NOT NULL,
	`submitted_by` text NOT NULL,
	`reviewed_at` integer,
	`reviewed_by` text,
	`comments` text,
	`project_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`submitted_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`reviewed_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `submittals_submittal_number_unique` ON `submittals` (`submittal_number`);--> statement-breakpoint
CREATE TABLE `technical_queries` (
	`id` text PRIMARY KEY NOT NULL,
	`query_number` text NOT NULL,
	`date` integer NOT NULL,
	`raised_by` text NOT NULL,
	`discipline` text NOT NULL,
	`subject` text NOT NULL,
	`description` text NOT NULL,
	`status` text NOT NULL,
	`priority` text NOT NULL,
	`assigned_to` text NOT NULL,
	`due_date` integer,
	`response_date` integer,
	`response` text,
	`project_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`raised_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `technical_queries_query_number_unique` ON `technical_queries` (`query_number`);--> statement-breakpoint
CREATE TABLE `transmittal_documents` (
	`id` text PRIMARY KEY NOT NULL,
	`transmittal_id` text NOT NULL,
	`document_id` text NOT NULL,
	`remarks` text,
	`added_at` integer NOT NULL,
	FOREIGN KEY (`transmittal_id`) REFERENCES `transmittals`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`document_id`) REFERENCES `documents`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `transmittals` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`transmittal_number` text NOT NULL,
	`subject` text NOT NULL,
	`description` text,
	`purpose` text DEFAULT 'IFR' NOT NULL,
	`due_date` integer,
	`sent_from` text,
	`sent_to` text NOT NULL,
	`cc_to` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`created_at` integer NOT NULL,
	`sent_at` integer,
	`acknowledged_at` integer,
	`acknowledged_by` text,
	`notes` text,
	`custom_fields` text,
	`images` text,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`sent_from`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`acknowledged_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `transmittals_transmittal_number_unique` ON `transmittals` (`transmittal_number`);--> statement-breakpoint
CREATE TABLE `workflow_steps` (
	`id` text PRIMARY KEY NOT NULL,
	`workflow_id` text NOT NULL,
	`step_number` integer NOT NULL,
	`step_name` text NOT NULL,
	`assigned_to` text NOT NULL,
	`assigned_role` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`action` text,
	`approval_code` integer,
	`comments` text,
	`attachment_url` text,
	`attachment_file_name` text,
	`attachment_file_size` integer,
	`started_at` integer,
	`completed_at` integer,
	`due_date` integer,
	FOREIGN KEY (`workflow_id`) REFERENCES `document_workflows`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`assigned_to`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`role` text DEFAULT 'user' NOT NULL,
	`email_verified` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "email", "name", "role", "email_verified", "created_at", "updated_at") SELECT "id", "email", "name", "role", "email_verified", "created_at", "updated_at" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
ALTER TABLE `sessions` ADD `ip_address` text;--> statement-breakpoint
ALTER TABLE `sessions` ADD `user_agent` text;