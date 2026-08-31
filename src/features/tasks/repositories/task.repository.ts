import { getDatabase } from '@/db/client';

import type {
  CreateTaskInput,
  Task,
  UpdateTaskInput,
} from '../types/tasks.types.js';

type TaskRow = {
  id: string;
  title: string;
  description: string | null;
  completed: number;
  due_date: string | null;
  created_at: number;
  updated_at: number;
};

function mapTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    completed: row.completed === 1,
    dueDate: row.due_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function findAll(): Promise<Task[]> {
  const db = await getDatabase();

  const rows = await db.getAllAsync<TaskRow>(`
    SELECT *
    FROM tasks
    ORDER BY created_at DESC
  `);

  return rows.map(mapTask);
}

export async function findById(
  id: string,
): Promise<Task | null> {
  const db = await getDatabase();

  const row = await db.getFirstAsync<TaskRow>(
    `
      SELECT *
      FROM tasks
      WHERE id = ?
    `,
    id,
  );

  return row ? mapTask(row) : null;
}

export async function create(
  input: CreateTaskInput,
): Promise<Task> {
  const db = await getDatabase();

  const id = crypto.randomUUID();
  const now = Date.now();

  await db.runAsync(
    `
      INSERT INTO tasks (
        id,
        title,
        description,
        completed,
        due_date,
        created_at,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    id,
    input.title,
    input.description ?? null,
    0,
    input.dueDate ?? null,
    now,
    now,
  );

  const task = await findById(id);

  if (!task) {
    throw new Error('Failed to create task');
  }

  return task;
}

export async function update(
  id: string,
  input: UpdateTaskInput,
): Promise<Task> {
  const db = await getDatabase();

  const currentTask = await findById(id);

  if (!currentTask) {
    throw new Error('Task not found');
  }

  const title = input.title ?? currentTask.title;

  const description =
    input.description !== undefined
      ? input.description
      : currentTask.description;

  const completed =
    input.completed !== undefined
      ? input.completed
      : currentTask.completed;

  const dueDate =
    input.dueDate !== undefined
      ? input.dueDate
      : currentTask.dueDate;

  await db.runAsync(
    `
      UPDATE tasks
      SET
        title = ?,
        description = ?,
        completed = ?,
        due_date = ?,
        updated_at = ?
      WHERE id = ?
    `,
    title,
    description,
    completed ? 1 : 0,
    dueDate,
    Date.now(),
    id,
  );

  const task = await findById(id);

  if (!task) {
    throw new Error('Failed to update task');
  }

  return task;
}

export async function remove(id: string): Promise<void> {
  const db = await getDatabase();

  const result = await db.runAsync(
    `
      DELETE FROM tasks
      WHERE id = ?
    `,
    id,
  );

  if (result.changes === 0) {
    throw new Error('Task not found');
  }
}

export async function toggleCompleted(
  id: string,
): Promise<Task> {
  const task = await findById(id);

  if (!task) {
    throw new Error('Task not found');
  }

  return update(id, {
    completed: !task.completed,
  });
}