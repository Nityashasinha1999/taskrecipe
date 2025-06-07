'use client'

import React from 'react';
import { Input } from './ui/input';
import { Select } from './ui/select';
import { Button } from './ui/button';
import { TaskStatus, TaskPriority } from '../store/taskStore';

interface TaskFiltersProps {
  searchQuery: string;
  statusFilter: TaskStatus | 'All';
  priorityFilter: TaskPriority | 'All';
  sortBy: 'title' | 'priority' | 'dueDate';
  sortOrder: 'asc' | 'desc';
  onSearchChange: (value: string) => void;
  onStatusChange: (value: TaskStatus | 'All') => void;
  onPriorityChange: (value: TaskPriority | 'All') => void;
  onSortChange: (field: 'title' | 'priority' | 'dueDate') => void;
  onSortOrderChange: (order: 'asc' | 'desc') => void;
  onClearFilters: () => void;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
  searchQuery,
  statusFilter,
  priorityFilter,
  sortBy,
  sortOrder,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onSortChange,
  onSortOrderChange,
  onClearFilters,
}) => {
  const statusOptions = [
    { value: 'All', label: 'All Status' },
    { value: 'To Do', label: 'To Do' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Done', label: 'Done' },
  ];

  const priorityOptions = [
    { value: 'All', label: 'All Priority' },
    { value: 'High', label: 'High' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Low', label: 'Low' },
  ];

  const sortOptions = [
    { value: 'title', label: 'Title' },
    { value: 'priority', label: 'Priority' },
    { value: 'dueDate', label: 'Due Date' },
  ];

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1 bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
        />
        
        <Select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value as TaskStatus | 'All')}
          options={statusOptions}
          className="w-full md:w-48"
        />
        
        <Select
          value={priorityFilter}
          onChange={(e) => onPriorityChange(e.target.value as TaskPriority | 'All')}
          options={priorityOptions}
          className="w-full md:w-48"
        />
        
        <Select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as 'title' | 'priority' | 'dueDate')}
          options={sortOptions}
          className="w-full md:w-48"
        />

        <Button
          onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
          className="bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
        >
          {sortOrder === 'asc' ? '↑' : '↓'}
        </Button>
        
        <Button
          onClick={onClearFilters}
          className="bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
};

export default TaskFilters; 