import { NextResponse } from 'next/server';
import { Task, TaskStatus, TaskPriority } from '@/store/taskStore';
import { tasks, addTask } from './store';

// GET /api/tasks
export async function GET() {
  return NextResponse.json(tasks);
}

// POST /api/tasks
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newTask: Task = {
      id: Date.now().toString(),
      title: body.title,
      description: body.description,
      status: body.status || 'To Do',
      priority: body.priority || 'Medium',
      createdAt: new Date().toISOString(),
      dueDate: body.dueDate,
      assignee: body.assignee,
    };

    addTask(newTask);
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 400 }
    );
  }
} 