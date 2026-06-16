export type Priority = 'Low' | 'Medium' | 'High';
export type Category = 'Bug' | 'Feature' | 'Enhancement';
export type Status = 'todo' | 'inprogress' | 'done';

export interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'doc' | 'pdf' | 'other';
  url?: string;
  size: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  category: Category;
  status: Status;
  attachments: Attachment[];
  createdAt: string;
  updatedAt: string;
  assignee?: string;
  dueDate?: string;
}

export interface Column {
  id: Status;
  title: string;
  tasks: Task[];
}

export interface BoardState {
  columns: Record<Status, Column>;
}

export interface TaskFormData {
  title: string;
  description: string;
  priority: Priority;
  category: Category;
  status: Status;
  dueDate?: string;
  assignee?: string;
}

export interface AnalyticsData {
  name: string;
  value: number;
  color: string;
}

// Socket.IO ready service interface (for future integration)
export interface BoardService {
  getTasks: () => Task[];
  createTask: (data: TaskFormData) => Task;
  updateTask: (id: string, data: Partial<TaskFormData>) => Task;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, newStatus: Status) => void;
  onTaskUpdate?: (callback: (tasks: Task[]) => void) => void;
  offTaskUpdate?: () => void;
}
