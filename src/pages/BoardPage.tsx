import React, { useState, useCallback } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { Task, Status } from '../types';
import { useBoard } from '../hooks/useBoard';
import { useFilters } from '../hooks/useFilters';
import Navbar from '../components/Navbar';
import Column from '../components/Column';
import TaskModal from '../components/TaskModal';
import AnalyticsChart from '../components/AnalyticsChart';
import { BarChart2, ChevronLeft, ChevronRight } from 'lucide-react';

const COLUMNS: Status[] = ['todo', 'inprogress', 'done'];

const BoardPage: React.FC = () => {
  const { tasks, isLoading, createTask, updateTask, deleteTask, moveTask, analytics } =
  useBoard();

  const { filters, filteredTasks, setSearch, setPriority, setCategory, clearFilters, hasActiveFilters } =
    useFilters(tasks);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<Status>('todo');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      const { destination, source, draggableId } = result;
      if (!destination) return;
      if (destination.droppableId === source.droppableId && destination.index === source.index) return;
      moveTask(draggableId, destination.droppableId as Status);
    },
    [moveTask]
  );

  const openCreateModal = (status: Status = 'todo') => {
    setModalMode('create');
    setEditingTask(null);
    setDefaultStatus(status);
    setModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setModalMode('edit');
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleModalSubmit = async (data: import('../types').TaskFormData) => {
    if (modalMode === 'create') {
      await createTask(data);
    } else if (editingTask) {
      await updateTask(editingTask.id, data);
    }
    setModalOpen(false);
  };

  const getFilteredByStatus = (status: Status) =>
    filteredTasks.filter(t => t.status === status);

  return (
    <div className="flex flex-col h-screen bg-slate-950 overflow-hidden">
      <Navbar
        filters={filters}
        onSearchChange={setSearch}
        onPriorityChange={setPriority}
        onCategoryChange={setCategory}
        onClearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
        onCreateTask={() => openCreateModal()}
        totalTasks={analytics.total}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Main board area */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 min-h-full" style={{ minWidth: 0 }}>
              {COLUMNS.map(status => (
                <Column
                  key={status}
                  status={status}
                  tasks={getFilteredByStatus(status)}
                  onEditTask={openEditModal}
                  onDeleteTask={deleteTask}
                  onCreateTask={openCreateModal}
                  isFiltered={hasActiveFilters}
                />
              ))}
            </div>
          </DragDropContext>
        </main>

        {/* Analytics sidebar */}
        <aside
          className={`hidden lg:flex flex-col transition-all duration-300 ease-in-out border-l border-slate-800 bg-slate-900/50 ${
            sidebarOpen ? 'w-80' : 'w-12'
          }`}
        >
          {/* Sidebar toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center justify-center h-10 text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors border-b border-slate-800 flex-shrink-0"
            title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {sidebarOpen ? (
              <div className="flex items-center gap-2 px-3 w-full">
                <BarChart2 className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs font-semibold text-slate-400 flex-1">Analytics</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>

          {sidebarOpen && (
            <div className="flex-1 overflow-y-auto p-4">
              <AnalyticsChart analytics={analytics} />
            </div>
          )}
        </aside>
      </div>

      {/* Mobile analytics strip */}
      <div className="lg:hidden border-t border-slate-800 bg-slate-900/80 p-4">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-slate-400 font-semibold">Sprint Overview</span>
          <span className="text-slate-500">{analytics.total} total tasks</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'To Do', value: analytics.todo, color: 'text-slate-300', bar: 'bg-slate-500' },
            { label: 'In Progress', value: analytics.inprogress, color: 'text-amber-400', bar: 'bg-amber-500' },
            { label: 'Done', value: analytics.done, color: 'text-emerald-400', bar: 'bg-emerald-500' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-slate-500">{stat.label}</div>
              <div className="mt-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${stat.bar} rounded-full transition-all duration-500`}
                  style={{ width: analytics.total ? `${(stat.value / analytics.total) * 100}%` : '0%' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={modalOpen}
        mode={modalMode}
        task={editingTask}
        defaultStatus={defaultStatus}
        isLoading={isLoading}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
};

export default BoardPage;
