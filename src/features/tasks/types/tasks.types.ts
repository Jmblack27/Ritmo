export type Task = {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  dueDate: string | null;
  createdAt: number;
  updatedAt: number;
};

export type CreateTaskInput = {
  title: string;
  description?: string;
  dueDate?: string;
};

export type UpdateTaskInput = {
  title?: string;
  description?: string | null;
  completed?: boolean;
  dueDate?: string | null;
};