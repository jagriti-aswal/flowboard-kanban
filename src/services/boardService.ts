import { Task, TaskFormData, Status, BoardService } from '../types';
import { socket } from "./socket";
const generateId = () => `task_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

const now = new Date().toISOString();
const yesterday = new Date(Date.now() - 86400000).toISOString();
const twoDaysAgo = new Date(Date.now() - 172800000).toISOString();

const INITIAL_TASKS: Task[] = [
  {
    id: 'task_001',
    title: 'Fix authentication race condition',
    description: 'Users occasionally get logged out mid-session due to a token refresh race condition in the auth middleware. Needs immediate investigation.',
    priority: 'High',
    category: 'Bug',
    status: 'todo',
    attachments: [
      { id: 'att_001', name: 'error-logs.pdf', type: 'pdf', size: '124 KB' },
    ],
    createdAt: twoDaysAgo,
    updatedAt: twoDaysAgo,
    assignee: 'Sarah K.',
    dueDate: '2025-01-20',
  },
  {
    id: 'task_002',
    title: 'Design new onboarding flow',
    description: 'Redesign the onboarding experience to improve activation rate. Research shows users drop off at step 3 consistently.',
    priority: 'Medium',
    category: 'Feature',
    status: 'todo',
    attachments: [
      { id: 'att_002', name: 'wireframes.png', type: 'image', size: '2.1 MB' },
      { id: 'att_003', name: 'user-research.doc', type: 'doc', size: '890 KB' },
    ],
    createdAt: yesterday,
    updatedAt: yesterday,
    assignee: 'Mike T.',
    dueDate: '2025-01-28',
  },
  {
    id: 'task_003',
    title: 'Optimize database query performance',
    description: 'The dashboard loads slowly due to N+1 queries in the reporting module. Target < 200ms response time.',
    priority: 'High',
    category: 'Enhancement',
    status: 'todo',
    attachments: [],
    createdAt: yesterday,
    updatedAt: yesterday,
    assignee: 'Alex R.',
  },
  {
    id: 'task_004',
    title: 'Implement dark mode toggle',
    description: 'Add system-aware dark mode with manual override. Store preference in localStorage and sync across tabs.',
    priority: 'Low',
    category: 'Feature',
    status: 'inprogress',
    attachments: [
      { id: 'att_004', name: 'design-tokens.pdf', type: 'pdf', size: '340 KB' },
    ],
    createdAt: twoDaysAgo,
    updatedAt: now,
    assignee: 'Sarah K.',
    dueDate: '2025-01-22',
  },
  {
    id: 'task_005',
    title: 'Add CSV export to reports',
    description: 'Users need to export their analytics data. Implement CSV and XLSX export for all report types with column customization.',
    priority: 'Medium',
    category: 'Feature',
    status: 'inprogress',
    attachments: [],
    createdAt: yesterday,
    updatedAt: now,
    assignee: 'Jordan L.',
    dueDate: '2025-01-25',
  },
  {
    id: 'task_006',
    title: 'Fix mobile nav overflow bug',
    description: 'Navigation items overflow on screens < 375px. Dropdown menu clips outside viewport on iPhone SE.',
    priority: 'Medium',
    category: 'Bug',
    status: 'inprogress',
    attachments: [
      { id: 'att_005', name: 'screenshot.png', type: 'image', size: '455 KB' },
    ],
    createdAt: twoDaysAgo,
    updatedAt: now,
    assignee: 'Mike T.',
  },
  {
    id: 'task_007',
    title: 'Set up CI/CD pipeline',
    description: 'Configure GitHub Actions workflow for automated testing, linting, and deployment to staging/production environments.',
    priority: 'High',
    category: 'Enhancement',
    status: 'done',
    attachments: [
      { id: 'att_006', name: 'pipeline-config.pdf', type: 'pdf', size: '220 KB' },
    ],
    createdAt: twoDaysAgo,
    updatedAt: now,
    assignee: 'Alex R.',
  },
  {
    id: 'task_008',
    title: 'Write API documentation',
    description: 'Document all public REST endpoints using OpenAPI 3.0 spec. Include authentication, rate limiting, and example payloads.',
    priority: 'Low',
    category: 'Enhancement',
    status: 'done',
    attachments: [],
    createdAt: twoDaysAgo,
    updatedAt: yesterday,
    assignee: 'Jordan L.',
  },
  {
    id: 'task_009',
    title: 'Add 2FA support',
    description: 'Implement TOTP-based two-factor authentication using authenticator apps. Add backup codes and SMS fallback.',
    priority: 'High',
    category: 'Feature',
    status: 'done',
    attachments: [],
    createdAt: twoDaysAgo,
    updatedAt: yesterday,
    assignee: 'Sarah K.',
    dueDate: '2025-01-15',
  },
];

// Local state store — swap out for Socket.IO later
let tasks: Task[] = [...INITIAL_TASKS];
const subscribers: Array<(tasks: Task[]) => void> = [];

const notify = () => {
  subscribers.forEach(cb => cb([...tasks]));
};

// Socket.IO-ready service
export const boardService: BoardService = {
  getTasks: () => [...tasks],

  createTask: (data: TaskFormData): Task => {

    const newTask: Task = {
      id: generateId(),
      ...data,
      attachments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    socket.emit(
      "task:create",
      newTask
    );

    return newTask;
  },

  updateTask: (id: string, data: Partial<TaskFormData>): Task => {

    socket.emit(
      "task:update",
      {
        id,
        data
      }
    );

    return tasks.find(t => t.id === id)!;

  },

  deleteTask: (id: string): void => {

    socket.emit(
      "task:delete",
      id
    );

  },

  moveTask: (taskId: string, newStatus: Status): void => {

    socket.emit(
      "task:move",
      {
        taskId,
        newStatus
      }
    );

  },

  // Placeholder for Socket.IO: socket.on('task:update', callback)
  onTaskUpdate: (callback: (tasks: Task[]) => void) => {
    subscribers.push(callback);
  },

  offTaskUpdate: () => {
    subscribers.length = 0;
  },
};
socket.on(
  "sync:tasks",
  (updatedTasks) => {

     tasks = updatedTasks;

     notify();

  }
);
