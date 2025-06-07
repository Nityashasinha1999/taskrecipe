'use client';

import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task, useTaskStore } from '../store/taskStore';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import TaskForm from './TaskForm';

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, isDragging }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { deleteTask, updateTask } = useTaskStore();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'task',
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging || isSortableDragging ? 0.5 : 1,
  };

  const handleDelete = () => {
    deleteTask(task.id);
    setShowDeleteConfirm(false);
  };

  const handleStatusChange = (newStatus: Task['status']) => {
    updateTask(task.id, { status: newStatus });
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'High':
        return 'bg-red-500';
      case 'Medium':
        return 'bg-yellow-500';
      case 'Low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'Done':
        return 'bg-green-900/50 text-green-300';
      case 'In Progress':
        return 'bg-blue-900/50 text-blue-300';
      case 'To Do':
        return 'bg-slate-800 text-slate-300';
      default:
        return 'bg-slate-800 text-slate-300';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  if (isEditing) {
    return <TaskForm task={task} onClose={() => setIsEditing(false)} />;
  }

  return (
    <>
      <Card
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="p-4 hover:shadow-md transition-shadow select-none bg-slate-800 border-slate-700 cursor-grab active:cursor-grabbing"
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-white">{task.title}</h3>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              className="bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteConfirm(true);
              }}
              className="bg-slate-800 border-red-600 text-red-400 hover:bg-red-900/50 hover:text-red-300"
            >
              Delete
            </Button>
          </div>
        </div>
        <p className="text-slate-300 mb-3">{task.description}</p>
        <div className="flex flex-wrap gap-2">
          <Badge className={getStatusColor(task.status)}>
            {task.status}
          </Badge>
          <Badge className={getPriorityColor(task.priority)}>
            {task.priority}
          </Badge>
          {task.assignee && (
            <Badge variant="outline" className="border-slate-600 text-slate-300">
              Assigned to: {task.assignee}
            </Badge>
          )}
          {task.dueDate && (
            <Badge variant="outline" className="border-slate-600 text-slate-300">
              Due: {formatDate(task.dueDate)}
            </Badge>
          )}
        </div>
      </Card>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 max-w-sm w-full border border-slate-700">
            <h3 className="text-lg font-semibold mb-2 text-white">Delete Task</h3>
            <p className="text-slate-300 mb-4">
              Are you sure you want to delete this task? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                className="text-sm bg-slate-800 border border-slate-700 rounded-md text-white flex items-center justify-between hover:bg-slate-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="bg-red-900/50 text-red-300 hover:bg-red-900"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskCard; 