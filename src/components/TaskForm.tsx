'use client'
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTaskStore, TaskStatus, TaskPriority } from '../store/taskStore';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { X } from 'lucide-react';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  status: z.enum(['To Do', 'In Progress', 'Done'] as const, {
    required_error: 'Status is required',
  }),
  priority: z.enum(['High', 'Medium', 'Low'] as const, {
    required_error: 'Priority is required',
  }),
  dueDate: z.string().optional(),
  assignee: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  onClose: () => void;
  task?: {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate?: string;
    assignee?: string;
  };
}

const TaskForm: React.FC<TaskFormProps> = ({ onClose, task }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      status: task?.status || 'To Do',
      priority: task?.priority || 'Medium',
      dueDate: task?.dueDate || '',
      assignee: task?.assignee || '',
    },
  });

  const onSubmit = async (data: TaskFormData) => {
    try {
      if (task) {
        useTaskStore.getState().updateTask(task.id, data);
      } else {
        useTaskStore.getState().addTask({
          ...data,
          createdAt: new Date().toISOString(),
        });
      }
      reset();
      onClose();
    } catch (error) {
      console.error('Failed to save task:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">
            {task ? 'Edit Task' : 'Create New Task'}
          </h2>
          <Button
            onClick={onClose}
            className="text-slate-400 hover:text-white"
            variant="ghost"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-white">
              Title <span className="text-red-500">*</span>
            </label>
            <Input
              id="title"
              {...register('title')}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="Enter task title"
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-white">
              Description <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="description"
              {...register('description')}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="Enter task description"
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium text-white">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              id="status"
              {...register('status')}
              className="w-full rounded-md bg-slate-700 border-slate-600 text-white px-3 py-2 hover:bg-slate-600"
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
            {errors.status && (
              <p className="text-sm text-red-500">{errors.status.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="priority" className="text-sm font-medium text-white">
              Priority <span className="text-red-500">*</span>
            </label>
            <select
              id="priority"
              {...register('priority')}
              className="w-full rounded-md bg-slate-700 border-slate-600 text-white px-3 py-2 hover:bg-slate-600"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            {errors.priority && (
              <p className="text-sm text-red-500">{errors.priority.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="dueDate" className="text-sm font-medium text-white">
              Due Date
            </label>
            <Input
              id="dueDate"
              type="date"
              {...register('dueDate')}
              className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="assignee" className="text-sm font-medium text-white">
              Assignee
            </label>
            <Input
              id="assignee"
              {...register('assignee')}
              className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
              placeholder="Enter assignee name"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-slate-600 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              {task ? 'Update Task' : 'Create Task'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm; 