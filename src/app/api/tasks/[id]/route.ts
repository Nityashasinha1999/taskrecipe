import { NextResponse } from 'next/server';
import { Task, TaskStatus, TaskPriority } from '@/store/taskStore';

let tasks: Task[] = [
  {
    id: '1',
    title: 'Complete Project Setup',
    description: 'Set up the development environment and install dependencies',
    status: 'To Do' as TaskStatus,
    priority: 'High' as TaskPriority,
    assignee: 'John Doe',
    createdAt: ''
  },
  {
    id: '2',
    title: 'Implement Authentication',
    description: 'Add user authentication and authorization',
    status: 'In Progress' as TaskStatus,
    priority: 'Medium' as TaskPriority,
    assignee: 'John Doe',
    createdAt: ''
  },
];

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const task = tasks.find((t) => t.id === params.id);
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
    const taskIndex = tasks.findIndex((t) => t.id === params.id);

    if (taskIndex === -1) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    const updatedTask: Task = {
      ...tasks[taskIndex],
      title: body.title || tasks[taskIndex].title,
      description: body.description || tasks[taskIndex].description,
      status: body.status || tasks[taskIndex].status,
      priority: body.priority || tasks[taskIndex].priority,
    };

    tasks[taskIndex] = updatedTask;
    return NextResponse.json(updatedTask);
  } catch (error) {
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
  const taskIndex = tasks.findIndex((t) => t.id === params.id);
  if (taskIndex === -1) {
    return NextResponse.json(
      { error: 'Task not found' },
      { status: 404 }
    );
  }

  tasks.splice(taskIndex, 1);
  return NextResponse.json({ message: 'Task deleted successfully' });
} 