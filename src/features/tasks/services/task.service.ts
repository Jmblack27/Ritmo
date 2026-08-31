import * as taskRepository from '../repositories/task.repository';

import type {
  CreateTaskInput,
  UpdateTaskInput,
} from '../types/tasks.types';

export async function getTasks() {
  return taskRepository.findAll();
}

export async function getTask(id: string) {
  return taskRepository.findById(id);
}

export async function createTask(
  input: CreateTaskInput,
) {
  const title = input.title.trim();

  if (!title) {
    throw new Error('Task title is required');
  }

  return taskRepository.create({
    ...input,
    title,
  });
}

export async function updateTask(
  id: string,
  input: UpdateTaskInput,
) {
  if (input.title !== undefined) {
    const title = input.title.trim();

    if (!title) {
      throw new Error('Task title is required');
    }

    input = {
      ...input,
      title,
    };
  }

  return taskRepository.update(id, input);
}

export async function deleteTask(id: string) {
  return taskRepository.remove(id);
}

export async function completeTask(id: string) {
  return taskRepository.update(id, {
    completed: true,
  });
}

export async function uncompleteTask(id: string) {
  return taskRepository.update(id, {
    completed: false,
  });
}

export async function toggleTask(id: string) {
  return taskRepository.toggleCompleted(id);
}