import {migrate} from 'drizzle-orm/expo-sqlite/migrator';
import {drizzle} from 'drizzle-orm/expo-sqlite';
import {openDatabaseSync} from 'expo-sqlite';
import {project} from './schema/project';
import migrations from './drizzle/migrations';
import type {Project} from './schema/project';

export const $ = {
  project,
};

// Open database
const expo = openDatabaseSync('expoManager.db');

export const db = drizzle(expo, {
  schema: $,
  logger: false,
});

export const runMigrations = async () => {
  try {
    console.log('Running migrations');
    await migrate(db, migrations);
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  }
};

export type {Project};
