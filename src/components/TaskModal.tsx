import React, { useState, useEffect, useRef } from 'react';
import { X, Loader2, AlertTriangle, Zap, TrendingUp } from 'lucide-react';
import { Task, TaskFormData, Priority, Category, Status } from '../types';

interface TaskModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  task?: Task | null;
  defaultStatus?: Status;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => void;
}

const priorityOptions: Priority[] = ['High', 'Medium', 'Low'];
const categoryOptions: Category[] = ['Bug', 'Feature', 'Enhancement'];
const statusOptions: { value: Status; label: string }[] = [
  { value: 'todo', label: 'To Do' },
  { value: 'inprogress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

const priorityStyles: Record<Priority, string> = {
  High: 'border-red-500/50 bg-red-500/10 text-red-400',
  Medium: 'border-amber-500/50 bg-amber-500/10 text-amber-400',
  Low: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400',
};

const priorityIcons: Record<Priority, React.ReactNode> = {
  High: <AlertTriangle className="w-3.5 h-3.5" />,
  Medium: <Zap className="w-3.5 h-3.5" />,
  Low: <TrendingUp className="w-3.5 h-3.5" />,
};

const defaultForm: TaskFormData = {
  title: '',
  description: '',
  priority: 'Medium',
  category: 'Feature',
  status: 'todo',
  dueDate: '',
  assignee: '',
};

const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  mode,
  task,
  defaultStatus,
  isLoading,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState<TaskFormData>(defaultForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    if (mode === 'edit' && task) {
      setForm({
        title: task.title,
        description: task.description,
        priority: task.priority,
        category: task.category,
        status: task.status,
        dueDate: task.dueDate || '',
        assignee: task.assignee || '',
      });
    } else {
      setForm({ ...defaultForm, status: defaultStatus || 'todo' });
    }
    setErrors({});
    setTimeout(() => titleRef.current?.focus(), 100);
  }, [isOpen, mode, task, defaultStatus]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (form.title.trim().length < 3) newErrors.title = 'Title must be at least 3 characters';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  };

  const setField = <K extends keyof TaskFormData>(key: K, value: TaskFormData[K]) => {
    setForm(f => ({ ...f, [key]: value }));
    if (errors[key]) setErrors(e => ({ ...e, [key]: '' }));
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl shadow-black/60 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/95 backdrop-blur-sm rounded-t-2xl">
          <div>
            <h2 className="text-base font-bold text-white">
              {mode === 'create' ? 'Create new task' : 'Edit task'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {mode === 'create' ? 'Add a new task to your board' : 'Update task details'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              ref={titleRef}
              type="text"
              value={form.title}
              onChange={e => setField('title', e.target.value)}
              placeholder="What needs to be done?"
              className={`w-full bg-slate-800 border text-slate-100 text-sm placeholder-slate-500 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 transition-colors ${
                errors.title
                  ? 'border-red-500 focus:ring-red-500/30'
                  : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/30'
              }`}
            />
            {errors.title && (
              <p className="text-xs text-red-400 mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={e => setField('description', e.target.value)}
              placeholder="Describe the task in detail…"
              rows={3}
              className={`w-full bg-slate-800 border text-slate-100 text-sm placeholder-slate-500 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 transition-colors resize-none ${
                errors.description
                  ? 'border-red-500 focus:ring-red-500/30'
                  : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/30'
              }`}
            />
            {errors.description && (
              <p className="text-xs text-red-400 mt-1">{errors.description}</p>
            )}
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
              Priority
            </label>
            <div className="flex gap-2">
              {priorityOptions.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setField('priority', p)}
                  className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-xl border transition-all ${
                    form.priority === p
                      ? priorityStyles[p]
                      : 'border-slate-700 text-slate-500 hover:border-slate-600 hover:text-slate-300'
                  }`}
                >
                  {priorityIcons[p]}
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
              Category
            </label>
            <div className="flex gap-2">
              {categoryOptions.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setField('category', c)}
                  className={`flex-1 text-xs font-semibold py-2 rounded-xl border transition-all ${
                    form.category === c
                      ? c === 'Bug'
                        ? 'border-red-500/50 bg-red-500/10 text-red-400'
                        : c === 'Feature'
                        ? 'border-indigo-500/50 bg-indigo-500/10 text-indigo-400'
                        : 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400'
                      : 'border-slate-700 text-slate-500 hover:border-slate-600 hover:text-slate-300'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Status
            </label>
            <select
              value={form.status}
              onChange={e => setField('status', e.target.value as Status)}
              className="w-full bg-slate-800 border border-slate-700 text-slate-100 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-colors appearance-none"
            >
              {statusOptions.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Row: Assignee + Due Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Assignee
              </label>
              <input
                type="text"
                value={form.assignee || ''}
                onChange={e => setField('assignee', e.target.value)}
                placeholder="e.g. Sarah K."
                className="w-full bg-slate-800 border border-slate-700 text-slate-100 text-sm placeholder-slate-500 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Due Date
              </label>
              <input
                type="date"
                value={form.dueDate || ''}
                onChange={e => setField('dueDate', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-slate-100 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-colors [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold py-2.5 rounded-xl border border-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-xl transition-colors shadow-lg shadow-indigo-900/40"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {mode === 'create' ? 'Creating…' : 'Saving…'}
                </>
              ) : (
                mode === 'create' ? 'Create task' : 'Save changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
