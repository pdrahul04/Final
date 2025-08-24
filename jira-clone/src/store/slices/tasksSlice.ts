import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Task, TaskPriority, TaskStatus } from '../../types';
import { saveTasks, getTasks, generateId, getCurrentTimestamp } from '../../utils/localStorage';

interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  tasks: getTasks(), // Load from localStorage
  loading: false,
  error: null,
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // Create a new task
    createTask: (state, action: PayloadAction<{
      title: string;
      description: string;
      priority: TaskPriority;
      projectId: string;
      sprintId?: string;
      assignee?: string;
      reporter?: string;
    }>) => {
      const newTask: Task = {
        id: generateId(),
        title: action.payload.title,
        description: action.payload.description,
        status: 'todo',
        priority: action.payload.priority,
        projectId: action.payload.projectId,
        sprintId: action.payload.sprintId,
        assignee: action.payload.assignee,
        reporter: action.payload.reporter,
        createdAt: getCurrentTimestamp(),
        updatedAt: getCurrentTimestamp(),
        position: state.tasks.length, // Add to end
      };
      
      state.tasks.push(newTask);
      saveTasks(state.tasks);
    },

    // Update task status
    updateTaskStatus: (state, action: PayloadAction<{ id: string; status: TaskStatus }>) => {
      const taskIndex = state.tasks.findIndex(t => t.id === action.payload.id);
      if (taskIndex !== -1) {
        state.tasks[taskIndex].status = action.payload.status;
        state.tasks[taskIndex].updatedAt = getCurrentTimestamp();
        saveTasks(state.tasks);
      }
    },

    // Update entire task
    updateTask: (state, action: PayloadAction<{ id: string; updates: Partial<Task> }>) => {
      const taskIndex = state.tasks.findIndex(t => t.id === action.payload.id);
      if (taskIndex !== -1) {
        state.tasks[taskIndex] = {
          ...state.tasks[taskIndex],
          ...action.payload.updates,
          updatedAt: getCurrentTimestamp(),
        };
        saveTasks(state.tasks);
      }
    },

    // Delete task
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(t => t.id !== action.payload);
      saveTasks(state.tasks);
    },

    // Move task to sprint (for scrum projects)
    moveTaskToSprint: (state, action: PayloadAction<{ taskId: string; sprintId: string | null | '' }>) => {
      const taskIndex = state.tasks.findIndex(t => t.id === action.payload.taskId);
      if (taskIndex !== -1) {
        state.tasks[taskIndex].sprintId = action.payload.sprintId || undefined;
        state.tasks[taskIndex].updatedAt = getCurrentTimestamp();
        saveTasks(state.tasks);
      }
    },

    // Reorder tasks (for drag & drop)
    reorderTasks: (state, action: PayloadAction<{ taskId: string; newPosition: number }>) => {
      const taskIndex = state.tasks.findIndex(t => t.id === action.payload.taskId);
      if (taskIndex !== -1) {
        state.tasks[taskIndex].position = action.payload.newPosition;
        saveTasks(state.tasks);
      }
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  createTask,
  updateTaskStatus,
  updateTask,
  deleteTask,
  moveTaskToSprint,
  reorderTasks,
  setLoading,
  setError,
} = tasksSlice.actions;

export default tasksSlice.reducer;