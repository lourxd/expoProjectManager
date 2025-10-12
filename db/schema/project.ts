import {sqliteTable, text, integer} from 'drizzle-orm/sqlite-core';

// Repurposing the users table for storing Expo projects
export const project = sqliteTable('project', {
  id: integer('id').primaryKey({autoIncrement: true}),
  name: text('name').notNull(), // Project name
  path: text('path').notNull().unique(), // Full path to project
  createdAt: integer('created_at', {mode: 'timestamp'}),
  updatedAt: integer('updated_at', {mode: 'timestamp'}),
});

export type Project = typeof project.$inferSelect;
export type InsertProject = typeof project.$inferInsert;
