import * as habitRepository from "../repositories/habit.repository";
import type { CreateHabitInput, UpdateHabitInput } from "../types/habits.types";

export function getHabits() { return habitRepository.findAll(); }
export function getHabit(id: string) { return habitRepository.findById(id); }

export function createHabit(input: CreateHabitInput) {
  const name = input.name.trim();
  if (!name) throw new Error("Habit name is required");
  return habitRepository.create({
    ...input,
    name,
    description: input.description?.trim() || undefined,
  });
}

export function updateHabit(id: string, input: UpdateHabitInput) {
  if (input.name !== undefined && !input.name.trim()) {
    throw new Error("Habit name is required");
  }
  return habitRepository.update(id, {
    ...input,
    name: input.name?.trim(),
    description:
      input.description !== undefined ? input.description?.trim() || null : undefined,
  });
}

export function deleteHabit(id: string) { return habitRepository.remove(id); }
export function toggleHabitToday(id: string) { return habitRepository.toggleToday(id); }
