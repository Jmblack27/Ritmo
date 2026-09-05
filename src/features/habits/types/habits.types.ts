export type HabitFrequency = "daily" | "weekdays" | "weekends";
export type Weekday = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export const WEEKDAYS: readonly Weekday[] = [
  "mon", "tue", "wed", "thu", "fri", "sat", "sun",
];

export type Habit = {
  id: string;
  name: string;
  description: string | null;
  frequency: HabitFrequency;
  scheduleDays: Weekday[];
  scheduleTime: string;
  completedToday: boolean;
  streak: number;
  createdAt: number;
  updatedAt: number;
};

export type CreateHabitInput = {
  name: string;
  description?: string;
  scheduleDays: Weekday[];
  scheduleTime: string;
};

export type UpdateHabitInput = {
  name?: string;
  description?: string | null;
  scheduleDays?: Weekday[];
  scheduleTime?: string;
};
