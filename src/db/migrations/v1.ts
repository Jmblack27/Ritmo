import type * as SQLite from 'expo-sqlite';

const tasksSchema = `
  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    completed INTEGER NOT NULL DEFAULT 0,
    due_date TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_tasks_completed
  ON tasks(completed);

  CREATE INDEX IF NOT EXISTS idx_tasks_due_date
  ON tasks(due_date);
`;

const habitsSchema = `
  CREATE TABLE IF NOT EXISTS habits (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    frequency TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );
`;

const habitCompletionsSchema = `
  CREATE TABLE IF NOT EXISTS habit_completions (
    id TEXT PRIMARY KEY NOT NULL,
    habit_id TEXT NOT NULL,
    date TEXT NOT NULL,
    completed INTEGER NOT NULL DEFAULT 1,
    created_at INTEGER NOT NULL,

    FOREIGN KEY (habit_id)
      REFERENCES habits(id)
      ON DELETE CASCADE
  );

  CREATE UNIQUE INDEX IF NOT EXISTS idx_habit_completion_date
  ON habit_completions(habit_id, date);
`;

export async function migrateV1(
  db: SQLite.SQLiteDatabase,
) {
  await db.execAsync(`
    PRAGMA foreign_keys = ON;

    ${tasksSchema}

    ${habitsSchema}

    ${habitCompletionsSchema}
  `);
}