import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Project, ProjectType } from '../../types';
import { saveProjects, getProjects, saveCurrentProject, getCurrentProject, generateId, getCurrentTimestamp } from '../../utils/localStorage';

// Define the initial state
interface ProjectsState {
  projects: Project[];
  currentProject: Project | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProjectsState = {
  projects: getProjects(), // Load from localStorage
  currentProject: getCurrentProject(), // Load from localStorage
  loading: false,
  error: null,
};

// Create the projects slice
const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    // Action to create a new project
    createProject: (state, action: PayloadAction<{ name: string; description: string; type: ProjectType }>) => {
      const newProject: Project = {
        id: generateId(),
        name: action.payload.name,
        description: action.payload.description,
        type: action.payload.type,
        createdAt: getCurrentTimestamp(),
        updatedAt: getCurrentTimestamp(),
      };
      
      state.projects.push(newProject);
      state.currentProject = newProject;
      
      // Persist to localStorage
      saveProjects(state.projects);
      saveCurrentProject(newProject);
    },

    // Action to select a project
    selectProject: (state, action: PayloadAction<string>) => {
      const project = state.projects.find(p => p.id === action.payload);
      if (project) {
        state.currentProject = project;
        saveCurrentProject(project);
      }
    },

    // Action to update a project
    updateProject: (state, action: PayloadAction<{ id: string; updates: Partial<Project> }>) => {
      const projectIndex = state.projects.findIndex(p => p.id === action.payload.id);
      if (projectIndex !== -1) {
        state.projects[projectIndex] = {
          ...state.projects[projectIndex],
          ...action.payload.updates,
          updatedAt: getCurrentTimestamp(),
        };
        
        // Update current project if it's the one being updated
        if (state.currentProject?.id === action.payload.id) {
          state.currentProject = state.projects[projectIndex];
          saveCurrentProject(state.currentProject);
        }
        
        saveProjects(state.projects);
      }
    },

    // Action to delete a project
    deleteProject: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter(p => p.id !== action.payload);
      
      // Clear current project if it was deleted
      if (state.currentProject?.id === action.payload) {
        state.currentProject = null;
        saveCurrentProject(null);
      }
      
      saveProjects(state.projects);
    },

    // Action to set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Action to set error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

// Export actions
export const {
  createProject,
  selectProject,
  updateProject,
  deleteProject,
  setLoading,
  setError,
} = projectsSlice.actions;

// Export reducer
export default projectsSlice.reducer;