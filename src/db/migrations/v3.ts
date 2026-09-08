import type * as SQLite from "expo-sqlite";

export async function migrateV3(db: SQLite.SQLiteDatabase) {
  await db.execAsync(
    "CREATE TABLE IF NOT EXISTS daily_quote_cache (" +
      "date TEXT PRIMARY KEY NOT NULL, " +
      "quote TEXT NOT NULL, " +
      "author TEXT NOT NULL, " +
      "fetched_at INTEGER NOT NULL" +
    ")",
  );
}
