import * as SQLite from 'expo-sqlite';
import { runMigrations } from './migrations';

const DATABASE_NAME = 'ritmo.db';

let database: SQLite.SQLiteDatabase | null = null;

export async function getDatabase() {
  if (!database) {
    // Android can retain a stale native SQLite handle after Fast Refresh.
    // A fresh connection keeps the next JS runtime from reusing that handle.
    database = await SQLite.openDatabaseAsync(DATABASE_NAME, {
      useNewConnection: true,
    });
    await database.execAsync('PRAGMA foreign_keys = ON');
    await runMigrations(database);
  }

  return database;
} 