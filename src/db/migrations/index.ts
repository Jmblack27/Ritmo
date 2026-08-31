import type * as SQLite from 'expo-sqlite';
import { migrateV1 } from './v1';

const DATABASE_VERSION = 1;

export async function runMigrations(
  db: SQLite.SQLiteDatabase,
) {
  const result = await db.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version',
  );

  const currentVersion = result?.user_version ?? 0;

  if (currentVersion < 1) {
    await migrateV1(db);

    await db.execAsync(
      `PRAGMA user_version = ${DATABASE_VERSION}`,
    );
  }
}