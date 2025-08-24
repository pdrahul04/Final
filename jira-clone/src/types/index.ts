// Core data types for our Jira-like application

export type ProjectType = 'task' | 'scrum' | 'blank'

export type TaskStatus =  'todo' | 'in_progress' | 'in_review' | 'done'

export type TaskPriority = 'low' | 'medium'| 'high'

export type SprintStatus = 'planned' | 'active' |'completed'

export type ViewType = 'dashboard' | 'board' | 'backlog' | 'sprints';

// Basic interfaces
export interface Project {
  id: string;
  name: string;
  description: string;
  type: ProjectType;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: string;
  sprintId?: string; // Only for scrum projects
  assignee?: string;
  createdAt: string;
  updatedAt: string;
  position: number; // For drag & drop ordering
}

export interface Sprint {
  id: string;
  name: string;
  description: string;
  projectId: string;
  status: SprintStatus;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

// UI State types
export interface CreateProjectFormData {
  name: string;
  description: string;
  type: ProjectType;
}

export interface CreateTaskFormData {
  title: string;
  description: string;
  priority: TaskPriority;
  assignee?: string;
}

export interface CreateSprintFormData {
  name: string;
  description: string;
  startDate?: string;
  endDate?: string;
}

// App State (we'll use this when we set up Redux)
export interface RootState {
  projects: ProjectsState;
  tasks: TasksState;
  sprints: SprintsState;
  ui: UIState;
}

export interface ProjectsState {
  projects: Project[];
  currentProject: Project | null;
  loading: boolean;
  error: string | null;
}

export interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

export interface SprintsState {
  sprints: Sprint[];
  activeSprint: Sprint | null;
  loading: boolean;
  error: string | null;
}

export interface UIState {
  sidebarOpen: boolean;
  currentView: ViewType;
  selectedTask: Task | null;
}