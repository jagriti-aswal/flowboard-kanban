# FlowBoard — Collaborative Kanban Board

A production-quality SaaS-style Kanban board built with React, TypeScript, Vite, Tailwind CSS, @hello-pangea/dnd, and Recharts.

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 18.3 | UI framework |
| TypeScript | 5.4 | Type safety |
| Vite | 5.3 | Build tool & dev server |
| Tailwind CSS | 3.4 | Styling (zero CSS files) |
| @hello-pangea/dnd | 16.6 | Drag & drop |
| Recharts | 2.12 | Analytics charts |
| Lucide React | 0.383 | Icons |

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Type check
npm run type-check

# Production build
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── Navbar.tsx          # Top nav with search, filters, user info
│   ├── Column.tsx          # Droppable Kanban column
│   ├── TaskCard.tsx        # Draggable task card with all metadata
│   ├── TaskModal.tsx       # Create / Edit modal with validation
│   └── AnalyticsChart.tsx  # Recharts dashboard (Bar/Pie/Radial)
├── pages/
│   └── BoardPage.tsx       # Main page, DragDropContext, layout
├── hooks/
│   ├── useBoard.ts         # Core board state + CRUD operations
│   └── useFilters.ts       # Search + priority/category filtering
├── services/
│   └── boardService.ts     # Data layer (Socket.IO-ready interface)
├── types/
│   └── index.ts            # All TypeScript interfaces
├── App.tsx
├── main.tsx
└── index.css               # Tailwind directives + base reset
```

## Features

### Board
- **3 columns**: To Do / In Progress / Done
- **Drag & drop** between columns via @hello-pangea/dnd
- **Real-time analytics** that update on every state change

### Task Cards
- Title, description, priority badge, category tag
- Assignee avatar, due date, attachment previews
- Context menu: Edit / Delete

### Filters
- Full-text search across title + description
- Filter by priority: High / Medium / Low
- Filter by category: Bug / Feature / Enhancement
- One-click clear all filters

### Analytics Sidebar
- Bar chart: tasks by status
- Pie chart: tasks by category
- Radial chart: status distribution
- Completion rate progress bar
- High-priority alert strip

## Socket.IO Integration Guide

The architecture is pre-wired for real-time collaboration. To add Socket.IO:

1. **Install**: `npm install socket.io-client`

2. **Update `boardService.ts`**:
```ts
import { io } from 'socket.io-client';
const socket = io('http://your-server');

// Replace notify() calls with socket.emit()
socket.emit('task:create', newTask);

// Replace subscriber pattern with socket.on()
onTaskUpdate: (callback) => {
  socket.on('task:update', callback);
},
offTaskUpdate: () => {
  socket.off('task:update');
},
```

3. **No changes needed** to hooks, components, or pages — the `BoardService` interface is the only contract.

## Design System

| Token | Value | Usage |
|---|---|---|
| `slate-950` | `#020617` | Page background |
| `slate-900` | `#0f172a` | Surface / sidebar |
| `slate-800` | `#1e293b` | Cards |
| `indigo-600` | `#4f46e5` | Primary accent |
| `amber-400` | `#fbbf24` | In Progress |
| `emerald-400` | `#34d399` | Done / success |
| `red-400` | `#f87171` | High priority / bugs |
