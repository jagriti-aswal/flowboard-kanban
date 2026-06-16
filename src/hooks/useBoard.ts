import { useState, useEffect, useCallback } from 'react';
import { Task, TaskFormData, Status } from '../types';
import { boardService } from '../services/boardService';

export const useBoard = () => {
  const [tasks, setTasks] = useState<Task[]>(() => boardService.getTasks());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Subscribe to updates (Socket.IO-ready)
    boardService.onTaskUpdate?.(setTasks);
    return () => {
      boardService.offTaskUpdate?.();
    };
  }, []);

  const getTasksByStatus = useCallback(
    (status: Status) => tasks.filter(t => t.status === status),
    [tasks]
  );

  const createTask = useCallback(async (data: TaskFormData) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 400)); // Simulated network delay
    boardService.createTask(data);
    setTasks(boardService.getTasks());
    setIsLoading(false);
  }, []);

  const updateTask = useCallback(async (id: string, data: Partial<TaskFormData>) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 300));
    boardService.updateTask(id, data);
    setTasks(boardService.getTasks());
    setIsLoading(false);
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    boardService.deleteTask(id);
    setTasks(boardService.getTasks());
  }, []);

  const moveTask = useCallback((taskId: string, newStatus: Status) => {
    boardService.moveTask(taskId, newStatus);
    setTasks(boardService.getTasks());
  }, []);

  const analytics = {
    todo: tasks.filter(t => t.status === 'todo').length,
    inprogress: tasks.filter(t => t.status === 'inprogress').length,
    done: tasks.filter(t => t.status === 'done').length,
    total: tasks.length,
    highPriority: tasks.filter(t => t.priority === 'High').length,
    byCategory: {
      Bug: tasks.filter(t => t.category === 'Bug').length,
      Feature: tasks.filter(t => t.category === 'Feature').length,
      Enhancement: tasks.filter(t => t.category === 'Enhancement').length,
    },
  };

  return {
    tasks,
    isLoading,
    getTasksByStatus,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    analytics,
  };
};
