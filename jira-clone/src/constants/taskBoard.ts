// constants/taskBoard.ts
import type { TaskStatus, TaskPriority } from '../types';

export const TASK_COLUMNS = [
  { status: 'todo' as TaskStatus, title: 'To Do', color: '#6c757d' },
  { status: 'in_progress' as TaskStatus, title: 'In Progress', color: '#007bff' },
  { status: 'in_review' as TaskStatus, title: 'In Review', color: '#ffc107' },
  { status: 'done' as TaskStatus, title: 'Done', color: '#28a745' }
] as const;

export const PRIORITY_CONFIG = {
  low: { label: 'Low', color: '#28a745' },
  medium: { label: 'Medium', color: '#ffc107' },
  high: { label: 'High', color: '#fd7e14' }
} as const;

export const DRAG_CONSTRAINTS = {
  activationDistance: 8
} as const;