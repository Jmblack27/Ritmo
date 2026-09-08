import type * as SQLite from 'expo-sqlite';
import { migrateV1 } from './v1';
import { migrateV2 } from './v2';
import { migrateV3 } from './v3';

const DATABASE_VERSION = 3;

export async function runMigrations(
  db: SQLite.SQLiteDatabase,
) {
  const result = await db.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version',
  );

  const currentVersion = result?.user_version ?? 0;

  if (currentVersion < 1) {
    await migrateV1(db);
  }

  if (currentVersion < 2) await migrateV2(db);
  if (currentVersion < 3) await migrateV3(db);

  if (currentVersion < DATABASE_VERSION) {
    await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
  }
}
