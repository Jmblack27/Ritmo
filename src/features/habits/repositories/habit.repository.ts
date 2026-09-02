import { getDatabase } from "@/db/client";
import * as Crypto from "expo-crypto";

import type {
  CreateHabitInput,
  Habit,
  HabitFrequency,
  UpdateHabitInput,
} from "../types/habits.types";

type HabitRow = {
  id: string;
  name: string;
  description: string | null;
  frequency: HabitFrequency;
  completed_today: number;
  created_at: number;
  updated_at: number;
};

type CompletionRow = { date: string };

function getLocalDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function calculateStreak(completions: CompletionRow[]): number {
  if (completions.length === 0) return 0;

  const dates = new Set(completions.map((item) => item.date));
  const cursor = new Date();
  const today = getLocalDateKey(cursor);

  if (!dates.has(today)) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;
  while (dates.has(getLocalDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

async function mapHabit(row: HabitRow): Promise<Habit> {
  const db = await getDatabase();
  const completions = await db.getAllAsync<CompletionRow>(
    `SELECT date FROM habit_completions
     WHERE habit_id = ? AND completed = 1
     ORDER BY date DESC`,
    row.id,
  );

  return {
    id: row.id,
    name: row.name,
    description: row.description,
    frequency: row.frequency,
    completedToday: row.completed_today === 1,
    streak: calculateStreak(completions),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const selectHabit = `
  SELECT h.*,
    CASE WHEN hc.id IS NULL THEN 0 ELSE 1 END AS completed_today
  FROM habits h
  LEFT JOIN habit_completions hc
    ON hc.habit_id = h.id AND hc.date = ? AND hc.completed = 1
`;

export async function findAll(): Promise<Habit[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<HabitRow>(
    `${selectHabit} ORDER BY h.created_at DESC`,
    getLocalDateKey(),
  );
  return Promise.all(rows.map(mapHabit));
}

export async function findById(id: string): Promise<Habit | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<HabitRow>(
    `${selectHabit} WHERE h.id = ?`,
    getLocalDateKey(),
    id,
  );
  return row ? mapHabit(row) : null;
}

export async function create(input: CreateHabitInput): Promise<Habit> {
  const db = await getDatabase();
  const id = Crypto.randomUUID();
  const now = Date.now();
  await db.runAsync(
    `INSERT INTO habits (id, name, description, frequency, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    id,
    input.name,
    input.description ?? null,
    input.frequency,
    now,
    now,
  );
  const habit = await findById(id);
  if (!habit) throw new Error("Failed to create habit");
  return habit;
}

export async function update(id: string, input: UpdateHabitInput): Promise<Habit> {
  const db = await getDatabase();
  const current = await findById(id);
  if (!current) throw new Error("Habit not found");
  await db.runAsync(
    `UPDATE habits SET name = ?, description = ?, frequency = ?, updated_at = ? WHERE id = ?`,
    input.name ?? current.name,
    input.description !== undefined ? input.description : current.description,
    input.frequency ?? current.frequency,
    Date.now(),
    id,
  );
  const habit = await findById(id);
  if (!habit) throw new Error("Failed to update habit");
  return habit;
}

export async function remove(id: string): Promise<void> {
  const db = await getDatabase();
  const result = await db.runAsync("DELETE FROM habits WHERE id = ?", id);
  if (result.changes === 0) throw new Error("Habit not found");
}

export async function toggleToday(id: string): Promise<Habit> {
  const db = await getDatabase();
  const habit = await findById(id);
  if (!habit) throw new Error("Habit not found");
  const today = getLocalDateKey();

  if (habit.completedToday) {
    await db.runAsync(
      "DELETE FROM habit_completions WHERE habit_id = ? AND date = ?",
      id,
      today,
    );
  } else {
    await db.runAsync(
      `INSERT INTO habit_completions (id, habit_id, date, completed, created_at)
       VALUES (?, ?, ?, 1, ?)`,
      Crypto.randomUUID(),
      id,
      today,
      Date.now(),
    );
  }

  const updated = await findById(id);
  if (!updated) throw new Error("Failed to update habit completion");
  return updated;
}
