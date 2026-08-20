CREATE TABLE `habit_categories` (
	`id` text PRIMARY KEY,
	`name` text NOT NULL,
	`position` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `habit_completions` (
	`id` text PRIMARY KEY,
	`habit_id` text NOT NULL,
	`date` text NOT NULL,
	`completed` integer DEFAULT true NOT NULL,
	CONSTRAINT `fk_habit_completions_habit_id_habits_id_fk` FOREIGN KEY (`habit_id`) REFERENCES `habits`(`id`)
);
--> statement-breakpoint
CREATE TABLE `habits` (
	`id` text PRIMARY KEY,
	`category_id` text NOT NULL,
	`title` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	CONSTRAINT `fk_habits_category_id_habit_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `habit_categories`(`id`)
);
--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` text PRIMARY KEY,
	`title` text NOT NULL,
	`completed` integer DEFAULT false NOT NULL,
	`priority` text DEFAULT 'medium' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
