'use client';

import React, { useState, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  useSensor,
  useSensors,
  PointerSensor,
  DragOverEvent,
  UniqueIdentifier,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { useTaskStore, Task, TaskStatus, TaskPriority } from '../store/taskStore';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import TaskFilters from './TaskFilters';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import Link from 'next/link';

interface StatusColumnProps {
  status: TaskStatus;
  tasks: Task[];
  getStatusColor: (status: TaskStatus) => string;
  getStatusTextColor: (status: TaskStatus) => string;
}

const StatusColumn: React.FC<StatusColumnProps> = ({
  status,
  tasks,
  getStatusColor,
  getStatusTextColor,
}) => {
  const { setNodeRef } = useDroppable({
    id: `status-${status}`,
    data: {
      status,
    },
  });

  return (
    <Card className={getStatusColor(status)}>
      <CardHeader>
        <CardTitle className={getStatusTextColor(status)}>
          {status}
          <span className="ml-2 text-sm font-normal text-slate-400">
            ({tasks.length})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={setNodeRef} className="min-h-[200px]">
          <SortableContext
            items={tasks.map((task) => task.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </SortableContext>
        </div>
      </CardContent>
    </Card>
  );
};

type SortField = 'title' | 'priority' | 'dueDate';
type SortOrder = 'asc' | 'desc';

const TaskColumn: React.FC<{ status: TaskStatus; tasks: Task[] }> = ({ status, tasks }) => {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <div 
      ref={setNodeRef}
      className="bg-slate-800 rounded-lg p-4 min-h-[200px]"
    >
      <h2 className="text-lg font-semibold text-white mb-4">{status}</h2>
      <div className="space-y-4">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

const TaskBoard: React.FC = () => {
  const tasks = useTaskStore((state) => state.tasks);
  const isLoading = useTaskStore((state) => state.isLoading);
  const error = useTaskStore((state) => state.error);
  const fetchTasks = useTaskStore((state) => state.fetchTasks);
  const reorderTasks = useTaskStore((state) => state.reorderTasks);
  const updateTask = useTaskStore((state) => state.updateTask);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'All'>('All');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'All'>('All');
  const [sortField, setSortField] = useState<SortField>('title');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortTasks = (tasks: Task[]) => {
    return [...tasks].sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'priority':
          const priorityOrder = { High: 3, Medium: 2, Low: 1 };
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case 'dueDate':
          if (a.dueDate && b.dueDate) {
            comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          } else if (a.dueDate) {
            comparison = -1;
          } else if (b.dueDate) {
            comparison = 1;
          }
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = (task.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (task.description?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const sortedTasks = sortTasks(filteredTasks);

  const groupedTasks = sortedTasks.reduce((acc, task) => {
    if (!acc[task.status]) {
      acc[task.status] = [];
    }
    acc[task.status].push(task);
    return acc;
  }, {} as Record<TaskStatus, Task[]>);

  const statuses: TaskStatus[] = ['To Do', 'In Progress', 'Done'];

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setPriorityFilter('All');
    setSortField('title');
    setSortOrder('asc');
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    const task = tasks.find(t => t.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over) {
      const task = tasks.find(t => t.id === active.id);
      
      if (task) {
        // If dropping on a column
        if (statuses.includes(over.id as TaskStatus)) {
          updateTask(task.id, { status: over.id as TaskStatus });
        }
        // If dropping on another task
        else {
          const overTask = tasks.find(t => t.id === over.id);
          if (overTask) {
            updateTask(task.id, { status: overTask.status });
          }
        }
      }
    }
    
    setActiveId(null);
    setActiveTask(null);
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'To Do':
        return 'bg-slate-800 border-slate-700';
      case 'In Progress':
        return 'bg-slate-800 border-slate-700';
      case 'Done':
        return 'bg-slate-800 border-slate-700';
      default:
        return 'bg-slate-800 border-slate-700';
    }
  };

  const getStatusTextColor = (status: TaskStatus) => {
    switch (status) {
      case 'To Do':
        return 'text-blue-400';
      case 'In Progress':
        return 'text-yellow-400';
      case 'Done':
        return 'text-green-400';
      default:
        return 'text-slate-400';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-white">Loading tasks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className='bg-slate-900'>
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-white">Task Board</h1>
            <div className="flex items-center gap-2">
              <span className="text-slate-300">Want to try some recipes?</span>
              <Link href="/recipes">
                <Button 
                  className="bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                >
                  Go to Recipes
                </Button>
              </Link>
            </div>
          </div>
          <Button 
            onClick={() => setIsCreating(true)}
            className="bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
          >
            Create Task
          </Button>
        </div>

        <TaskFilters
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          priorityFilter={priorityFilter}
          sortBy={sortField}
          sortOrder={sortOrder}
          onSearchChange={setSearchQuery}
          onStatusChange={setStatusFilter}
          onPriorityChange={setPriorityFilter}
          onSortChange={handleSort}
          onSortOrderChange={setSortOrder}
          onClearFilters={clearFilters}
        />

        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {statuses.map((status) => (
              <TaskColumn
                key={status}
                status={status}
                tasks={groupedTasks[status] || []}
              />
            ))}
          </div>

          <DragOverlay>
            {activeTask ? (
              <div className="opacity-50">
                <TaskCard task={activeTask} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        {isCreating && <TaskForm onClose={() => setIsCreating(false)} />}
      </div>
    </div>
  );
};

export default TaskBoard;