ALTER TABLE `sessions` ADD `token` text NOT NULL;--> statement-breakpoint
ALTER TABLE `sessions` ADD `updated_at` integer NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_token_unique` ON `sessions` (`token`);