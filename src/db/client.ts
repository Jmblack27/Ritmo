import * as SQLite from 'expo-sqlite';
import { runMigrations } from './migrations';

const DATABASE_NAME = 'ritmo.db';

let database: SQLite.SQLiteDatabase | null = null;

export async function getDatabase() {
  if (!database) {
    database = await SQLite.openDatabaseAsync(DATABASE_NAME);
    await database.execAsync('PRAGMA foreign_keys = ON');
    await runMigrations(database);
  }

  return database;
} 