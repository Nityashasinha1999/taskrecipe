import { Task } from '@/store/taskStore';

// Shared in-memory storage for tasks
export let tasks: Task[] = [];

// Helper functions
export function getTask(id: string) {
  return tasks.find(t => t.id === id);
}

export function getTaskIndex(id: string) {
  return tasks.findIndex(t => t.id === id);
}

export function addTask(task: Task) {
  tasks.push(task);
}

export function updateTask(index: number, task: Task) {
  tasks[index] = task;
}

export function deleteTask(index: number) {
  tasks.splice(index, 1);
} 