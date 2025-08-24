import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Sprint } from '../../types';
import { saveSprints, getSprints, generateId, getCurrentTimestamp } from '../../utils/localStorage';

interface SprintsState {
  sprints: Sprint[];
  activeSprint: Sprint | null;
  loading: boolean;
  error: string | null;
}

const initialState: SprintsState = {
  sprints: getSprints(), // Load from localStorage
  activeSprint: null, // We'll set this based on sprint status
  loading: false,
  error: null,
};

// Set active sprint on initialization
const loadedSprints = getSprints();
const activeSprint = loadedSprints.find(sprint => sprint.status === 'active') || null;
initialState.activeSprint = activeSprint;

const sprintsSlice = createSlice({
  name: 'sprints',
  initialState,
  reducers: {
    // Create a new sprint
    createSprint: (state, action: PayloadAction<{
      name: string;
      description: string;
      projectId: string;
      startDate?: string;
      endDate?: string;
    }>) => {
      const newSprint: Sprint = {
        id: generateId(),
        name: action.payload.name,
        description: action.payload.description,
        projectId: action.payload.projectId,
        status: 'planned',
        startDate: action.payload.startDate,
        endDate: action.payload.endDate,
        createdAt: getCurrentTimestamp(),
        updatedAt: getCurrentTimestamp(),
      };
      
      state.sprints.push(newSprint);
      saveSprints(state.sprints);
    },

    // Start a sprint
    startSprint: (state, action: PayloadAction<string>) => {
      // End any currently active sprint
      const currentActiveSprint = state.sprints.find(s => s.status === 'active');
      if (currentActiveSprint) {
        currentActiveSprint.status = 'completed';
        currentActiveSprint.updatedAt = getCurrentTimestamp();
      }

      // Start the new sprint
      const sprintIndex = state.sprints.findIndex(s => s.id === action.payload);
      if (sprintIndex !== -1) {
        state.sprints[sprintIndex].status = 'active';
        state.sprints[sprintIndex].updatedAt = getCurrentTimestamp();
        state.activeSprint = state.sprints[sprintIndex];
        
        // Set start date if not already set
        if (!state.sprints[sprintIndex].startDate) {
          state.sprints[sprintIndex].startDate = getCurrentTimestamp();
        }
      }
      
      saveSprints(state.sprints);
    },

    // Complete a sprint
    completeSprint: (state, action: PayloadAction<string>) => {
      const sprintIndex = state.sprints.findIndex(s => s.id === action.payload);
      if (sprintIndex !== -1) {
        state.sprints[sprintIndex].status = 'completed';
        state.sprints[sprintIndex].updatedAt = getCurrentTimestamp();
        
        // Set end date if not already set
        if (!state.sprints[sprintIndex].endDate) {
          state.sprints[sprintIndex].endDate = getCurrentTimestamp();
        }

        // Clear active sprint if this was it
        if (state.activeSprint?.id === action.payload) {
          state.activeSprint = null;
        }
      }
      
      saveSprints(state.sprints);
    },

    // Update sprint
    updateSprint: (state, action: PayloadAction<{ id: string; updates: Partial<Sprint> }>) => {
      const sprintIndex = state.sprints.findIndex(s => s.id === action.payload.id);
      if (sprintIndex !== -1) {
        state.sprints[sprintIndex] = {
          ...state.sprints[sprintIndex],
          ...action.payload.updates,
          updatedAt: getCurrentTimestamp(),
        };
        
        // Update active sprint if it's the one being updated
        if (state.activeSprint?.id === action.payload.id) {
          state.activeSprint = state.sprints[sprintIndex];
        }
        
        saveSprints(state.sprints);
      }
    },

    // Delete sprint
    deleteSprint: (state, action: PayloadAction<string>) => {
      state.sprints = state.sprints.filter(s => s.id !== action.payload);
      
      // Clear active sprint if it was deleted
      if (state.activeSprint?.id === action.payload) {
        state.activeSprint = null;
      }
      
      saveSprints(state.sprints);
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
  createSprint,
  startSprint,
  completeSprint,
  updateSprint,
  deleteSprint,
  setLoading,
  setError,
} = sprintsSlice.actions;

export default sprintsSlice.reducer;