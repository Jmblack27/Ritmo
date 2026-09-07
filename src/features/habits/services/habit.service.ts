import * as habitRepository from "../repositories/habit.repository";
import type { CreateHabitInput, UpdateHabitInput } from "../types/habits.types";
import * as habitNotifications from "./habit-notification.service";

export function getHabits() { return habitRepository.findAll(); }
export function getHabit(id: string) { return habitRepository.findById(id); }

export async function createHabit(input: CreateHabitInput) {
  const name = input.name.trim();
  if (!name) throw new Error("Habit name is required");
  if (!input.scheduleDays.length) throw new Error("Select at least one day");
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(input.scheduleTime)) {
    throw new Error("Select a valid time");
  }
  const habit = await habitRepository.create({
    ...input,
    name,
    description: input.description?.trim() || undefined,
  });
  await habitNotifications.scheduleHabitNotifications(habit);
  return habit;
}

export async function updateHabit(id: string, input: UpdateHabitInput) {
  if (input.name !== undefined && !input.name.trim()) {
    throw new Error("Habit name is required");
  }
  if (input.scheduleDays !== undefined && !input.scheduleDays.length) {
    throw new Error("Select at least one day");
  }
  if (input.scheduleTime !== undefined && !/^([01]\d|2[0-3]):[0-5]\d$/.test(input.scheduleTime)) {
    throw new Error("Select a valid time");
  }
  const habit = await habitRepository.update(id, {
    ...input,
    name: input.name?.trim(),
    description:
      input.description !== undefined ? input.description?.trim() || null : undefined,
  });
  await habitNotifications.scheduleHabitNotifications(habit);
  return habit;
}

export async function deleteHabit(id: string) {
  await habitNotifications.cancelHabitNotifications(id);
  return habitRepository.remove(id);
}
export function toggleHabitToday(id: string) { return habitRepository.toggleToday(id); }
