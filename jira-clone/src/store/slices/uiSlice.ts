import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Task, ViewType } from "../../types";

interface UIState {
  sidebarOpen: boolean;
  currentView: ViewType;
  selectedTask: Task | null;
}

const initialState: UIState = {
  sidebarOpen: true,
  currentView: 'dashboard',
  selectedTask: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Toggle sidebar
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },

    // Set sidebar state
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },

    // Change current view
    setCurrentView: (state, action: PayloadAction<ViewType>) => {
      state.currentView = action.payload;
    },

    // Select a task (for modals, detail views, etc.)
    selectTask: (state, action: PayloadAction<Task | null>) => {
      state.selectedTask = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setCurrentView,
  selectTask,
} = uiSlice.actions;

export default uiSlice.reducer;