import { NextResponse } from 'next/server';
import { Task, TaskStatus, TaskPriority } from '@/store/taskStore';
import { tasks, getTask, getTaskIndex, updateTask, deleteTask } from '../store';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const task = getTask(params.id);
  if (!task) {
    return NextResponse.json(
      { error: 'Task not found' },
      { status: 404 }
    );
  }
  return NextResponse.json(task);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const taskIndex = getTaskIndex(params.id);

    if (taskIndex === -1) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    const updatedTask: Task = {
      ...tasks[taskIndex],
      ...body,
    };

    updateTask(taskIndex, updatedTask);
    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const taskIndex = getTaskIndex(params.id);
  if (taskIndex === -1) {
    return NextResponse.json(
      { error: 'Task not found' },
      { status: 404 }
    );
  }

  deleteTask(taskIndex);
  return NextResponse.json({ message: 'Task deleted successfully' });
} 