import { useState, useMemo } from 'react';
import { Task, Priority, Category } from '../types';

export interface FilterState {
  search: string;
  priority: Priority | 'All';
  category: Category | 'All';
}

export const useFilters = (tasks: Task[]) => {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    priority: 'All',
    category: 'All',
  });

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchSearch =
        !filters.search ||
        task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.description.toLowerCase().includes(filters.search.toLowerCase());

      const matchPriority =
        filters.priority === 'All' || task.priority === filters.priority;

      const matchCategory =
        filters.category === 'All' || task.category === filters.category;

      return matchSearch && matchPriority && matchCategory;
    });
  }, [tasks, filters]);

  const setSearch = (search: string) =>
    setFilters(f => ({ ...f, search }));

  const setPriority = (priority: Priority | 'All') =>
    setFilters(f => ({ ...f, priority }));

  const setCategory = (category: Category | 'All') =>
    setFilters(f => ({ ...f, category }));

  const clearFilters = () =>
    setFilters({ search: '', priority: 'All', category: 'All' });

  const hasActiveFilters =
    filters.search !== '' ||
    filters.priority !== 'All' ||
    filters.category !== 'All';

  return {
    filters,
    filteredTasks,
    setSearch,
    setPriority,
    setCategory,
    clearFilters,
    hasActiveFilters,
  };
};
