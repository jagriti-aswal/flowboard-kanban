import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  RadialBarChart,
  RadialBar,
} from 'recharts';
import { BarChart2, PieChart as PieIcon, Activity, TrendingUp, CheckCircle2, Clock, Circle, Flame } from 'lucide-react';

interface AnalyticsChartProps {
  analytics: {
    todo: number;
    inprogress: number;
    done: number;
    total: number;
    highPriority: number;
    byCategory: { Bug: number; Feature: number; Enhancement: number };
  };
}

type ChartView = 'bar' | 'pie' | 'radial';

const STATUS_COLORS = {
  todo: '#64748b',
  inprogress: '#f59e0b',
  done: '#10b981',
};

const CATEGORY_COLORS = ['#ef4444', '#6366f1', '#06b6d4'];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name?: string; fill?: string }>; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 shadow-xl">
      {label && <p className="text-xs text-slate-400 mb-1">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} className="text-sm font-semibold" style={{ color: p.fill || '#fff' }}>
          {p.name || ''} {p.value} tasks
        </p>
      ))}
    </div>
  );
};

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ analytics }) => {
  const [view, setView] = useState<ChartView>('bar');

  const statusData = [
    { name: 'To Do', value: analytics.todo, color: STATUS_COLORS.todo, fill: STATUS_COLORS.todo },
    { name: 'In Progress', value: analytics.inprogress, color: STATUS_COLORS.inprogress, fill: STATUS_COLORS.inprogress },
    { name: 'Done', value: analytics.done, color: STATUS_COLORS.done, fill: STATUS_COLORS.done },
  ];

  const categoryData = [
    { name: 'Bugs', value: analytics.byCategory.Bug, fill: CATEGORY_COLORS[0] },
    { name: 'Features', value: analytics.byCategory.Feature, fill: CATEGORY_COLORS[1] },
    { name: 'Enhancements', value: analytics.byCategory.Enhancement, fill: CATEGORY_COLORS[2] },
  ];

  const completionRate = analytics.total > 0
    ? Math.round((analytics.done / analytics.total) * 100)
    : 0;

  const views: { id: ChartView; icon: React.ReactNode; label: string }[] = [
    { id: 'bar', icon: <BarChart2 className="w-3.5 h-3.5" />, label: 'Bar' },
    { id: 'pie', icon: <PieIcon className="w-3.5 h-3.5" />, label: 'Pie' },
    { id: 'radial', icon: <Activity className="w-3.5 h-3.5" />, label: 'Radial' },
  ];

  return (
    <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-bold text-slate-200">Sprint Analytics</h3>
          <p className="text-xs text-slate-500 mt-0.5">Live board metrics</p>
        </div>
        <div className="flex items-center gap-1 bg-slate-900/60 rounded-xl p-1 border border-slate-700/50">
          {views.map(v => (
            <button
              key={v.id}
              onClick={() => setView(v.id)}
              className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                view === v.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {v.icon}
              <span className="hidden sm:block">{v.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-2 mb-5">
        {[
          { label: 'Total', value: analytics.total, icon: <TrendingUp className="w-3.5 h-3.5" />, color: 'text-slate-300', bg: 'bg-slate-700/50' },
          { label: 'To Do', value: analytics.todo, icon: <Circle className="w-3.5 h-3.5" />, color: 'text-slate-400', bg: 'bg-slate-700/30' },
          { label: 'In Progress', value: analytics.inprogress, icon: <Clock className="w-3.5 h-3.5" />, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Done', value: analytics.done, icon: <CheckCircle2 className="w-3.5 h-3.5" />, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        ].map(stat => (
          <div key={stat.label} className={`${stat.bg} rounded-xl p-2.5 text-center`}>
            <div className={`flex items-center justify-center gap-1 ${stat.color} mb-1`}>
              {stat.icon}
            </div>
            <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-slate-500 mt-0.5 truncate">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Completion rate */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span>Completion rate</span>
          </div>
          <span className="text-xs font-bold text-emerald-400">{completionRate}%</span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      {/* Chart */}
      <div className="h-44">
        {view === 'bar' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barSize={28}>
              <XAxis
                dataKey="name"
                tick={{ fill: '#64748b', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#475569', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.08)' }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {statusData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}

        {view === 'pie' && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={68}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span style={{ color: '#94a3b8', fontSize: '11px' }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        )}

        {view === 'radial' && (
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="55%"
              innerRadius="30%"
              outerRadius="90%"
              data={statusData}
              startAngle={90}
              endAngle={-270}
            >
              <RadialBar
                dataKey="value"
                cornerRadius={6}
                background={{ fill: '#1e293b' }}
              >
                {statusData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </RadialBar>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span style={{ color: '#94a3b8', fontSize: '11px' }}>{value}</span>
                )}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* High priority alert */}
      {analytics.highPriority > 0 && (
        <div className="mt-4 flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
          <Flame className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
          <p className="text-xs text-red-300">
            <span className="font-bold">{analytics.highPriority}</span> high priority {analytics.highPriority === 1 ? 'task needs' : 'tasks need'} attention
          </p>
        </div>
      )}
    </div>
  );
};

export default AnalyticsChart;
