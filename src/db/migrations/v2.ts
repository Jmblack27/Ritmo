import type * as SQLite from "expo-sqlite";

export async function migrateV2(db: SQLite.SQLiteDatabase) {
  const columns = await db.getAllAsync<{ name: string }>("PRAGMA table_info(habits)");
  const names = new Set(columns.map((column) => column.name));

  if (!names.has("schedule_days")) {
    await db.execAsync(`ALTER TABLE habits
      ADD COLUMN schedule_days TEXT NOT NULL DEFAULT '["mon","tue","wed","thu","fri","sat","sun"]'`);
  }

  if (!names.has("schedule_time")) {
    await db.execAsync(`ALTER TABLE habits
      ADD COLUMN schedule_time TEXT NOT NULL DEFAULT '09:00'`);
  }
}
