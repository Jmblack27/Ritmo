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