import React from 'react';
import { Search, Plus, Bell, ChevronDown, Zap } from 'lucide-react';
import { Priority, Category } from '../types';
import { FilterState } from '../hooks/useFilters';
import { useAuth } from '../context/AuthContext';
interface NavbarProps {
  filters: FilterState;
  onSearchChange: (val: string) => void;
  onPriorityChange: (val: Priority | 'All') => void;
  onCategoryChange: (val: Category | 'All') => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  onCreateTask: () => void;
  totalTasks: number;
}

const Navbar: React.FC<NavbarProps> = ({
  filters,
  onSearchChange,
  onPriorityChange,
  onCategoryChange,
  onClearFilters,
  hasActiveFilters,
  onCreateTask,
  totalTasks,
}) => {
  const { logout, user } = useAuth();
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 md:px-6 h-14 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" fill="currentColor" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">FlowBoard</span>
          </div>
          <div className="hidden md:flex items-center gap-1 ml-4">
            <span className="text-slate-500 text-sm">/</span>
            <span className="text-slate-300 text-sm font-medium ml-1">Engineering Sprint</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 ml-0.5" />
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{totalTasks} tasks</span>
          </div>

          <button className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
            <Bell className="w-4.5 h-4.5" size={18} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
          </button>

          <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 cursor-pointer hover:border-slate-600 transition-colors">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
              {user?.name?.slice(0, 2).toUpperCase() || 'U'}
            </div>
            <span className="hidden md:block text-sm text-slate-300 font-medium">
              {user?.name || 'User'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </div>


          <button
            onClick={logout}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Logout
          </button>
          <button
            onClick={onCreateTask}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-lg shadow-indigo-900/40"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:block">New Task</span>
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2 px-4 md:px-6 py-2.5">
        {/* Search */}
        <div className="relative flex-1 min-w-48 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search tasks…"
            value={filters.search}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm placeholder-slate-500 rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition-colors"
          />
        </div>

        {/* Priority filter */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-slate-500 font-medium hidden sm:block">Priority:</span>
          <div className="flex items-center gap-1">
            {(['All', 'High', 'Medium', 'Low'] as const).map(p => (
              <button
                key={p}
                onClick={() => onPriorityChange(p)}
                className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
                  filters.priority === p
                    ? p === 'High'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                      : p === 'Medium'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      : p === 'Low'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-slate-700 text-slate-200 border border-slate-600'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-slate-500 font-medium hidden sm:block">Category:</span>
          <div className="flex items-center gap-1">
            {(['All', 'Bug', 'Feature', 'Enhancement'] as const).map(c => (
              <button
                key={c}
                onClick={() => onCategoryChange(c)}
                className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
                  filters.category === c
                    ? c === 'Bug'
                      ? 'bg-red-500/15 text-red-300 border border-red-500/30'
                      : c === 'Feature'
                      ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                      : c === 'Enhancement'
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                      : 'bg-slate-700 text-slate-200 border border-slate-600'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors ml-auto"
          >
            Clear filters ×
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
