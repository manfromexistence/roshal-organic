CREATE TABLE `organizations` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`avatar` text DEFAULT '/evilrabbit.png' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `organizations_name_unique` ON `organizations` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `organizations_email_unique` ON `organizations` (`email`);--> statement-breakpoint
ALTER TABLE `users` ADD `organization_id` text REFERENCES organizations(id);