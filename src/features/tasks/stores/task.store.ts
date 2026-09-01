import { create } from 'zustand';

import * as taskService from '../services/task.service';

import type {
  CreateTaskInput,
  Task,
  UpdateTaskInput,
} from '../types/tasks.types';

type TaskState = {
  tasks: Task[];
  isLoading: boolean;
  error: Error | null;

  loadTasks: () => Promise<void>;
  createTask: (input: CreateTaskInput) => Promise<Task>;
  updateTask: (
    id: string,
    input: UpdateTaskInput,
  ) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  toggleTask: (id: string) => Promise<Task>;
};

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  isLoading: true,
  error: null,

  loadTasks: async () => {
    try {
      set({
        isLoading: true,
        error: null,
      });

      const tasks = await taskService.getTasks();

      set({
        tasks,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error
            : new Error('Failed to load tasks'),
      });
    } finally {
      set({
        isLoading: false,
      });
    }
  },

  createTask: async (input) => {
    try {
      set({
        error: null,
      });

      const task = await taskService.createTask(input);

      set((state) => ({
        tasks: [task, ...state.tasks],
      }));

      return task;
    } catch (error) {
      const normalizedError =
        error instanceof Error
          ? error
          : new Error('Failed to create task');

      set({
        error: normalizedError,
      });

      throw normalizedError;
    }
  },

  updateTask: async (id, input) => {
    try {
      set({
        error: null,
      });

      const task = await taskService.updateTask(id, input);

      set((state) => ({
        tasks: state.tasks.map((item) =>
          item.id === id ? task : item,
        ),
      }));

      return task;
    } catch (error) {
      const normalizedError =
        error instanceof Error
          ? error
          : new Error('Failed to update task');

      set({
        error: normalizedError,
      });

      throw normalizedError;
    }
  },

  deleteTask: async (id) => {
    try {
      set({
        error: null,
      });

      await taskService.deleteTask(id);

      set((state) => ({
        tasks: state.tasks.filter(
          (task) => task.id !== id,
        ),
      }));
    } catch (error) {
      const normalizedError =
        error instanceof Error
          ? error
          : new Error('Failed to delete task');

      set({
        error: normalizedError,
      });

      throw normalizedError;
    }
  },

  toggleTask: async (id) => {
    try {
      set({
        error: null,
      });

      const task = await taskService.toggleTask(id);

      set((state) => ({
        tasks: state.tasks.map((item) =>
          item.id === id ? task : item,
        ),
      }));

      return task;
    } catch (error) {
      const normalizedError =
        error instanceof Error
          ? error
          : new Error('Failed to toggle task');

      set({
        error: normalizedError,
      });

      throw normalizedError;
    }
  },
}));

