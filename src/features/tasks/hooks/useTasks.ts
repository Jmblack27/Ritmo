import { useCallback, useEffect, useState } from 'react';

import * as taskService from '../services/task.service';

import type {
  CreateTaskInput,
  Task,
  UpdateTaskInput,
} from '../types/tasks.types';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await taskService.getTasks();

      setTasks(result);
    } catch (error) {
      setError(
        error instanceof Error
          ? error
          : new Error('Failed to load tasks'),
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(
    async (input: CreateTaskInput) => {
      const task = await taskService.createTask(input);

      setTasks((current) => [task, ...current]);

      return task;
    },
    [],
  );

  const updateTask = useCallback(
    async (id: string, input: UpdateTaskInput) => {
      const task = await taskService.updateTask(id, input);

      setTasks((current) =>
        current.map((item) =>
          item.id === id ? task : item,
        ),
      );

      return task;
    },
    [],
  );

  const deleteTask = useCallback(
    async (id: string) => {
      await taskService.deleteTask(id);

      setTasks((current) =>
        current.filter((task) => task.id !== id),
      );
    },
    [],
  );

  const toggleTask = useCallback(
    async (id: string) => {
      const task = await taskService.toggleTask(id);

      setTasks((current) =>
        current.map((item) =>
          item.id === id ? task : item,
        ),
      );

      return task;
    },
    [],
  );

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  return {
    tasks,
    loading,
    error,
    reload: loadTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
  };
}