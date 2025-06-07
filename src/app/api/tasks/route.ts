import { NextResponse } from 'next/server';
import { Task, TaskStatus, TaskPriority } from '@/store/taskStore';

// In-memory storage for tasks
let tasks: Task[] = [
  {
    id: '1',
    title: 'Complete Project Setup',
    description: 'Set up the development environment and install dependencies',
    status: 'To Do' as TaskStatus,
    priority: 'High' as TaskPriority,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Implement Authentication',
    description: 'Add user authentication and authorization',
    status: 'In Progress' as TaskStatus,
    priority: 'Medium' as TaskPriority,
    createdAt: new Date().toISOString(),
  },
];

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
    };

    tasks.push(newTask);
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 400 }
    );
  }
} 