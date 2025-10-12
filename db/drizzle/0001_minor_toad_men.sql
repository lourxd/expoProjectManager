PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_project` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`folderName` text NOT NULL,
	`name` text,
	`slug` text,
	`scheme` text,
	`path` text NOT NULL,
	`uses_new_arch` integer,
	`icon_path` text,
	`sdk_version` text,
	`version` text,
	`size` text,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
INSERT INTO `__new_project`("id", "folderName", "name", "slug", "scheme", "path", "uses_new_arch", "icon_path", "sdk_version", "version", "size", "created_at", "updated_at") SELECT "id", "folderName", "name", "slug", "scheme", "path", "uses_new_arch", "icon_path", "sdk_version", "version", "size", "created_at", "updated_at" FROM `project`;--> statement-breakpoint
DROP TABLE `project`;--> statement-breakpoint
ALTER TABLE `__new_project` RENAME TO `project`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `project_path_unique` ON `project` (`path`);