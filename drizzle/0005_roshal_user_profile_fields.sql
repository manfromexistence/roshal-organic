ALTER TABLE `users` ADD `image` text;
--> statement-breakpoint
ALTER TABLE `users` ADD `phone` text;
--> statement-breakpoint
ALTER TABLE `users` ADD `preferred_language` text DEFAULT 'bn' NOT NULL;
--> statement-breakpoint
ALTER TABLE `users` ADD `default_address` text;
--> statement-breakpoint
ALTER TABLE `users` ADD `is_active` integer DEFAULT true NOT NULL;
