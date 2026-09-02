import { create } from "zustand";
import * as habitService from "../services/habit.service";
import type { CreateHabitInput, Habit, UpdateHabitInput } from "../types/habits.types";

type HabitState = {
  habits: Habit[];
  isLoading: boolean;
  error: Error | null;
  loadHabits: () => Promise<void>;
  createHabit: (input: CreateHabitInput) => Promise<Habit>;
  updateHabit: (id: string, input: UpdateHabitInput) => Promise<Habit>;
  deleteHabit: (id: string) => Promise<void>;
  toggleHabit: (id: string) => Promise<Habit>;
};

function normalizeError(error: unknown, fallback: string) {
  return error instanceof Error ? error : new Error(fallback);
}

export const useHabitStore = create<HabitState>((set) => ({
  habits: [],
  isLoading: true,
  error: null,
  loadHabits: async () => {
    try {
      set({ isLoading: true, error: null });
      set({ habits: await habitService.getHabits() });
    } catch (error) {
      set({ error: normalizeError(error, "Failed to load habits") });
    } finally {
      set({ isLoading: false });
    }
  },
  createHabit: async (input) => {
    try {
      set({ error: null });
      const habit = await habitService.createHabit(input);
      set((state) => ({ habits: [habit, ...state.habits] }));
      return habit;
    } catch (error) {
      const normalized = normalizeError(error, "Failed to create habit");
      set({ error: normalized });
      throw normalized;
    }
  },
  updateHabit: async (id, input) => {
    try {
      set({ error: null });
      const habit = await habitService.updateHabit(id, input);
      set((state) => ({ habits: state.habits.map((item) => item.id === id ? habit : item) }));
      return habit;
    } catch (error) {
      const normalized = normalizeError(error, "Failed to update habit");
      set({ error: normalized });
      throw normalized;
    }
  },
  deleteHabit: async (id) => {
    try {
      set({ error: null });
      await habitService.deleteHabit(id);
      set((state) => ({ habits: state.habits.filter((item) => item.id !== id) }));
    } catch (error) {
      const normalized = normalizeError(error, "Failed to delete habit");
      set({ error: normalized });
      throw normalized;
    }
  },
  toggleHabit: async (id) => {
    try {
      set({ error: null });
      const habit = await habitService.toggleHabitToday(id);
      set((state) => ({ habits: state.habits.map((item) => item.id === id ? habit : item) }));
      return habit;
    } catch (error) {
      const normalized = normalizeError(error, "Failed to update habit");
      set({ error: normalized });
      throw normalized;
    }
  },
}));
