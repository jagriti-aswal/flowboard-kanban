import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Task, Status } from '../types';
import TaskCard from './TaskCard';
import { Plus, CheckCircle2, Clock, Circle } from 'lucide-react';

interface ColumnProps {
  status: Status;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onCreateTask: (status: Status) => void;
  isFiltered: boolean;
}

const columnConfig: Record<Status, {
  title: string;
  icon: React.ReactNode;
  accentClass: string;
  headerBg: string;
  countBg: string;
  dropBg: string;
  emptyIcon: string;
}> = {
  todo: {
    title: 'To Do',
    icon: <Circle className="w-4 h-4 text-slate-400" />,
    accentClass: 'border-t-slate-500',
    headerBg: 'bg-slate-800/60',
    countBg: 'bg-slate-700 text-slate-300',
    dropBg: 'bg-slate-800/30 border-slate-600/40',
    emptyIcon: '📋',
  },
  inprogress: {
    title: 'In Progress',
    icon: <Clock className="w-4 h-4 text-amber-400" />,
    accentClass: 'border-t-amber-500',
    headerBg: 'bg-amber-500/5',
    countBg: 'bg-amber-500/20 text-amber-400',
    dropBg: 'bg-amber-500/5 border-amber-600/20',
    emptyIcon: '⚡',
  },
  done: {
    title: 'Done',
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
    accentClass: 'border-t-emerald-500',
    headerBg: 'bg-emerald-500/5',
    countBg: 'bg-emerald-500/20 text-emerald-400',
    dropBg: 'bg-emerald-500/5 border-emerald-600/20',
    emptyIcon: '✅',
  },
};

const Column: React.FC<ColumnProps> = ({
  status,
  tasks,
  onEditTask,
  onDeleteTask,
  onCreateTask,
  isFiltered,
}) => {
  const config = columnConfig[status];

  return (
    <div className="flex flex-col min-w-0 flex-1">
      {/* Column header */}
      <div className={`flex items-center justify-between px-4 py-3 rounded-t-xl border-t-2 ${config.accentClass} ${config.headerBg} border border-b-0 border-slate-700/50`}>
        <div className="flex items-center gap-2">
          {config.icon}
          <h2 className="text-sm font-bold text-slate-200 tracking-wide">{config.title}</h2>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full min-w-5 text-center ${config.countBg}`}>
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => onCreateTask(status)}
          className="p-1 text-slate-500 hover:text-slate-200 hover:bg-slate-700 rounded-lg transition-colors"
          title={`Add to ${config.title}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Droppable area */}
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 rounded-b-xl border border-t-0 border-slate-700/50 transition-colors duration-200 ${
              snapshot.isDraggingOver
                ? `${config.dropBg} border-dashed`
                : 'bg-slate-800/20'
            }`}
          >
            <div className="p-2 flex flex-col gap-2 min-h-64">
              {tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                  <div className="text-3xl mb-3 opacity-40">{config.emptyIcon}</div>
                  <p className="text-sm font-medium text-slate-500">
                    {isFiltered
                      ? 'No matching tasks'
                      : `No ${config.title.toLowerCase()} tasks`}
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    {isFiltered
                      ? 'Try adjusting your filters'
                      : 'Drag tasks here or click +'}
                  </p>
                  {!isFiltered && (
                    <button
                      onClick={() => onCreateTask(status)}
                      className="mt-4 text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add task
                    </button>
                  )}
                </div>
              ) : (
                tasks.map((task, index) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    index={index}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                  />
                ))
              )}
              {provided.placeholder}
            </div>
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;
