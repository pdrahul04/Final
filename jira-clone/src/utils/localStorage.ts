import type { Project, Sprint, Task } from "../types";

// Storage keys
const STORAGE_KEYS = {
  PROJECTS: 'jira_projects',
  TASKS: 'jira_tasks',
  SPRINTS: 'jira_sprints',
  CURRENT_PROJECT: 'jira_current_project'
} as const;

// Generic localStorage functions
export const saveToStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

export const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Failed to get from localStorage:', error);
    return defaultValue;
  }
};

export const removeFromStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to remove from localStorage:', error);
  }
};

// Specific functions for our app data
export const saveProjects = (projects: Project[]): void => {
  saveToStorage(STORAGE_KEYS.PROJECTS, projects);
};

export const getProjects = (): Project[] => {
  return getFromStorage<Project[]>(STORAGE_KEYS.PROJECTS, []);
};

export const saveTasks = (tasks: Task[]): void => {
  saveToStorage(STORAGE_KEYS.TASKS, tasks);
};

export const getTasks = (): Task[] => {
  return getFromStorage<Task[]>(STORAGE_KEYS.TASKS, []);
};

export const saveSprints = (sprints: Sprint[]): void => {
  saveToStorage(STORAGE_KEYS.SPRINTS, sprints);
};

export const getSprints = (): Sprint[] => {
  return getFromStorage<Sprint[]>(STORAGE_KEYS.SPRINTS, []);
};

export const saveCurrentProject = (project: Project | null): void => {
  saveToStorage(STORAGE_KEYS.CURRENT_PROJECT, project);
};

export const getCurrentProject = (): Project | null => {
  return getFromStorage<Project | null>(STORAGE_KEYS.CURRENT_PROJECT, null);
};

// Utility function to generate unique IDs
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Utility function to format dates
export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Utility function to get current timestamp
export const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};