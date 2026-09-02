export type HabitFrequency = "daily" | "weekdays" | "weekends";

export type Habit = {
  id: string;
  name: string;
  description: string | null;
  frequency: HabitFrequency;
  completedToday: boolean;
  streak: number;
  createdAt: number;
  updatedAt: number;
};

export type CreateHabitInput = {
  name: string;
  description?: string;
  frequency: HabitFrequency;
};

export type UpdateHabitInput = {
  name?: string;
  description?: string | null;
  frequency?: HabitFrequency;
};
