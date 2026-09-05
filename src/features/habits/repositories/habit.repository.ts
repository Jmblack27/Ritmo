import { getDatabase } from "@/db/client";
import * as Crypto from "expo-crypto";
import { isScheduledToday } from "../lib/schedule";

import { WEEKDAYS } from "../types/habits.types";
import type {
  CreateHabitInput,
  Habit,
  HabitFrequency,
  UpdateHabitInput,
  Weekday,
} from "../types/habits.types";

type HabitRow = {
  id: string;
  name: string;
  description: string | null;
  frequency: HabitFrequency;
  schedule_days: string;
  schedule_time: string;
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

function parseScheduleDays(value: string, frequency: HabitFrequency): Weekday[] {
  try {
    const parsed: unknown = JSON.parse(value);
    if (Array.isArray(parsed)) {
      const days = parsed.filter((day): day is Weekday =>
        WEEKDAYS.includes(day as Weekday),
      );
      if (days.length) return days;
    }
  } catch {}

  if (frequency === "weekdays") return WEEKDAYS.slice(0, 5);
  if (frequency === "weekends") return WEEKDAYS.slice(5);
  return [...WEEKDAYS];
}

function weekdayForDate(date: Date): Weekday {
  return WEEKDAYS[(date.getDay() + 6) % 7];
}

function calculateStreak(completions: CompletionRow[], scheduleDays: Weekday[]): number {
  if (completions.length === 0) return 0;

  const dates = new Set(completions.map((item) => item.date));
  const scheduled = new Set(scheduleDays);
  const cursor = new Date();

  let streak = 0;
  let checkedScheduledDays = 0;
  while (checkedScheduledDays < 3660) {
    if (scheduled.has(weekdayForDate(cursor))) {
      checkedScheduledDays += 1;
      if (!dates.has(getLocalDateKey(cursor))) {
        if (streak > 0 || getLocalDateKey(cursor) !== getLocalDateKey()) break;
      } else {
        streak += 1;
      }
    }
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

  const scheduleDays = parseScheduleDays(row.schedule_days, row.frequency);

  return {
    id: row.id,
    name: row.name,
    description: row.description,
    frequency: row.frequency,
    scheduleDays,
    scheduleTime: row.schedule_time,
    completedToday: row.completed_today === 1,
    streak: calculateStreak(completions, scheduleDays),
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
    `INSERT INTO habits (
       id, name, description, frequency, schedule_days, schedule_time, created_at, updated_at
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    id,
    input.name,
    input.description ?? null,
    frequencyForDays(input.scheduleDays),
    JSON.stringify(input.scheduleDays),
    input.scheduleTime,
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
    `UPDATE habits SET
       name = ?, description = ?, frequency = ?, schedule_days = ?, schedule_time = ?, updated_at = ?
     WHERE id = ?`,
    input.name ?? current.name,
    input.description !== undefined ? input.description : current.description,
    frequencyForDays(input.scheduleDays ?? current.scheduleDays),
    JSON.stringify(input.scheduleDays ?? current.scheduleDays),
    input.scheduleTime ?? current.scheduleTime,
    Date.now(),
    id,
  );
  const habit = await findById(id);
  if (!habit) throw new Error("Failed to update habit");
  return habit;
}

function frequencyForDays(days: Weekday[]): HabitFrequency {
  const key = days.join(",");
  if (key === WEEKDAYS.slice(0, 5).join(",")) return "weekdays";
  if (key === WEEKDAYS.slice(5).join(",")) return "weekends";
  return "daily";
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
  if (!isScheduledToday(habit.scheduleDays)) {
    throw new Error("This habit is not scheduled for today");
  }
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
