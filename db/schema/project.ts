import {sqliteTable, text, integer} from 'drizzle-orm/sqlite-core';

// Repurposing the users table for storing Expo projects
export const project = sqliteTable('project', {
  id: integer('id').primaryKey({autoIncrement: true}),
  folderName: text('folderName').notNull(),
  name: text('name'),
  slug: text('slug'),
  scheme: text('scheme'),
  path: text('path').notNull().unique(),
  usesNewArch: integer('uses_new_arch', {mode: 'boolean'}),
  iconPath: text('icon_path'),
  sdkVersion: text('sdk_version'),
  version: text('version'),
  projectSize: text('project_size'),
  folderSize: text('folder_size'),
  dependencies: text('dependencies'),
  devDependencies: text('dev_dependencies'),
  // App.json / Expo config fields
  orientation: text('orientation'),
  platforms: text('platforms'),
  backgroundColor: text('background_color'),
  primaryColor: text('primary_color'),
  bundleIdentifier: text('bundle_identifier'),
  androidPackage: text('android_package'),
  permissions: text('permissions'),
  splash: text('splash'),
  updates: text('updates'),
  plugins: text('plugins'),
  extra: text('extra'),
  createdAt: integer('created_at', {mode: 'timestamp'}),
  updatedAt: integer('updated_at', {mode: 'timestamp'}),
});

export type Project = typeof project.$inferSelect;
export type InsertProject = typeof project.$inferInsert;
