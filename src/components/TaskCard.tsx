import React, { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Task, Priority, Category } from '../types';
import {
  MoreHorizontal,
  Paperclip,
  Edit3,
  Trash2,
  Calendar,
  AlertTriangle,
  Zap,
  TrendingUp,
} from 'lucide-react';

interface TaskCardProps {
  task: Task;
  index: number;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const priorityConfig: Record<Priority, { label: string; classes: string; icon: React.ReactNode; dot: string }> = {
  High: {
    label: 'High',
    classes: 'bg-red-500/15 text-red-400 border border-red-500/30',
    icon: <AlertTriangle className="w-3 h-3" />,
    dot: 'bg-red-400',
  },
  Medium: {
    label: 'Medium',
    classes: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    icon: <Zap className="w-3 h-3" />,
    dot: 'bg-amber-400',
  },
  Low: {
    label: 'Low',
    classes: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    icon: <TrendingUp className="w-3 h-3" />,
    dot: 'bg-emerald-400',
  },
};

const categoryConfig: Record<Category, { classes: string }> = {
  Bug: { classes: 'bg-red-900/40 text-red-300 border border-red-800/50' },
  Feature: { classes: 'bg-indigo-900/40 text-indigo-300 border border-indigo-800/50' },
  Enhancement: { classes: 'bg-cyan-900/40 text-cyan-300 border border-cyan-800/50' },
};

const attachmentIcon = (type: string) => {
  if (type === 'image') return '🖼️';
  if (type === 'pdf') return '📄';
  if (type === 'doc') return '📝';
  return '📎';
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const TaskCard: React.FC<TaskCardProps> = ({ task, index, onEdit, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const priority = priorityConfig[task.priority];
  const category = categoryConfig[task.category];

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`group relative rounded-xl border p-4 cursor-grab active:cursor-grabbing transition-all duration-200 ${
            snapshot.isDragging
              ? 'bg-slate-700 border-indigo-500/60 shadow-2xl shadow-indigo-900/50 rotate-1 scale-105'
              : 'bg-slate-800 border-slate-700/60 hover:border-slate-600 hover:shadow-lg hover:shadow-black/30 hover:-translate-y-0.5'
          }`}
        >
          {/* Priority glow indicator */}
          <div
            className={`absolute top-0 left-0 w-1 h-full rounded-l-xl ${priority.dot} opacity-70`}
          />

          {/* Header row */}
          <div className="flex items-start justify-between gap-2 mb-2.5 pl-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <span
                className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${priority.classes}`}
              >
                {priority.icon}
                {priority.label}
              </span>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${category.classes}`}
              >
                {task.category}
              </span>
            </div>

            {/* Menu button */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                onBlur={() => setTimeout(() => setMenuOpen(false), 150)}
                className="p-1 text-slate-500 hover:text-slate-300 hover:bg-slate-700 rounded-md transition-colors opacity-0 group-hover:opacity-100"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-7 z-20 bg-slate-800 border border-slate-700 rounded-xl shadow-xl shadow-black/50 overflow-hidden w-36">
                  <button
                    onClick={() => { onEdit(task); setMenuOpen(false); }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit task
                  </button>
                  <button
                    onClick={() => { onDelete(task.id); setMenuOpen(false); }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete task
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <h3 className="text-sm font-semibold text-slate-100 leading-snug mb-1.5 pl-2 line-clamp-2">
            {task.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-3 pl-2">
            {task.description}
          </p>

          {/* Attachments */}
          {task.attachments.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3 pl-2">
              {task.attachments.map(att => (
                <div
                  key={att.id}
                  className="flex items-center gap-1 text-xs text-slate-400 bg-slate-700/60 border border-slate-700 px-2 py-1 rounded-md"
                >
                  <span className="text-xs">{attachmentIcon(att.type)}</span>
                  <span className="max-w-20 truncate">{att.name}</span>
                  <Paperclip className="w-2.5 h-2.5 text-slate-500 flex-shrink-0" />
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pl-2 pt-2 border-t border-slate-700/50">
            <div className="flex items-center gap-2">
              {task.assignee && (
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                    {task.assignee.charAt(0)}
                  </div>
                  <span className="hidden sm:block truncate max-w-16">{task.assignee}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {task.dueDate && (
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(task.dueDate)}</span>
                </div>
              )}
              {task.attachments.length > 0 && (
                <div className="flex items-center gap-0.5 text-xs text-slate-500">
                  <Paperclip className="w-3 h-3" />
                  <span>{task.attachments.length}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
