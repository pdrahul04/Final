import { configureStore } from '@reduxjs/toolkit';
import projectsReducer from './slices/projectsSlice';
import tasksReducer from './slices/tasksSlice';
import sprintsReducer from './slices/sprintsSlice';
import uiReducer from './slices/uiSlice';

// Configure the Redux store
export const store = configureStore({
  reducer: {
    projects: projectsReducer,
    tasks: tasksReducer,
    sprints: sprintsReducer,
    ui: uiReducer,
  },
  // Enable Redux DevTools in development
  devTools: true,
});

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;