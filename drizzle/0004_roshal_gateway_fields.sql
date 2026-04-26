CREATE TABLE IF NOT EXISTS `roshal_site_settings` (
	`id` text PRIMARY KEY NOT NULL,
	`brand_name` text DEFAULT 'Roshal Organic' NOT NULL,
	`tagline_bn` text NOT NULL,
	`tagline_en` text NOT NULL,
	`contact_phone` text,
	`contact_email` text,
	`whatsapp_phone` text,
	`address_bn` text,
	`address_en` text,
	`hero_layout` text DEFAULT 'split' NOT NULL,
	`card_style` text DEFAULT 'soft' NOT NULL,
	`section_spacing` text DEFAULT 'comfortable' NOT NULL,
	`primary_cta_href` text DEFAULT '/products' NOT NULL,
	`primary_cta_label_bn` text NOT NULL,
	`primary_cta_label_en` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `roshal_payment_settings` (
	`id` text PRIMARY KEY NOT NULL,
	`manual_review_notice_bn` text NOT NULL,
	`manual_review_notice_en` text NOT NULL,
	`support_message_bn` text NOT NULL,
	`support_message_en` text NOT NULL,
	`options_json` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `roshal_pages` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`navigation_label_bn` text NOT NULL,
	`navigation_label_en` text NOT NULL,
	`title_bn` text NOT NULL,
	`title_en` text NOT NULL,
	`description_bn` text,
	`description_en` text,
	`hero_image` text,
	`status` text DEFAULT 'published' NOT NULL,
	`show_in_navigation` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `roshal_pages_slug_unique` ON `roshal_pages` (`slug`);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `roshal_sections` (
	`id` text PRIMARY KEY NOT NULL,
	`page_id` text NOT NULL REFERENCES `roshal_pages`(`id`) ON DELETE cascade,
	`section_key` text NOT NULL,
	`type` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`layout` text DEFAULT 'stacked' NOT NULL,
	`variant` text DEFAULT 'default' NOT NULL,
	`is_enabled` integer DEFAULT true NOT NULL,
	`eyebrow_bn` text,
	`eyebrow_en` text,
	`title_bn` text,
	`title_en` text,
	`body_bn` text,
	`body_en` text,
	`cta_label_bn` text,
	`cta_label_en` text,
	`cta_href` text,
	`image_url` text,
	`items_json` text,
	`styles_json` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `roshal_products` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`sku` text NOT NULL,
	`name_bn` text NOT NULL,
	`name_en` text NOT NULL,
	`summary_bn` text NOT NULL,
	`summary_en` text NOT NULL,
	`description_bn` text NOT NULL,
	`description_en` text NOT NULL,
	`category_key` text NOT NULL,
	`category_label_bn` text NOT NULL,
	`category_label_en` text NOT NULL,
	`price` integer NOT NULL,
	`compare_at_price` integer,
	`inventory` integer DEFAULT 0 NOT NULL,
	`badge` text,
	`hero_image` text NOT NULL,
	`gallery_json` text,
	`features_bn_json` text,
	`features_en_json` text,
	`is_featured` integer DEFAULT false NOT NULL,
	`is_published` integer DEFAULT true NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `roshal_products_slug_unique` ON `roshal_products` (`slug`);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `roshal_products_sku_unique` ON `roshal_products` (`sku`);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `roshal_orders` (
	`id` text PRIMARY KEY NOT NULL,
	`order_number` text NOT NULL,
	`user_id` text REFERENCES `users`(`id`) ON DELETE set null,
	`status` text DEFAULT 'pending' NOT NULL,
	`payment_method` text NOT NULL,
	`payment_status` text DEFAULT 'pending' NOT NULL,
	`payment_provider` text,
	`gateway_transaction_id` text,
	`gateway_payment_type` text,
	`gateway_meta_json` text,
	`payment_reference` text,
	`payment_sender` text,
	`payment_proof_url` text,
	`tracking_note` text,
	`admin_review_note` text,
	`verified_at` integer,
	`subtotal` integer NOT NULL,
	`shipping_fee` integer DEFAULT 0 NOT NULL,
	`discount` integer DEFAULT 0 NOT NULL,
	`total` integer NOT NULL,
	`currency` text DEFAULT 'BDT' NOT NULL,
	`customer_name` text NOT NULL,
	`phone` text NOT NULL,
	`email` text,
	`address_line_1` text NOT NULL,
	`address_line_2` text,
	`city` text NOT NULL,
	`postal_code` text,
	`notes` text,
	`items_json` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `roshal_orders_order_number_unique` ON `roshal_orders` (`order_number`);
