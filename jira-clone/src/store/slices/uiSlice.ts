import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Task } from "../../types";

interface UIState {
  selectedTask: Task | null;
}

const initialState: UIState = {
  selectedTask: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Select a task (for modals, detail views, etc.)
    selectTask: (state, action: PayloadAction<Task | null>) => {
      state.selectedTask = action.payload;
    },
  },
});

export const {
  selectTask,
} = uiSlice.actions;

export default uiSlice.reducer;